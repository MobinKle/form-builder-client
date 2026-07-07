import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDaysIcon,
  HeadingIcon,
  ImageIcon,
  MailIcon,
  Phone,
  SlidersHorizontalIcon,
  CreditCardIcon,
  TextIcon,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useTranslation } from 'react-i18next';

import {
  ListSvg,
  NumberSvg,
  TextEditStyleSvg,
} from '../../assets/icons/Svgs';
import { ScrollArea } from '../ui/ScrollArea';
import SearchInput from '../shared/SearchInput';
import DraggableButton from './DraggableButton';
import { getFormElements } from '../../services/formElementsApi';
import type { ApiFormElement } from '../../services/formElementsApi';

const iconMap: Record<string, React.ComponentType<any>> = {
  'numeric-code': NumberSvg,
  'free-text': TextEditStyleSvg,
  'single-choice': ListSvg,
  'multi-option': ListSvg,
  'multi-number-choice': ListSvg,
  'custom-date': CalendarDaysIcon,
  'custom-image': ImageIcon,
  'national-code': HeadingIcon,
  mobile: Phone,
  'phone-number': Phone,
  email: MailIcon,
  slider: SlidersHorizontalIcon,
  'card-number': CreditCardIcon,
  iban: TextIcon,
};

interface Props {
  isUpdate?: boolean;
}

export default function FormElements({ isUpdate }: Props) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '';

  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa';

  const [parent] = useAutoAnimate();

  const [elements, setElements] = useState<ApiFormElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchFormElements() {
      try {
        setLoading(true);
        setError('');

        const formElements = await getFormElements();

        if (!isMounted) return;

        setElements(formElements);
      } catch {
        if (!isMounted) return;
        setError(t('formBuilder.fetchElementsError', 'خطا در دریافت المنت‌ها'));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchFormElements();

    return () => {
      isMounted = false;
    };
  }, [t]);

  const filteredElements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return elements;

    return elements.filter(element => {
      const rawTitle = (element.title ?? '').toLowerCase();
      const rawType = (element.type ?? '').toLowerCase();

      return (
        rawTitle.includes(normalizedQuery) ||
        rawType.includes(normalizedQuery)
      );
    });
  }, [elements, query]);

  return (
    <ScrollArea
      className={`${
        isUpdate ? 'h-[calc(100vh-139px)]' : 'h-[calc(100vh-104px)]'
      } shrink-0 ${isRtl ? 'pr-[26px]' : 'pl-[26px]'}`}
    >
      <aside className="relative w-80" dir={isRtl ? 'rtl' : 'ltr'}>
<section
  dir={isRtl ? 'rtl' : 'ltr'}
  className="sticky top-0 z-10 space-y-5 bg-white pb-5 text-start"
>
  <div className="space-y-1">
    <h1 className="text-lg font-semibold">
      {t('formBuilder.formElements', 'المنت های فرم')}
    </h1>

    <h2 className="text-sm text-muted-foreground">
      {t(
        'formBuilder.dragAndDropHere',
        'عناصر مورد نظر را بکشید و در پرسشنامه رها کنید',
      )}
    </h2>
  </div>

  <SearchInput
    dir={isRtl ? 'rtl' : 'ltr'}
    className="text-start"
    placeholder={t('formBuilder.searching', 'جستجو کنید')}
  />
</section>



        <section className="flex flex-col gap-6" ref={parent}>
          <article>
            <h3 className="text-sm font-medium text-muted-foreground">
              {t('formBuilder.customElements', 'المنت‌های سفارشی')}
            </h3>

            {loading ? (
              <div className="mt-3 grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded-md bg-slate-100"
                  />
                ))}
              </div>
            ) : error ? (
              <p className="mt-3 text-sm text-destructive">{error}</p>
            ) : filteredElements.length === 0 ? (
              <p className="mt-3 text-center text-sm font-medium text-muted-foreground">
                {t('formBuilder.noResultsFound', 'نتیجه‌ای پیدا نشد')}
              </p>
            ) : (
              <ul className="mt-3 grid grid-cols-2 gap-4">
                {filteredElements.map(element => {
                  const Icon = iconMap[element.type] ?? TextIcon;

                  return (
                    <DraggableButton
                      key={element.id}
                      text={element.title}
                      type={element.type}
                      Icon={Icon}
                    />
                  );
                })}
              </ul>
            )}
          </article>
        </section>
      </aside>
    </ScrollArea>
  );
}
