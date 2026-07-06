
import axios from 'axios';

export type FormItem = {
  id: string;
  title: string;
  status: number;
  respondent: string;
  creator: string;
  startDate: string;
  endDate: string;
}


const FORM_API_URL = 'https://6a4b91bff5eab0bb6b6305f9.mockapi.io/api/Formlist/Forms'; 

export async function getFormList(): Promise<FormItem[]> {
  try {
    const response = await axios.get<FormItem[]>(FORM_API_URL);
    return response.data ?? [];
  } catch (error) {
    console.error("خطا در دریافت لیست پرسشنامه‌ها:", error);
    return [];
  }
}
