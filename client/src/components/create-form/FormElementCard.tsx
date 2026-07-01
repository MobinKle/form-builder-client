import type { ChangeEvent } from 'react';
import { GripVerticalIcon, Trash2Icon } from 'lucide-react';
import {
  type AnimateLayoutChanges,
  useSortable,
  defaultAnimateLayoutChanges,
} from '@dnd-kit/sortable';

import Input from '../ui/Input';
import { Button } from '../ui/Button';
import Tooltip from '../ui/Tooltip';
import { Switch } from '../ui/Switch';
import { Label } from '../ui/Label';
import { Separator } from '../ui/Separator';
import { Textarea } from '../ui/Textarea';
import RichTextEditor from '../shared/RichTextEditor';
import BubbleMenuEditor from '../shared/BubbleMenuEditor';
import { Checkbox } from '../ui/Checkbox';
import { DatePicker } from '../shared/DatePicker';
import { DateRangePicker } from '../shared/DateRangePicker';
import Options from './Options';
import { useFormPlaygroundStore } from '../../stores/formPlaygroundStore';
import type { FormElementsType } from '@form-builder/validation/src/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import { RadioGroup, RadioGroupItem } from '../ui/RadioGroup';
import { Combobox } from '../ui/Combobox';
import type { ControllerRenderProps, FieldValues } from 'react-hook-form';

import { useTranslation } from 'react-i18next';

const animateLayoutChanges: AnimateLayoutChanges = args => {
  const { isSorting, wasDragging } = args;
  if (isSorting || wasDragging) return defaultAnimateLayoutChanges(args);
  return true;
};

function normalizeType(type: string) {
  switch (type) {
    case 'کد عددی':
    case 'numeric_code':
    case 'numeric-code':
      return 'numeric-code';

    case 'متن آزاد':
    case 'free-text':
      return 'free-text';

    case 'تک انتخابی':
    case 'single-choice':
      return 'single-choice';

    case 'چند گزینه ای':
    case 'چند گزینه‌ای':
    case 'multi-option':
      return 'multi-option';

    case 'چند انتخابی - عددی':
    case 'multi-number-choice':
      return 'multi-number-choice';

    case 'تاریخ':
    case 'custom-date':
      return 'date';

    case 'عکس':
    case 'custom-image':
      return 'image';

    case 'کدملی':
    case 'کد ملی':
    case 'national-code':
      return 'national-code';

    case 'شماره موبایل':
    case 'موبایل':
    case 'mobile':
      return 'mobile';

    case 'شماره تلفن':
    case 'phone':
    case 'phone-number':
      return 'phone-number';

    case 'ایمیل':
    case 'email':
      return 'email';

    case 'اسلایدر':
    case 'slider':
      return 'slider';

    case 'شماره کارت':
    case 'card-number':
      return 'card-number';

    case 'شماره شبا':
    case 'iban':
      return 'iban';

    default:
      return type;
  }
}

const optionBuilderTypes = [
  'checklist',
  'multi-choice',
  'dropdown',
  'combobox',
  'single-choice',
  'multi-option',
  'multi-number-choice',
];

const noRequiredTypes = ['heading', 'description', 'switch', 'checkbox'];
const noFieldTypes = ['heading', 'description'];

const onlyNumbers = (value: string) => value.replace(/\D/g, '');

interface Props {
  formElement: FormElementsType;
  isView?: boolean;
  field?: ControllerRenderProps<FieldValues, string>;
}

