import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useFormPlaygroundStore } from '../../stores/formPlaygroundStore';
import FormElementCard from './FormElementCard';
import { ScrollArea } from '../ui/ScrollArea';

type FormElement = ReturnType<
  typeof useFormPlaygroundStore.getState
>['formElements'][number];

type SectionGroup = {
  section: FormElement | null;
  fields: FormElement[];
};

function getElementDescription(element: FormElement | null) {
  if (!element) return '';

  return (
    (element as FormElement & { description?: string }).description?.trim() ??
    ''
  );
}

function groupFormElementsBySection(elements: FormElement[]): SectionGroup[] {
  const groups: SectionGroup[] = [];

  let currentGroup: SectionGroup | null = null;

  elements.forEach(element => {
    if (element.type === 'section') {
      currentGroup = {
        section: element,
        fields: [],
      };

      groups.push(currentGroup);
      return;
    }

    if (currentGroup) {
      currentGroup.fields.push(element);
      return;
    }

    const ungroupedGroup = groups.find(group => group.section === null);

    if (ungroupedGroup) {
      ungroupedGroup.fields.push(element);
      return;
    }

    groups.push({
      section: null,
      fields: [element],
    });
  });

  return groups;
}

export default function FormPreview() {
  const formElements = useFormPlaygroundStore(state => state.formElements);
  const { t, i18n } = useTranslation();

  const isRtl = i18n.language === 'fa';
  const direction = isRtl ? 'rtl' : 'ltr';

  const groupedElements = useMemo(
    () => groupFormElementsBySection(formElements),
    [formElements],
  );

  return (
    <section
      dir={direction}
      className="flex-grow rounded-lg border-2 border-dashed border-slate-300 bg-muted"
    >
      {formElements.length === 0 ? (
        <p className="flex h-full items-center justify-center font-medium text-muted-foreground">
          {t(
            'formBuilder.dragformElements',
            'المنتی را جهت ساخت فرم اضافه نمایید.',
          )}
        </p>
      ) : (
        <ScrollArea className="h-[calc(100vh-212px)]">
          <ul className="space-y-6 p-5">
            {groupedElements.map((group, groupIndex) => {
              const sectionDescription = getElementDescription(group.section);

              return (
                <li
                  key={group.section?.id ?? `ungrouped-section-${groupIndex}`}
                  className="space-y-4"
                >
                  {group.section ? (
                    <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4">
                      <h3 className="text-start text-base font-semibold text-slate-900">
                        {group.section.label?.trim() ||
                          t(
                            'formBuilder.sectionDefaultTitle',
                            'بخش بدون عنوان',
                          )}
                      </h3>

                      {sectionDescription ? (
                        <p className="mt-2 text-start text-sm leading-6 text-muted-foreground">
                          {sectionDescription}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  {group.fields.length > 0 ? (
                    <ul
                      className={[
                        'space-y-4',
                        group.section
  ? 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'
  : '',
                      ].join(' ')}
                    >
                      {group.fields.map(field => (
                        <li key={field.id}>
                          <FormElementCard formElement={field} isView />
                        </li>
                      ))}
                    </ul>
                  ) : group.section ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white/60 p-4 text-center text-sm text-muted-foreground">
                      {t(
                        'formBuilder.emptySection',
                        'هنوز سوالی به این بخش اضافه نشده است.',
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      )}
    </section>
  );
}
