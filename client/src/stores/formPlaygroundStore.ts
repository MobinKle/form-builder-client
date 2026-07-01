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

   const createOption = (index: number, type?: string) => ({
     label: `Option ${index}`,
     value: type === 'multi-number-choice' ? String(index) : uuid(),
   });


export const useFormPlaygroundStore = createWithEqualityFn(
  immer<FormPlaygroundStoreType>(set => ({
    formElements: [],

    setFormElements: formElements =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements = formElements;
        }),
      ),

    addFormElement: (label, type) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
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
          draft.formElements.forEach(el => {
            if (el.id === id) {
              el.label = label;
              return;
            }
          });
        }),
      ),

    toggleRequired: id =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements.forEach(el => {
            if (el.id === id) {
              el.required = !el.required;
              return;
            }
          });
        }),
      ),

    addOption: id =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements.forEach(el => {
            if (el.id === id) {
              if (!el.options) {
                el.options = [];
              }

              el.options.push(createOption(el.options.length + 1, el.type));
              return;
            }
          });
        }),
      ),

    updateOption: (id, optionId, label) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          const formEl = draft.formElements.find(el => el.id === id);
          formEl?.options?.forEach(option => {
            if (option.value === optionId) {
              option.label = label;
              return;
            }
          });
        }),
      ),

    deleteOption: (id, optionId) =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          const formEl = draft.formElements.find(el => el.id === id);
          if (formEl?.options) {
            formEl.options = formEl.options.filter(
              option => option.value !== optionId,
            );
          }
        }),
      ),

    removeFormElement: id =>
      set(
        produce((draft: FormPlaygroundStoreType) => {
          draft.formElements = draft.formElements.filter(el => el.id !== id);
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
