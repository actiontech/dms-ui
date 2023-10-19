export enum CronMode {
  Manual = 'Manual',
  Select = 'Select'
}

export type typeCronMode = keyof typeof CronMode;

export enum CronTimeValue {
  'everyDay' = 'everyDay',
  'everyWeek' = 'everyWeek'
}

export type CronInputProps = {
  everyDefault?: CronTimeValue;
  value?: string;
  onChange?: (value: string) => void;
  mode?: CronMode;
  modeChange?: (mode: CronMode) => void;
  disabled?: boolean;
  updateErrorMessage?: (errorMessage: string) => void;
};
