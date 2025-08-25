import {
  CronInputModeEnum,
  CronFrequencyEnum,
  CronWeekDayEnum
} from './CronInput.enum';

export type CronInputProps = {
  defaultFrequency?: CronFrequencyEnum;
  value?: string;
  onChange?: (value: string) => void;
  inputMode?: CronInputModeEnum;
  onModeChange?: (mode: CronInputModeEnum) => void;
  disabled?: boolean;
  onError?: (errorMessage: string) => void;
};

export type CronWeekDayType = keyof typeof CronWeekDayEnum;
