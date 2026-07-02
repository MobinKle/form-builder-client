export type CreateFormValues = {
  title: string;
  isRequired: boolean;
  responder: string;
  registrar: string;
  startDate?: Date;
  endDate?: Date;
  center: string;
  organization: string;
  structure: string;
};

export type SelectOption = {
  label: string;
  value: string;
};

export const createFormInitialValues: CreateFormValues = {
  title: '',
  isRequired: false,
  responder: '',
  registrar: '',
  startDate: undefined,
  endDate: undefined,
  center: '',
  organization: '',
  structure: '',
};

export const responderOptions: SelectOption[] = [
  { label: 'مشتری', value: 'customer' },
  { label: 'کارمند', value: 'employee' },
  { label: 'شرکت‌کننده', value: 'participant' },
  { label: 'مدیر پروژه', value: 'project-manager' },
];

export const registrarOptions: SelectOption[] = [
  { label: 'واحد منابع انسانی', value: 'hr' },
  { label: 'واحد پشتیبانی', value: 'support' },
  { label: 'واحد آموزش', value: 'education' },
  { label: 'واحد فنی', value: 'technical' },
];

export const centerOptions: SelectOption[] = [
  { label: 'مرکز تهران', value: 'tehran' },
  { label: 'مرکز اصفهان', value: 'isfahan' },
  { label: 'مرکز شیراز', value: 'shiraz' },
];

export const organizationOptions: SelectOption[] = [
  { label: 'سازمان مرکزی', value: 'main-organization' },
  { label: 'سازمان فروش', value: 'sales-organization' },
  { label: 'سازمان خدمات', value: 'service-organization' },
];

export const structureOptions: SelectOption[] = [
  { label: 'ساختار منابع انسانی', value: 'hr-structure' },
  { label: 'ساختار پشتیبانی', value: 'support-structure' },
  { label: 'ساختار فنی', value: 'technical-structure' },
];

export const validateCreateForm = (values: CreateFormValues) => {
  const errors: Partial<Record<keyof CreateFormValues, string>> = {};

  if (!values.title.trim()) {
    errors.title = 'عنوان پرسشنامه الزامی است';
  }

  if (!values.responder) {
    errors.responder = 'پاسخ‌دهنده را انتخاب کنید';
  }

  if (!values.registrar) {
    errors.registrar = 'ثبت‌کننده را انتخاب کنید';
  }

  if (!values.startDate) {
    errors.startDate = 'تاریخ شروع را انتخاب کنید';
  }

  if (!values.endDate) {
    errors.endDate = 'تاریخ پایان را انتخاب کنید';
  }

  if (values.startDate && values.endDate && values.startDate > values.endDate) {
    errors.endDate = 'تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد';
  }

  if (!values.center) {
    errors.center = 'مرکز را انتخاب کنید';
  }

  if (!values.organization) {
    errors.organization = 'سازمان را انتخاب کنید';
  }

  if (!values.structure) {
    errors.structure = 'ساختار را انتخاب کنید';
  }

  return errors;
};
