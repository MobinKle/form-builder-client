import { createWithEqualityFn } from 'zustand/traditional';
import { immer } from 'zustand/middleware/immer';
import { produce } from 'immer';
import { v4 as uuid } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import type { FormElementsType } from '@form-builder/validation/src/types';

interface FormPlaygroundStoreType {
  formElements: FormElementsType[];
  setFormElements: (formElements: FormElementsType[]) => void;
  addFormElement: (label: string, type: string) => void;
  moveFormElement: (oldIndex: number, newIndex: number) => void;
  updateLabel: (id: string, label: string) => void;
  updateDescription: (id: string, description: string) => void;
  toggleRequired: (id: string) => void;
  addOption: (id: string) => void;
  updateOption: (id: string, optionId: string, label: string) => void;
  deleteOption: (id: string, optionId: string) => void;
  removeFormElement: (id: string) => void;
  removeAllFormElements: () => void;
}


const optionFieldTypes = [
  'checklist',
  'multi-choice',
  'dropdown',
  'combobox',
  'single-choice',
  'multi-option',
  'multi-number-choice',
];

const isDefaultEnglishOptionLabel = (label?: string) => {
  return /^Option\s+\d+$/i.test(label?.trim() ?? '');
};

const normalizeOptionLabel = (label?: string) => {
  const trimmedLabel = label?.trim();

  if (!trimmedLabel) {
    return '';
  }

  if (isDefaultEnglishOptionLabel(trimmedLabel)) {
    return '';
  }

  return trimmedLabel;
};

const createOption = (index: number, type?: string) => ({
  label: '',
  value: type === 'multi-number-choice' ? String(index) : uuid(),
});

const normalizeFormElementsOptions = (
  formElements: FormElementsType[],
): FormElementsType[] => {
  return formElements.map(element => {
    if (!element.options) {
      return element;
    }

    return {
      ...element,
      options: element.options.map((option, index) => ({
        ...option,
        label: normalizeOptionLabel(option.label),
        value:
          element.type === 'multi-number-choice'
            ? String(option.value ?? index + 1)
            : option.value ?? uuid(),
      })),
    };
  });
};

export const useFormPlaygroundStore = createWithEqualityFn(
  immer<FormPlaygroundStoreType>(set => ({
    formElements: [],

    setFormElements: formElements =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements = normalizeFormElementsOptions(formElements);
        }),
      ),

addFormElement: (label, type) =>
  set(
    produce((draft: FormPlaygroundStoreType) => {
      if (type === 'section') {
        draft.formElements.push({
          id: uuid(),
          label: '',
          type: 'section',
          required: false,
          description: '',
          options: undefined,
        } as FormElementsType);

        return;
      }

      draft.formElements.push({
        id: uuid(),
        label,
        type,
        required: false,
        options: optionFieldTypes.includes(type)
          ? [createOption(1, type), createOption(2, type)]
          : undefined,
      });
    }),
  ),


    moveFormElement: (oldIndex, newIndex) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements = arrayMove(
            draft.formElements,
            oldIndex,
            newIndex,
          );
        }),
      ),

    updateLabel: (id, label) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements.forEach(element => {
            if (element.id === id) {
              element.label = label;
            }
          });
        }),
      ),
updateDescription: (id, description) =>
  set(
    produce((draft: FormPlaygroundStoreType) => {
      draft.formElements.forEach(element => {
        if (element.id === id) {
          (
            element as FormElementsType & { description?: string }
          ).description = description;
        }
      });
    }),
  ),


    toggleRequired: id =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements.forEach(element => {
            if (element.id === id) {
              element.required = !element.required;
            }
          });
        }),
      ),

    addOption: id =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          const formElement = draft.formElements.find(
            element => element.id === id,
          );

          if (!formElement) {
            return;
          }

          if (!formElement.options) {
            formElement.options = [];
          }

          formElement.options.push(
            createOption(formElement.options.length + 1, formElement.type),
          );
        }),
      ),

    updateOption: (id, optionId, label) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          const formElement = draft.formElements.find(
            element => element.id === id,
          );

          const option = formElement?.options?.find(
            item => item.value === optionId,
          );

          if (option) {
            option.label = label;
          }
        }),
      ),

    deleteOption: (id, optionId) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          const formElement = draft.formElements.find(
            element => element.id === id,
          );

          if (formElement?.options) {
            formElement.options = formElement.options.filter(
              option => option.value !== optionId,
            );
          }
        }),
      ),

    removeFormElement: id =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements = draft.formElements.filter(
            element => element.id !== id,
          );
        }),
      ),

    removeAllFormElements: () =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements = [];
        }),
      ),
  })),
  Object.is,
);
