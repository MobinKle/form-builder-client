import axios from 'axios';

export type ApiSelectOption = {
  id: number | string;
  value: string;
  title: string;
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

function mapOptions(options: ApiSelectOption[] = []): SelectOption[] {
  return options.map(option => ({
    value: option.value,
    label: option.title || option.value,
  }));
}

export async function getCreateFormOptions(): Promise<CreateFormSelectOptions> {
  const response = await axios.get(CREATE_FORM_OPTIONS_URL);

  const data = normalizeApiResponse(response.data);

  return {
    responderOptions: mapOptions(data.responderOptions),
    registrarOptions: mapOptions(data.registrarOptions),
    centerOptions: mapOptions(data.centerOptions),
    organizationOptions: mapOptions(data.organizationOptions),
    structureOptions: mapOptions(data.structureOptions),
  };
}
