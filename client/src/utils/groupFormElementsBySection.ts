import type { FormElementsType } from '@form-builder/validation/src/types';

interface SectionGroup {
  section: FormElementsType | null;
  fields: FormElementsType[];
}

export function groupFormElementsBySection(
  elements: FormElementsType[],
): SectionGroup[] {
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

    groups.push({
      section: null,
      fields: [element],
    });
  });

  return groups;
}
