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

export const validateCreateForm = (
  values: CreateFormValues,
  t: (key: string, defaultValue: string) => string,
) => {
  const errors: Partial<Record<keyof CreateFormValues, string>> = {};

  if (!values.title.trim()) {
    errors.title = t(
      'createForm.validation.titleRequired',
      'عنوان پرسشنامه الزامی است',
    );
  }

  if (!values.responder) {
    errors.responder = t(
      'createForm.validation.responderRequired',
      'پاسخ‌دهنده را انتخاب کنید',
    );
  }

  if (!values.registrar) {
    errors.registrar = t(
      'createForm.validation.registrarRequired',
      'ثبت‌کننده را انتخاب کنید',
    );
  }

  if (!values.startDate) {
    errors.startDate = t(
      'createForm.validation.startDateRequired',
      'تاریخ شروع را انتخاب کنید',
    );
  }

  if (!values.endDate) {
    errors.endDate = t(
      'createForm.validation.endDateRequired',
      'تاریخ پایان را انتخاب کنید',
    );
  }

  if (values.startDate && values.endDate && values.startDate > values.endDate) {
    errors.endDate = t(
      'createForm.validation.endDateBeforeStartDate',
      'تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد',
    );
  }

  if (!values.center) {
    errors.center = t(
      'createForm.validation.centerRequired',
      'مرکز را انتخاب کنید',
    );
  }

  if (!values.organization) {
    errors.organization = t(
      'createForm.validation.organizationRequired',
      'سازمان را انتخاب کنید',
    );
  }

  if (!values.structure) {
    errors.structure = t(
      'createForm.validation.structureRequired',
      'ساختار را انتخاب کنید',
    );
  }

  return errors;
};
