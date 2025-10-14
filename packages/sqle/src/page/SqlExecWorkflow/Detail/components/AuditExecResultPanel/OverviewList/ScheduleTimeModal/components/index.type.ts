import { ToggleTokensOptionsType } from '@actiontech/dms-kit/es/components/ToggleTokens/ToggleTokens.types';

export type ConfirmationSettingFormProps = {
  enable: boolean;
  setSubmitButtonDisabled: (val: boolean) => void;
  confirmTypeTokens: ToggleTokensOptionsType;
  setConfirmTypeTokens: (val: ToggleTokensOptionsType) => void;
};
