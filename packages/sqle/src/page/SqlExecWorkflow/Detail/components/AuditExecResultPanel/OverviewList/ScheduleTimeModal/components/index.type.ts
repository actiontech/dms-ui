import { ToggleTokensOptionsType } from '@actiontech/shared';

export type ConfirmationSettingFormProps = {
  enable: boolean;
  setSubmitButtonDisabled: (val: boolean) => void;
  confirmTypeTokens: ToggleTokensOptionsType;
  setConfirmTypeTokens: (val: ToggleTokensOptionsType) => void;
};
