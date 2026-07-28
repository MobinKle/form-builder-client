import { useMemo } from 'react';
import { PanelTopCloseIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import DraggableButton from './DraggableButton';

interface Props {
  query?: string;
}

export default function FormStructureElements({ query = '' }: Props) {
  const { t, i18n } = useTranslation();

  const currentLanguage =
    i18n.resolvedLanguage ?? i18n.language;

  const structureElements = useMemo(
    () => [
      {
        id: 'section',
        type: 'section',
        title: t(
          'formBuilder.section',
          'بخش / صفحه',
        ),
        Icon: PanelTopCloseIcon,
      },
    ],
    [t],
  );

  const filteredElements = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLocaleLowerCase(currentLanguage);

    if (!normalizedQuery) {
      return structureElements;
    }

    return structureElements.filter(element => {
      const title = element.title.toLocaleLowerCase(currentLanguage);
      const type = element.type.toLocaleLowerCase(currentLanguage);

      return (
        title.includes(normalizedQuery) ||
        type.includes(normalizedQuery)
      );
    });
  }, [currentLanguage, query, structureElements]);

  if (filteredElements.length === 0) {
    return null;
  }

  return (
    <article>
      <h3 className="w-full text-start text-sm font-medium text-muted-foreground">
        {t(
          'formBuilder.structureElements',
          'ساختار فرم',
        )}
      </h3>

      <ul className="mt-3 grid grid-cols-2 gap-4">
        {filteredElements.map(element => (
          <DraggableButton
            key={element.id}
            text={element.title}
            type={element.type}
            Icon={element.Icon}
          />
        ))}
      </ul>
    </article>
  );
}
