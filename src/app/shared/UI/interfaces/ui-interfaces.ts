export interface ButtonConfig {
  label?: string;
  icon?: string;
  severity?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warn'
    | 'help'
    | 'danger'
    | 'contrast';
  size?: 'small' | 'large';
  text?: boolean;
  rounded?: boolean;
  outlined?: boolean;
  raised?: boolean;
  styleClass?: string;
  disabled?: boolean;
}

export interface FloatLabelConfig {
  label: string;
  placeholder?: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  styleClass?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  autocomplete?: string;
}

export interface SelectFloatLabelConfig {
  label: string;
  id: string;
  options: any[];
  optionLabel?: string;
  optionValue?: string;
  styleClass?: string;
  disabled?: boolean;
  placeholder?: string;
}

export interface TableColumn {
  field: string;
  header: string;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'actions' | 'custom';
  sortable?: boolean;
  filterable?: boolean;
  customTemplate?: string;
}

export interface TableConfig {
  columns: TableColumn[];
  showRowNumbers?: boolean;
  showActions?: boolean;
  actions?: {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
    custom?: Array<{
      icon: string;
      label?: string;
      action: string;
      styleClass?: string;
    }>;
  };
  styleClass?: string;
  paginator?: boolean;
  rows?: number;
  totalRecords?: number;
}

// Dynamic dialog + form configs
export type DynamicFormFieldType = 'text' | 'select';

export interface DynamicFormFieldBase {
  key: string;
  label: string;
  type: DynamicFormFieldType;
  placeholder?: string;
  required?: boolean;
}

export interface DynamicTextField extends DynamicFormFieldBase {
  type: 'text';
}

export interface DynamicSelectField extends DynamicFormFieldBase {
  type: 'select';
  options: Array<{ label: string; value: any }>;
}

export type DynamicFormField = DynamicTextField | DynamicSelectField;

export interface DynamicDialogData {
  header: string;
  submitLabel?: string;
  cancelLabel?: string;
  fields: DynamicFormField[];
  initialValue?: Record<string, any>;
}
