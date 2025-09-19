import { computed, Injectable, signal } from '@angular/core';
import { FormRow } from '../models/form';
import { FormField, FormDefinition } from '../models/field';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private _rows = signal<FormRow[]>([]);
  private _selectFieldId = signal<string | null>(null);
  public readonly rows = this._rows.asReadonly();
  public readonly selectField = computed(() =>
    this._rows()
      .flatMap((row) => row.fields)
      .find((field) => field.id === this._selectFieldId())
  );

  constructor() {
    this._rows.set([
      {
        id: crypto.randomUUID(),
        fields: [],
      },
    ]);
  }
  addField(field: FormField, rowId: string, index?: number) {
    const rows = this._rows();
    console.log(
      'FormService.addField() - adding field to rowId:',
      rowId,
      'field:',
      field
    );
    console.log('FormService.addField() - current rows before:', rows);
    const newRows = rows.map((rows) => {
      if (rows.id === rowId) {
        const updateFields = [...rows.fields];
        if (index !== undefined) {
          updateFields.splice(index, 0, field);
        } else {
          updateFields.push(field);
        }
        return { ...rows, fields: updateFields };
      }
      return rows;
    });
    console.log('FormService.addField() - new rows after:', newRows);
    this._rows.set(newRows);
  }
  deleteField(fieldId: string) {
    const rows = this._rows();
    const newRows = rows.map((row) => ({
      ...row,
      fields: row.fields.filter((f) => f.id !== fieldId),
    }));
    this._rows.set(newRows);
  }
  addRow() {
    const newRow: FormRow = {
      id: crypto.randomUUID(),
      fields: [],
    };
    const rows = this._rows();
    console.log('FormService.addRow() - current rows before:', rows);
    console.log('FormService.addRow() - adding new row:', newRow);
    this._rows.set([...rows, newRow]);
    console.log('FormService.addRow() - rows after:', this._rows());
  }
  deleteRow(rowId: string) {
    if (this._rows().length === 1) {
      return;
    }
    const rows = this._rows();
    const newRows = rows.filter((row) => row.id !== rowId);
    this._rows.set(newRows);
  }
  moveField(
    fieldId: string,
    sourceRowId: string,
    targetRowId: string,
    targetIndex: number = -1
  ) {
    const rows = this._rows();
    let fieldToMove: FormField | undefined;
    let sourceRowIndex = -1;
    let sourceFieldIndex = -1;
    rows.forEach((row, rowIndex) => {
      if (row.id === sourceRowId) {
        sourceRowIndex = rowIndex;
        sourceFieldIndex = row.fields.findIndex(
          (field) => field.id === fieldId
        );
        if (sourceFieldIndex >= 0) {
          fieldToMove = row.fields[sourceFieldIndex];
        }
      }
    });
    if (!fieldToMove) {
      return;
    }
    const newRows = [...rows];
    const fieldsWithRemovedField = newRows[sourceRowIndex].fields.filter(
      (f) => f.id !== fieldId
    );
    newRows[sourceRowIndex].fields = fieldsWithRemovedField;
    const targeRowIndex = newRows.findIndex((r) => r.id === targetRowId);
    if (targeRowIndex >= 0) {
      const targetFields = [...newRows[targeRowIndex].fields];
      targetFields.splice(targetIndex, 0, fieldToMove);
      newRows[targeRowIndex].fields = targetFields;
    }
    this._rows.set(newRows);
  }
  setSelectedField(fieldId: string) {
    this._selectFieldId.set(fieldId);
  }

  updateField(fieldId: string, key: string, value: any) {
    const rows = this._rows();
    const newRows = rows.map((row) => ({
      ...row,
      fields: row.fields.map((field) => {
        if (field.id === fieldId) {
          return { ...field, [key]: value };
        }
        return field;
      }),
    }));
    this._rows.set(newRows);
  }

  getFormFields(): FormField[] {
    return this._rows().flatMap((row) => row.fields);
  }

  // Snapshot current rows (for saving layout)
  getRowsSnapshot(): FormRow[] {
    const rows = this._rows();
    console.log('FormService.getRowsSnapshot() - current rows:', rows);
    const snapshot = rows.map((r) => ({ id: r.id, fields: [...r.fields] }));
    console.log('FormService.getRowsSnapshot() - snapshot:', snapshot);
    return snapshot;
  }

  loadFormDefinition(formDefinition: FormDefinition) {
    // Clear existing rows
    const newRows: FormRow[] = [];

    if (formDefinition.fields && formDefinition.fields.length > 0) {
      // Create a single row with all fields from the template
      const newRow: FormRow = {
        id: crypto.randomUUID(),
        fields: [...formDefinition.fields],
      };
      newRows.push(newRow);
    } else {
      // If no fields, create an empty row
      newRows.push({
        id: crypto.randomUUID(),
        fields: [],
      });
    }

    this._rows.set(newRows);
    this._selectFieldId.set(null); // Clear any selected field
  }

  // Set rows directly (used when loading layouts from schemaJson extensions)
  setRows(rows: FormRow[]) {
    this._rows.set(rows.map((r) => ({ id: r.id, fields: [...r.fields] })));
    this._selectFieldId.set(null);
  }

  clearForm() {
    this._rows.set([
      {
        id: crypto.randomUUID(),
        fields: [],
      },
    ]);
    this._selectFieldId.set(null);
  }

  getCurrentFormDefinition(): FormDefinition {
    const fields = this.getFormFields();
    return {
      id: 'current-form-' + Date.now(),
      name: 'Current Form',
      fields: fields,
      settings: {
        submitButtonText: 'Submit',
        showResetButton: true,
        resetButtonText: 'Reset',
        layout: 'vertical',
      },
    };
  }

  setCurrentForm(form: FormDefinition) {
    this.loadFormDefinition(form);
  }
}
