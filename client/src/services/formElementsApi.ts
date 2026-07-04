import axios from 'axios';

export type ApiFormElement = {
  id: number | string;
  type: string;
  title: string;
  icon?: string;
};

type ApiResponseItem = {
  FormElements: ApiFormElement[];
};

const FORM_ELEMENTS_URL =
  'https://6a3f860c9b6d371e8380e8d5.mockapi.io/form-elements';

export async function getFormElements(): Promise<ApiFormElement[]> {
  const response = await axios.get<ApiResponseItem[]>(FORM_ELEMENTS_URL);

  return response.data?.[0]?.FormElements ?? [];
}
