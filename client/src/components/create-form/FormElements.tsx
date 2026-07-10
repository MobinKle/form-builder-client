import { useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import {
  CalendarDaysIcon,
  CreditCardIcon,
  HeadingIcon,
  ImageIcon,
  MailIcon,
  Phone,
  SlidersHorizontalIcon,
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
import {
  getFormElements,
  type ApiFormElement,
} from '../../services/formElementsApi';

const iconMap: Record<string, ComponentType<any>> = {
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

export default function FormElements({ isUpdate = false }: Props) {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const [animationParent] = useAutoAnimate();

  const [elements, setElements] = useState<ApiFormElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const query = searchParams.get('query') ?? '';
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;
  const direction = i18n.dir(currentLanguage);
  const isRtl = direction === 'rtl';

  useEffect(() => {
    let isMounted = true;

    async function fetchFormElements() {
      try {
        setLoading(true);
        setError('');

        const formElements = await getFormElements();

        if (isMounted) {
          setElements(formElements);
        }
      } catch {
        if (isMounted) {
          setError(
            t(
              'formBuilder.fetchElementsError',
              'خطا در دریافت المنت‌ها',
            ),
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void fetchFormElements();

    return () => {
      isMounted = false;
    };
  }, [t]);

  const filteredElements = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(currentLanguage);

    if (!normalizedQuery) {
      return elements;
    }

    return elements.filter(element => {
      const title = (element.title ?? '').toLocaleLowerCase(currentLanguage);
      const type = (element.type ?? '').toLocaleLowerCase(currentLanguage);

      return (
        title.includes(normalizedQuery) ||
        type.includes(normalizedQuery)
      );
    });
  }, [currentLanguage, elements, query]);

  return (
    <ScrollArea
      dir={direction}
      className={`${
        isUpdate
          ? 'h-[calc(100vh-139px)]'
          : 'h-[calc(100vh-104px)]'
      } shrink-0 ${isRtl ? 'pr-[26px]' : 'pl-[26px]'}`}
    >
      <aside dir={direction} className="relative w-80">
        <section className="sticky top-0 z-10 space-y-5 bg-white pb-5 text-start">
          <div className="space-y-1">
            <h1 className="text-start text-lg font-semibold">
              {t('formBuilder.formElements', 'المنت‌های فرم')}
            </h1>

            <h2 className="text-start text-sm text-muted-foreground">
              {t(
                'formBuilder.dragAndDropHere',
                'عناصر مورد نظر را بکشید و در پرسشنامه رها کنید',
              )}
            </h2>
          </div>

          <SearchInput
            dir={direction}
            className="text-start"
            placeholder={t(
              'formBuilder.searching',
              'جستجو کنید',
            )}
          />
        </section>

        <section
          ref={animationParent}
          className="flex flex-col gap-6"
        >
          <article>
            <h3 className="w-full text-start text-sm font-medium text-muted-foreground">
              {t(
                'formBuilder.customElements',
                'المنت‌های سفارشی',
              )}
            </h3>

            {loading ? (
              <div className="mt-3 grid grid-cols-2 gap-4">
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className="h-12 animate-pulse rounded-md bg-slate-100"
                  />
                ))}
              </div>
            ) : error ? (
              <p className="mt-3 text-start text-sm text-destructive">
                {error}
              </p>
            ) : filteredElements.length === 0 ? (
              <p className="mt-3 text-center text-sm font-medium text-muted-foreground">
                {t(
                  'formBuilder.noResultsFound',
                  'نتیجه‌ای پیدا نشد',
                )}
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
