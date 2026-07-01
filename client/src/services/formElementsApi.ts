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
  const res = await fetch(FORM_ELEMENTS_URL);

  if (!res.ok) {
    throw new Error('Failed to fetch form elements');
  }

  const data: ApiResponseItem[] = await res.json();

  return data?.[0]?.FormElements ?? [];
}
