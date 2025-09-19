import { Injectable } from '@angular/core';
import { FormField } from '../models/field';
import { TextFieldComponent } from '../components/field-types/text-field/text-field.component';
import { TextareaFieldComponent } from '../components/field-types/textarea-field/textarea-field.component';
import { NumberFieldComponent } from '../components/field-types/number-field/number-field.component';
import { EmailFieldComponent } from '../components/field-types/email-field/email-field.component';
import { SelectFieldComponent } from '../components/field-types/select-field/select-field.component';
import { MultiselectFieldComponent } from '../components/field-types/multiselect-field/multiselect-field.component';
import { RadioFieldComponent } from '../components/field-types/radio-field/radio-field.component';
import { CheckboxFieldComponent } from '../components/field-types/checkbox-field/checkbox-field.component';
import { DateFieldComponent } from '../components/field-types/date-field/date-field.component';
import { FileFieldComponent } from '../components/field-types/file-field/file-field.component';
import { ButtonFieldComponent } from '../components/field-types/button-field/button-field.component';

export interface FieldTypeDefinition {
  type: string;
  label: string;
  icon: string;
  defaultConfig: Partial<FormField>;
  settingsConfig: Array<{
    type: 'text' | 'number' | 'checkbox' | 'select' | 'textarea';
    label: string;
    key: string;
    options?: Array<{ label: string; value: any }>;
  }>;
  component: any;
}

@Injectable({
  providedIn: 'root',
})
export class FieldTypesService {
  private fieldTypes: Map<string, FieldTypeDefinition> = new Map();

  constructor() {
    this.initializeFieldTypes();
  }

  private initializeFieldTypes() {
    // Text Field
    this.fieldTypes.set('text', TEXT_FIELD_DEFINITION);

    // Textarea Field
    this.fieldTypes.set('textarea', TEXTAREA_FIELD_DEFINITION);

    // Number Field
    this.fieldTypes.set('number', NUMBER_FIELD_DEFINITION);

    // Email Field
    this.fieldTypes.set('email', EMAIL_FIELD_DEFINITION);

    // Select Field
    this.fieldTypes.set('select', SELECT_FIELD_DEFINITION);

    // Multi-Select Field
    this.fieldTypes.set('multiselect', MULTISELECT_FIELD_DEFINITION);

    // Radio Field
    this.fieldTypes.set('radio', RADIO_FIELD_DEFINITION);

    // Checkbox Field
    this.fieldTypes.set('checkbox', CHECKBOX_FIELD_DEFINITION);

    // Date Field
    this.fieldTypes.set('date', DATE_FIELD_DEFINITION);

    // File Field
    this.fieldTypes.set('file', FILE_FIELD_DEFINITION);

    // Button Field
    this.fieldTypes.set('button', BUTTON_FIELD_DEFINITION);
  }

  getFieldTypes(): FieldTypeDefinition[] {
    return Array.from(this.fieldTypes.values());
  }

  getFieldType(type: string): FieldTypeDefinition | undefined {
    return this.fieldTypes.get(type);
  }

  createField(type: string): FormField {
    const fieldType = this.fieldTypes.get(type);
    if (!fieldType) {
      throw new Error(`Unknown field type: ${type}`);
    }

    const id = this.generateFieldId(type);
    return {
      id,
      type,
      label: fieldType.defaultConfig.label || '',
      required: fieldType.defaultConfig.required || false,
      ...fieldType.defaultConfig,
    };
  }

