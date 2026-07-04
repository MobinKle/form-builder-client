import axios from 'axios';

export type SupportedLanguage = 'fa' | 'en';

export type ApiLocalizedLabel = {
  fa: string;
  en: string;
};

export type ApiSelectOption = {
  id: number | string;
  value: string;
  label: ApiLocalizedLabel;
};

export type CreateFormOptionsResponse = {
  responderOptions: ApiSelectOption[];
  registrarOptions: ApiSelectOption[];
  centerOptions: ApiSelectOption[];
  organizationOptions: ApiSelectOption[];
  structureOptions: ApiSelectOption[];
};

export type SelectOption = {
  label: string;
  value: string;
};

export type CreateFormSelectOptions = {
  responderOptions: SelectOption[];
  registrarOptions: SelectOption[];
  centerOptions: SelectOption[];
  organizationOptions: SelectOption[];
  structureOptions: SelectOption[];
};

const CREATE_FORM_OPTIONS_URL =
  'https://6a3f860c9b6d371e8380e8d5.mockapi.io/Form-Management-center-organ-structure';

function normalizeApiResponse(data: unknown): CreateFormOptionsResponse {
  if (Array.isArray(data)) {
    return data[0] as CreateFormOptionsResponse;
  }

  return data as CreateFormOptionsResponse;
}

function mapLocalizedOptions(
  options: ApiSelectOption[] = [],
  language: string,
): SelectOption[] {
  const currentLanguage: SupportedLanguage = language === 'en' ? 'en' : 'fa';

  return options.map(option => ({
    value: option.value,
    label: option.label[currentLanguage] ?? option.label.fa ?? option.value,
  }));
}

export async function getCreateFormOptions(
  language: string,
): Promise<CreateFormSelectOptions> {
  const response = await axios.get(CREATE_FORM_OPTIONS_URL);

  const data = normalizeApiResponse(response.data);

  return {
    responderOptions: mapLocalizedOptions(data.responderOptions, language),
    registrarOptions: mapLocalizedOptions(data.registrarOptions, language),
    centerOptions: mapLocalizedOptions(data.centerOptions, language),
    organizationOptions: mapLocalizedOptions(data.organizationOptions, language),
    structureOptions: mapLocalizedOptions(data.structureOptions, language),
  };
}