export default function FormElementCard({
  formElement,
  isView = false,
  field,
}: Props) {
  const { id, label, required, options } = formElement;
  const type = normalizeType(formElement.type);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'fa';

  const removeFormElement = useFormPlaygroundStore(
    state => state.removeFormElement,
  );
  const toggleRequired = useFormPlaygroundStore(state => state.toggleRequired);
  const updateLabel = useFormPlaygroundStore(state => state.updateLabel);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, animateLayoutChanges });

  const cardStyle = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <article dir={isRtl ? 'rtl' : 'ltr'}
      className={`relative flex gap-2 rounded-md bg-white py-3 shadow ${
        isDragging ? 'z-10' : ''
      } ${isView ? 'px-5' : 'ps-2 pe-4'}`}
      ref={setNodeRef}
      style={cardStyle}
    >
      {isView ? null : (
        <div
          className={`flex cursor-move items-center rounded px-2 ${
            isDragging ? 'bg-muted' : 'hover:bg-muted'
          }`}
          {...listeners}
          {...attributes}
        >
          <GripVerticalIcon className="h-7 w-7 text-muted-foreground transition-colors duration-200" />
        </div>
      )}

      <div
        className={`flex-grow space-y-2 ${
          noFieldTypes.includes(type) ? '' : 'pb-2'
        }`}
      >
        <div className="flex items-center gap-8">
          <div className="flex w-full items-center gap-5">
            {type === 'switch' ? (
              <Switch
                checked={field?.value}
                onCheckedChange={field?.onChange}
              />
            ) : type === 'checkbox' ? (
              <Checkbox
                checked={field?.value}
                onCheckedChange={field?.onChange}
              />
            ) : null}

            <BubbleMenuEditor
              placeholder={
                ['heading', 'description'].includes(type)
                  ? label
                  : 'Question or Text'
              }
              content={label}
              updateHandler={html => {
                updateLabel(id, html);
              }}
              readOnly={isView}
            />
          </div>

          {isView ? null : (
            <div className="flex items-center">
              {noRequiredTypes.includes(type) ? null : (
                <div className="flex items-center gap-2">
                  <Switch
                    id={'required-' + id}
                    checked={required}
                    onCheckedChange={() => toggleRequired(id)}
                  />
                  <Label
                    className="cursor-pointer font-normal"
                    htmlFor={'required-' + id}
                  >
                    {t('formBuilder.required', 'اجباری')}
                  </Label>
                </div>
              )}

              <Separator orientation="vertical" className="mx-4 h-7" />

              <Tooltip asChild title={t('common.delete', 'Delete')}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-destructive/5"
                  onClick={() => {
                    removeFormElement(id);
                  }}
                >
                  <Trash2Icon className="h-5 w-5 text-destructive" />
                </Button>
              </Tooltip>
            </div>
          )}
        </div>

        {type === 'single-line' ? (
          <Input
            placeholder="Single line text"
            required={!!field && required}
            {...(field
              ? {
                  value: field.value ?? '',
                  onChange: field.onChange,
                }
              : {
                  defaultValue: '',
                })}
          />
        ) : type === 'number' ? (
          <Input
            type="number"
            dir={isRtl ? 'rtl' : 'ltr'}
            placeholder="Number"
            className={isRtl ? 'text-right' : 'text-left'}
            required={!!field && required}
            {...(field
              ? {
                  value: field.value ?? '',
                  onChange: field.onChange,
                }
              : {
                  defaultValue: '',
                })}
          />
        ) : type === 'numeric-code' ? (
          <Input
            type="tel"
            dir={isRtl ? 'rtl' : 'ltr'}
            inputMode="numeric"
            placeholder={t('formBuilder.numericCode', 'کد عددی')}
            required={!!field && required}
            {...(field
              ? {
                  value: field.value ?? '',
                  onChange: (e: ChangeEvent<HTMLInputElement>) => {
                    field.onChange(onlyNumbers(e.target.value));
                  },
                }
              : {
                  defaultValue: '',
                })}
          />
        ) : type === 'multi-line' ? (
          <Textarea
            placeholder="Multi line text..."
            required={!!field && required}
            {...(field
              ? {
                  value: field.value ?? '',
                  onChange: field.onChange,
                }
              : {
                  defaultValue: '',
                })}
          />
        ) : type === 'free-text' ? (
          <Textarea
            placeholder={t('formBuilder.freeTextPlaceholder', 'متن آزاد...')}
            required={!!field && required}
            {...(field
              ? {
                  value: field.value ?? '',
                  onChange: field.onChange,
                }
              : {
                  defaultValue: '',
                })}
          />
        ) : type === 'rich-text' ? (
          <RichTextEditor field={field} />
        ) : optionBuilderTypes.includes(type) && !isView ? (
          <Options type={type} id={id} />
        ) : ['checklist', 'multi-option'].includes(type) ? (
          <ul className="gap-3">
            {options?.map(({ label, value }, index) => (
              <li key={value} className="flex items-center gap-3">
                <Checkbox
                  id={value}
                  checked={field?.value?.includes?.(value) ?? false}
                  onCheckedChange={checked => {
                    const currentValues = Array.isArray(field?.value)
                      ? field.value
                      : [];

                    if (checked) {
                      field?.onChange([...currentValues, value]);
                    } else {
                      field?.onChange(
                        currentValues.filter((val: string) => val !== value),
                      );
                    }
                  }}
                />
                <Label
                  htmlFor={value}
                  className="flex h-5 items-center font-normal"
                >
                  {label || `${t('formBuilder.option')} ${index + 1}`}
                </Label>
              </li>
            ))}
          </ul>
        ) : ['multi-choice', 'single-choice'].includes(type) ? (
          <RadioGroup
            className="gap-3"
            value={field?.value}
            onValueChange={field?.onChange}
          >
            {options?.map(({ label, value }, index) => (
              <div key={value} className="flex items-center gap-3">
                <RadioGroupItem value={value} id={value} />
                <Label
                  htmlFor={value}
                  className="flex h-5 items-center font-normal"
                >
                  {label || `${t('formBuilder.option')} ${index + 1}`}
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : type === 'multi-number-choice' ? (
          <ul className="space-y-3">
            {options?.map(({ label, value }, index) => {
              const rawValue = String(value ?? label ?? '');
              const numericValue = rawValue.replace(/\D/g, '');

              if (!numericValue) return null;

              const optionId = `multi-number-${id}-${index}`;

              return (
                <li key={optionId} className="flex items-center gap-3">
                  <Checkbox
                    id={optionId}
                    checked={field?.value?.includes?.(numericValue) ?? false}
                    onCheckedChange={checked => {
                      const currentValues = Array.isArray(field?.value)
                        ? field.value
                        : [];

                      if (checked) {
                        field?.onChange(
                          currentValues.includes(numericValue)
                            ? currentValues
                            : [...currentValues, numericValue],
                        );
                      } else {
                        field?.onChange(
                          currentValues.filter(
                            (val: string) => val !== numericValue,
                          ),
                        );
                      }
                    }}
                  />
                  <Label
                    htmlFor={optionId}
                    className="flex h-5 items-center font-normal"
                  >
                    {numericValue}
                  </Label>
                </li>
              );
            })}
          </ul>
        ) : type === 'dropdown' ? (
          <Select
            value={field?.value}
            onValueChange={field?.onChange}
            required={!!field && required}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('formBuilder.selectOptionPlaceholder', 'Select an option...')} />
            </SelectTrigger>
            <SelectContent>
              {options?.map(({ label, value }, index) => (
                <SelectItem value={value} key={value}>
                  {label || `${t('formBuilder.option')} ${index + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : type === 'combobox' && options ? (
          <Combobox options={options} field={field} />
        ) : ['date', 'custom-date'].includes(type) ? (
          <DatePicker field={field} />
        ) : type === 'date-range' ? (
          <DateRangePicker field={field} />
        ) : type === 'time' ? (
          <Input
            type="time"
            className="w-32"
            required={!!field && required}
            {...(field
              ? {
                  value: field.value ?? '',
                  onChange: field.onChange,
                }
              : {
                  defaultValue: '',
                })}
          />
        ) : type === 'mobile' ? (
          <Input
            type="tel"
            dir={isRtl ? 'rtl' : 'ltr'}
            inputMode="numeric"
            maxLength={11}
            placeholder="09xxxxxxxxx"
            required={!!field && required}
            {...(field
              ? {
                  value: field.value ?? '',
                  onChange: (e: ChangeEvent<HTMLInputElement>) => {
                    const value = onlyNumbers(e.target.value).slice(0, 11);
                    field.onChange(value);
                  },
                }
              : {
                  defaultValue: '',
                })}
          />
        ) : ['phone', 'phone-number'].includes(type) ? (
          <Input
            type="tel"
            dir={isRtl ? 'rtl' : 'ltr'}
            inputMode="numeric"
            maxLength={11}
            placeholder="021xxxxxxxx"
            required={!!field && required}
            {...(field
              ? {
                  value: field.value ?? '',
                  onChange: (e: ChangeEvent<HTMLInputElement>) => {
                    const value = onlyNumbers(e.target.value).slice(0, 11);
                    field.onChange(value);
                  },
                }
              : {
                  defaultValue: '',
                })}
          />
        ) : type === 'national-code' ? (
          <Input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            dir='ltr'
            placeholder={t('formBuilder.nationalCode', 'کد ملی')}
            required={!!field && required}
            {...(field
              ? {
                  value: field.value ?? '',
                  onChange: (e: ChangeEvent<HTMLInputElement>) => {
                    const value = onlyNumbers(e.target.value).slice(0, 10);
                    field.onChange(value);
                  },
                }
              : {
                  defaultValue: '',
                })}
          />
        ) : type === 'email' ? (
          <Input
            type="email"
            placeholder="example@email.com"
            required={!!field && required}
            {...(field
              ? {
                  value: field.value ?? '',
                  onChange: field.onChange,
                }
              : {
                  defaultValue: '',
                })}
          />
        ) : type === 'slider' ? (
          <div className="flex flex-col gap-2" dir={isRtl ? 'rtl' : 'ltr'}>
            <Input
              type="range"
              min="0"
              max="100"
              step="1"
              className="h-6 cursor-pointer"
              required={!!field && required}
              {...(field
                ? {
                    value: field.value ?? 0, 
                    onChange: (e) => {
                      const val = parseInt(e.target.value, 10);
                      field.onChange(isNaN(val) ? 0 : val);
                    },
                  }
                : {
                    defaultValue: 0,
                  })}
            />
            <div className="flex justify-between items-center px-1">
              <span className="text-sm text-muted-foreground">
                {t('formBuilder.selectedValue', 'مقدار انتخاب شده:')}
              </span>
              <span className="font-bold text-primary">
                {field?.value ?? 0}
              </span>
            </div>
          </div>
        ) : type === 'card-number' ? (
          <Input
            type="tel"
            inputMode="numeric"
            dir='ltr'
            maxLength={16}
            placeholder={t('formBuilder.cardNumber', 'شماره کارت')}
            required={!!field && required}
            {...(field
              ? {
                  value: field.value ?? '',
                  onChange: (e: ChangeEvent<HTMLInputElement>) => {
                    const value = onlyNumbers(e.target.value).slice(0, 16);
                    field.onChange(value);
                  },
                }
              : {
                  defaultValue: '',
                })}
          />
        ) : type === 'iban' ? (
          <Input
            type="text"
            dir='ltr'
            maxLength={26}
            placeholder="IRxxxxxxxxxxxxxxxxxxxxxxxx"
            required={!!field && required}
            {...(field
              ? {
                  value: field.value ?? '',
                  onChange: (e: ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value
                      .replace(/[^a-zA-Z0-9]/g, '')
                      .toUpperCase()
                      .slice(0, 26);
                    field.onChange(value);
                  },
                }
              : {
                  defaultValue: '',
                })}
          />
        ) : type === 'attachments' ? (
          <Input
            type="file"
            className="pt-1.5 text-muted-foreground"
            required={!!field && required}
            onChange={field?.onChange}
          />
        ) : ['image', 'custom-image'].includes(type) ? (
          <Input
            type="file"
            accept="image/*"
            className="pt-1.5 text-muted-foreground"
            required={!!field && required}
            onChange={field?.onChange}
          />
        ) : (
          <Input placeholder="Unsupported field type" disabled />
        )}

        {isView && required ? (
          <div className="pt-1 text-sm text-destructive">* Required</div>
        ) : null}
      </div>
    </article>
  );
}
