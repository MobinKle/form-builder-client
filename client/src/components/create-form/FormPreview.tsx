import { useFormPlaygroundStore } from '../../stores/formPlaygroundStore';
import FormElementCard from './FormElementCard';
import { ScrollArea } from '../ui/ScrollArea';
import { useTranslation } from 'react-i18next';
 

export default function FormPreview() {
  const formElements = useFormPlaygroundStore(state => state.formElements);
  const { t, i18n } = useTranslation();
  return (
    <section className="flex-grow rounded-lg border-2 border-dashed border-slate-300 bg-muted">
      {formElements.length === 0 ? (
        <p className="flex h-full items-center justify-center font-medium text-muted-foreground">
       {t('formBuilder.dragformElements', 'المنتی را جهت ساخت فرم اضافه نمایید.')} </p>
      ) : (
        <ScrollArea className="h-[calc(100vh-212px)]">
          <ul className="space-y-5 p-5">
            {formElements.map(element => (
              <li key={element.id}>
                <FormElementCard formElement={element} isView />
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}
    </section>
  );
}
