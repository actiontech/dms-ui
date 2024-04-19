import { ToggleTokensOptionsType } from '@actiontech/shared/lib/components/ToggleTokens/index.type';

export type ConfirmationSettingFormProps = {
  enable: boolean;
  setSubmitButtonDisabled: (val: boolean) => void;
  confirmTypeTokens: ToggleTokensOptionsType;
  setConfirmTypeTokens: (val: ToggleTokensOptionsType) => void;
};
