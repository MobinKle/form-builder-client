
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


const FORM_API_URL = 'https://6a3f860c9b6d371e8380e8d5.mockapi.io/Form-Management-center-organ-structure'; 

export async function getFormList(): Promise<FormItem[]> {
  try {
    const response = await axios.get<FormItem[]>(FORM_API_URL);
    return response.data ?? [];
  } catch (error) {
    console.error("خطا در دریافت لیست پرسشنامه‌ها:", error);
    return [];
  }
}
