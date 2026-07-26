import axios from 'axios';

export type ApiFormElement = {
  id: number | string;
  type: string;
  title: string;
  icon?: string;
};

type AnswerTypeApiItem = {
  id: number;
  key: string;
  title: string;
};

const FORM_ELEMENTS_URL =
  'https://localhost:7163/api/surveys/questionnaires/answer-types';

const answerTypeUiMap: Record<string, { type: string; icon: string }> = {
  Numeric: {
    type: 'numeric-code',
    icon: 'NumberSvg',
  },
  FreeText: {
    type: 'free-text',
    icon: 'TextEditStyleSvg',
  },
  SingleChoice: {
    type: 'single-choice',
    icon: 'ListSvg',
  },
  MultipleChoice: {
    type: 'multi-option',
    icon: 'ListSvg',
  },
  MultipleNumeric: {
    type: 'multi-number-choice',
    icon: 'ListSvg',
  },
  Date: {
    type: 'custom-date',
    icon: 'CalendarDaysIcon',
  },
  Image: {
    type: 'custom-image',
    icon: 'ImageIcon',
  },
  NationalId: {
    type: 'national-code',
    icon: 'HeadingIcon',
  },
  MobileNumber: {
    type: 'mobile',
    icon: 'Phone',
  },
  PhoneNumber: {
    type: 'phone-number',
    icon: 'Phone',
  },
  Email: {
    type: 'email',
    icon: 'MailIcon',
  },
  Slider: {
    type: 'slider',
    icon: 'SlidersHorizontalIcon',
  },
  CardNumber: {
    type: 'card-number',
    icon: 'CreditCardIcon',
  },
  Iban: {
    type: 'iban',
    icon: 'TextIcon',
  },
};

export async function getFormElements(): Promise<ApiFormElement[]> {
  const response = await axios.get<AnswerTypeApiItem[]>(FORM_ELEMENTS_URL);

  return response.data.map((item) => {
    const uiConfig = answerTypeUiMap[item.key];

    return {
      id: item.id,
      type: uiConfig?.type ?? item.key,
      title: item.title,
      icon: uiConfig?.icon,
    };
  });
}
