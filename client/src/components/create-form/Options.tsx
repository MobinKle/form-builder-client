import { CircleIcon, PlusIcon, XIcon } from 'lucide-react';
import { shallow } from 'zustand/shallow';
import { useTranslation } from 'react-i18next';

import { Checkbox } from '../ui/Checkbox';
import Input from '../ui/Input';
import { Button } from '../ui/Button';
import Tooltip from '../ui/Tooltip';
import { useFormPlaygroundStore } from '../../stores/formPlaygroundStore';

interface Props {
  type: string;
  id: string;
}

export default function Options({ type, id }: Props) {
  const { t, i18n } = useTranslation();

  const options = useFormPlaygroundStore(
    state => state.formElements.find(el => el.id === id)?.options ?? [],
    shallow,
  );
  const addOption = useFormPlaygroundStore(state => state.addOption);
  const deleteOption = useFormPlaygroundStore(state => state.deleteOption);
  const updateOption = useFormPlaygroundStore(state => state.updateOption);

  const isCheckboxList = ['checklist', 'multi-option', 'multi-number-choice'].includes(type);
  const isRadioList = ['multi-choice', 'single-choice'].includes(type);
  const isRtl = i18n.language === 'fa';

  return (
    <ul className="space-y-3" dir={isRtl ? 'rtl' : 'ltr'}>
      {options.map(({ label, value }, i) => (
        <li className="flex items-center gap-4" key={value}>
          {isCheckboxList ? (
            <Checkbox />
          ) : isRadioList ? (
            <CircleIcon className="h-4 w-4 opacity-50" />
          ) : (
            <span className="text-sm">{i + 1}.</span>
          )}

          <Input
            className="h-8 rounded-none border-0 border-b px-0 shadow-none"
            value={label}
            onChange={e => updateOption(id, value, e.target.value)}
            onFocus={e => e.target.select()}
          />

          {options.length > 1 ? (
            <Tooltip asChild title={t('common.remove', 'حذف')}>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full"
                onClick={() => deleteOption(id, value)}
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </Tooltip>
          ) : null}
        </li>
      ))}

      <li>
        <Button
          type="button"
          variant="ghost"
          className="gap-2"
          onClick={() => addOption(id)}
        >
          <PlusIcon className="h-5 w-5" />
          <span>{t('formBuilder.addOption', 'اضافه کردن')}</span>
        </Button>
      </li>
    </ul>
  );
}
