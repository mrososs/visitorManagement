import { Injectable } from '@angular/core';
import { FormDefinition, FormField } from '../models/field';

export interface BackendFormExport {
  name: string;
  schemaJson: string;
}

export interface FormSubmissionExport {
  formDefinitionId: number;
  dataJson: string;
  workPermitId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class FormExportService {
  constructor() {}

  /**
   * Export form definition for backend API
   */
  exportToBackend(
    form: FormDefinition,
    readOnly: boolean = false,
    rows?: any[]
  ): BackendFormExport {
    return {
      name: form.name,
      schemaJson: this.generateSchemaJson(form, readOnly, rows),
    };
  }

  /**
   * Export form submission data for backend API
   */
  exportSubmission(
    formData: any,
    formDefinitionId: number,
    workPermitId?: number
  ): FormSubmissionExport {
    return {
      formDefinitionId,
      dataJson: JSON.stringify(formData),
      workPermitId,
    };
  }

  /**
   * Export form definition to JSON format
   */
  exportToJson(
    formDefinition: FormDefinition,
    readOnly: boolean = false
  ): string {
    const exportData = {
      formDefinition: formDefinition,
      schemaJson: this.generateSchemaJson(formDefinition, readOnly),
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      readOnly: readOnly,
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Generate JSON schema for the form (OpenAPI 3.0.1 compatible)
   */
  private generateSchemaJson(
    form: FormDefinition,
    readOnly: boolean = false,
    rows?: any[]
  ): string {
    console.log('FormExportService - rows received:', rows);
    const schema = {
      openapi: '3.0.1',
      info: {
        title: form.name,
        version: '1.0',
        description: `Form definition for ${form.name}`,
      },
      // Preserve editor layout in an extension for round-tripping
      'x-layout': {
        rows: rows || (form as any).rows || [],
      },
      paths: {
        [`/api/Forms/${form.id}`]: {
          post: {
            tags: ['Forms'],
            summary: `Submit ${form.name} form`,
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    $ref: `#/components/schemas/${this.generateSchemaName(
                      form.name
                    )}`,
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Form submitted successfully',
              },
              '400': {
                description: 'Invalid form data',
              },
            },
          },
        },
      },
      components: {
        schemas: {
          [this.generateSchemaName(form.name)]: this.generateFormSchema(
            form,
            readOnly
          ),
        },
      },
    };

    const schemaJson = JSON.stringify(schema, null, 2);
    console.log('FormExportService - final schemaJson:', schemaJson);
    return schemaJson;
  }

  /**
   * Generate OpenAPI schema for form fields
   */
  private generateFormSchema(
    form: FormDefinition,
    readOnly: boolean = false
  ): any {
    const properties: any = {};
    const required: string[] = [];

    form.fields.forEach((field) => {
      const fieldSchema = this.generateFieldSchema(field);
      properties[field.id] = fieldSchema;

      if (field.required) {
        required.push(field.id);
      }
    });

    return {
      type: 'object',
      title: form.name,
      description: `Schema for ${form.name} form`,
      properties,
      required: required.length > 0 ? required : undefined,
      readOnly: readOnly,
    };
  }

  /**
   * Generate schema for individual field
   */
  private generateFieldSchema(field: FormField): any {
    const baseSchema: any = {
      type: this.getFieldType(field.type),
      title: field.label,
      nullable: !field.required,
    };

    // Add field-specific properties
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'tel':
      case 'url':
        if (field.placeholder) {
          baseSchema.description = field.placeholder;
        }
        if (field.min !== undefined) {
          baseSchema.minLength = field.min;
        }
        if (field.max !== undefined) {
          baseSchema.maxLength = field.max;
        }
        if (field.type === 'email') {
          baseSchema.format = 'email';
        }
        if (field.type === 'url') {
          baseSchema.format = 'uri';
        }
        break;

      case 'number':
        if (field.min !== undefined) {
          baseSchema.minimum = field.min;
        }
        if (field.max !== undefined) {
          baseSchema.maximum = field.max;
        }
        if (field.step !== undefined) {
          baseSchema.multipleOf = field.step;
        }
        break;

      case 'textarea':
        baseSchema.type = 'string';
        if (field.rows) {
          baseSchema.description = `${field.rows} rows`;
        }
        break;

      case 'select':
      case 'multiselect':
        const options = this.getFieldOptions(field);
        if (options.length > 0) {
          baseSchema.enum = options;
        }
        if (field.type === 'multiselect') {
          baseSchema.type = 'array';
          baseSchema.items = {
            type: 'string',
            enum: options,
          };
          baseSchema.uniqueItems = true;
        }
        break;

      case 'radio':
        if (field.allowMultiple) {
          baseSchema.type = 'array';
          const options = this.getFieldOptions(field);
          baseSchema.items = {
            type: 'string',
            enum: options,
          };
          baseSchema.uniqueItems = true;
          if (field.minSelections) {
            baseSchema.minItems = field.minSelections;
          }
          if (field.maxSelections) {
            baseSchema.maxItems = field.maxSelections;
          }
        } else {
          const options = this.getFieldOptions(field);
          if (options.length > 0) {
            baseSchema.enum = options;
          }
        }
        break;

      case 'checkbox':
        baseSchema.type = 'boolean';
        break;

      case 'date':
        baseSchema.type = 'string';
        baseSchema.format = 'date';
        break;

      case 'file':
        baseSchema.type = 'string';
        baseSchema.format = 'binary';
        if (field.accept) {
          baseSchema.description = `Accepted types: ${field.accept}`;
        }
        break;
    }

    return baseSchema;
  }

  /**
   * Get field type for OpenAPI schema
   */
  private getFieldType(fieldType: string): string {
    const typeMap: { [key: string]: string } = {
      text: 'string',
      email: 'string',
      password: 'string',
      tel: 'string',
      url: 'string',
      textarea: 'string',
      number: 'number',
      select: 'string',
      multiselect: 'array',
      radio: 'string',
      checkbox: 'boolean',
      date: 'string',
      file: 'string',
      button: 'string',
    };

    return typeMap[fieldType] || 'string';
  }

  /**
   * Get field options for enum fields
   */
  private getFieldOptions(field: FormField): string[] {
    if (field.optionSource === 'static' && field.staticOptions) {
      return this.parseStaticOptions(field.staticOptions).map(
        (opt) => opt.value
      );
    }

    // For external API options, we can't determine at schema generation time
    // Return empty array or placeholder
    return [];
  }

  /**
   * Parse static options from comma-separated string or JSON
   */
  private parseStaticOptions(
    staticOptions: string
  ): Array<{ value: string; label: string }> {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(staticOptions);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({
          value: String(item.value || item),
          label: String(item.label || item),
        }));
      }
    } catch {
      // If not JSON, treat as comma-separated values
    }

    // Parse comma-separated values
    return staticOptions
      .split(',')
      .map((option) => option.trim())
      .filter((option) => option.length > 0)
      .map((option) => ({
        value: option,
        label: option,
      }));
  }

  /**
   * Generate schema name from form name
   */
  private generateSchemaName(formName: string): string {
    return (
      formName
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace(/^[a-z]/, (letter) => letter.toUpperCase()) + 'Schema'
    );
  }

  /**
   * Get summary of field types in the form
   */
  private getFieldTypesSummary(form: FormDefinition): {
    [key: string]: number;
  } {
    const summary: { [key: string]: number } = {};
    form.fields.forEach((field) => {
      summary[field.type] = (summary[field.type] || 0) + 1;
    });
    return summary;
  }
}
