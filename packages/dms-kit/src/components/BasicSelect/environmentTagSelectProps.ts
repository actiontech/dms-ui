import { CSSProperties } from 'react';
import { BasicSelectProps } from './BasicSelect.types';

export const ENVIRONMENT_TAG_SELECT_CLASS_NAME = 'environment-tag-select';

export const ENVIRONMENT_TAG_SELECT_DROPDOWN_CLASS_NAME =
  'environment-tag-select-dropdown';

export const environmentTagSelectProps = {
  popupMatchSelectWidth: false,
  dropdownStyle: { minWidth: 'max-content' } satisfies CSSProperties,
  popupClassName: ENVIRONMENT_TAG_SELECT_DROPDOWN_CLASS_NAME,
  className: ENVIRONMENT_TAG_SELECT_CLASS_NAME
} satisfies Pick<
  BasicSelectProps,
  'popupMatchSelectWidth' | 'dropdownStyle' | 'popupClassName' | 'className'
>;