  private generateFieldId(type: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${type}_${timestamp}_${random}`;
  }
}

const SELECT_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'select',
  label: 'Dropdown',
  icon: 'arrow_drop_down',
  defaultConfig: {
    label: 'Dropdown',
    required: false,
    placeholder: 'Select an option',
    optionSource: 'static',
    staticOptions: 'Option 1, Option 2, Option 3, Option 4',
    apiConfig: {
      url: '',
      method: 'GET',
      headers: {},
      params: {},
      dataPath: '',
      valueField: 'value',
      labelField: 'label',
      transformFunction: '',
    },
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
    {
      type: 'select',
      label: 'Option Source',
      key: 'optionSource',
      options: [
        { label: 'Static Options', value: 'static' },
        { label: 'External API', value: 'external' },
      ],
    },
    {
      type: 'text',
      label: 'Static Options (comma-separated)',
      key: 'staticOptions',
    },
    { type: 'text', label: 'External API URL', key: 'apiConfig.url' },
    {
      type: 'select',
      label: 'HTTP Method',
      key: 'apiConfig.method',
      options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' },
      ],
    },
    { type: 'text', label: 'Data Path (JSON path)', key: 'apiConfig.dataPath' },
    { type: 'text', label: 'Value Field', key: 'apiConfig.valueField' },
    { type: 'text', label: 'Label Field', key: 'apiConfig.labelField' },
  ],
  component: SelectFieldComponent,
};

const MULTISELECT_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'multiselect',
  label: 'Multi Select',
  icon: 'checklist',
  defaultConfig: {
    label: 'Multi Select',
    required: false,
    placeholder: 'Choose options',
    optionSource: 'static',
    staticOptions: 'Option 1, Option 2, Option 3, Option 4',
    maxSelections: 5,
    apiConfig: {
      url: '',
      method: 'GET',
      headers: {},
      params: {},
      dataPath: '',
      valueField: 'value',
      labelField: 'label',
      transformFunction: '',
    },
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
    { type: 'number', label: 'Max Selections', key: 'maxSelections' },
    {
      type: 'select',
      label: 'Option Source',
      key: 'optionSource',
      options: [
        { label: 'Static Options', value: 'static' },
        { label: 'External API', value: 'external' },
      ],
    },
    {
      type: 'text',
      label: 'Static Options (comma-separated)',
      key: 'staticOptions',
    },
    { type: 'text', label: 'External API URL', key: 'apiConfig.url' },
    {
      type: 'select',
      label: 'HTTP Method',
      key: 'apiConfig.method',
      options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' },
      ],
    },
    { type: 'text', label: 'Data Path (JSON path)', key: 'apiConfig.dataPath' },
    { type: 'text', label: 'Value Field', key: 'apiConfig.valueField' },
    { type: 'text', label: 'Label Field', key: 'apiConfig.labelField' },
  ],
  component: MultiselectFieldComponent,
};

const RADIO_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'radio',
  label: 'Radio Buttons',
  icon: 'radio_button_checked',
  defaultConfig: {
    label: 'Radio Buttons',
    required: false,
    optionSource: 'static',
    staticOptions: 'Option 1, Option 2, Option 3, Option 4',
    allowMultiple: false,
    maxSelections: 3,
    minSelections: 1,
    apiConfig: {
      url: '',
      method: 'GET',
      headers: {},
      params: {},
      dataPath: '',
      valueField: 'value',
      labelField: 'label',
      transformFunction: '',
    },
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'checkbox', label: 'Required', key: 'required' },
    {
      type: 'checkbox',
      label: 'Allow Multiple Selections',
      key: 'allowMultiple',
    },
    { type: 'number', label: 'Min Selections', key: 'minSelections' },
    { type: 'number', label: 'Max Selections', key: 'maxSelections' },
    {
      type: 'select',
      label: 'Option Source',
      key: 'optionSource',
      options: [
        { label: 'Static Options', value: 'static' },
        { label: 'External API', value: 'external' },
      ],
    },
    {
      type: 'text',
      label: 'Static Options (comma-separated)',
      key: 'staticOptions',
    },
    { type: 'text', label: 'External API URL', key: 'apiConfig.url' },
    {
      type: 'select',
      label: 'HTTP Method',
      key: 'apiConfig.method',
      options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' },
      ],
    },
    { type: 'text', label: 'Data Path (JSON path)', key: 'apiConfig.dataPath' },
    { type: 'text', label: 'Value Field', key: 'apiConfig.valueField' },
    { type: 'text', label: 'Label Field', key: 'apiConfig.labelField' },
  ],
  component: RadioFieldComponent,
};

const TEXT_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'text',
  label: 'Text Input',
  icon: 'input',
  defaultConfig: {
    label: 'Text Input',
    required: false,
    placeholder: 'Enter text',
    inputType: 'text',
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
    {
      type: 'select',
      label: 'Input Type',
      key: 'inputType',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Password', value: 'password' },
        { label: 'Tel', value: 'tel' },
        { label: 'URL', value: 'url' },
      ],
    },
  ],
  component: TextFieldComponent,
};

const TEXTAREA_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'textarea',
  label: 'Text Area',
  icon: 'subject',
  defaultConfig: {
    label: 'Text Area',
    required: false,
    placeholder: 'Enter text',
    rows: 3,
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
    { type: 'number', label: 'Rows', key: 'rows' },
  ],
  component: TextareaFieldComponent,
};

const NUMBER_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'number',
  label: 'Number Input',
  icon: 'pin',
  defaultConfig: {
    label: 'Number Input',
    required: false,
    placeholder: 'Enter number',
    min: 0,
    max: 100,
    step: 1,
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
    { type: 'number', label: 'Min Value', key: 'min' },
    { type: 'number', label: 'Max Value', key: 'max' },
    { type: 'number', label: 'Step', key: 'step' },
  ],
  component: NumberFieldComponent,
};

const EMAIL_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'email',
  label: 'Email Input',
  icon: 'email',
  defaultConfig: {
    label: 'Email Input',
    required: false,
    placeholder: 'Enter email',
    inputType: 'email',
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
  ],
  component: EmailFieldComponent,
};

const CHECKBOX_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'checkbox',
  label: 'Checkbox',
  icon: 'check_box',
  defaultConfig: {
    label: 'Checkbox',
    required: false,
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'checkbox', label: 'Required', key: 'required' },
  ],
  component: CheckboxFieldComponent,
};

const DATE_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'date',
  label: 'Date Input',
  icon: 'calendar_today',
  defaultConfig: {
    label: 'Date Input',
    required: false,
    placeholder: 'Select date',
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
  ],
  component: DateFieldComponent,
};

const FILE_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'file',
  label: 'File Upload',
  icon: 'attach_file',
  defaultConfig: {
    label: 'File Upload',
    required: false,
    accept: '*/*',
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'checkbox', label: 'Required', key: 'required' },
    { type: 'text', label: 'Accept', key: 'accept' },
  ],
  component: FileFieldComponent,
};

const BUTTON_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'button',
  label: 'Button',
  icon: 'smart_button',
  defaultConfig: {
    label: 'Button',
    buttonText: 'Click me',
    showCancelButton: false,
    alignment: 'left',
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Button Text', key: 'buttonText' },
    { type: 'checkbox', label: 'Show Cancel Button', key: 'showCancelButton' },
    {
      type: 'select',
      label: 'Alignment',
      key: 'alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
  component: ButtonFieldComponent,
};
