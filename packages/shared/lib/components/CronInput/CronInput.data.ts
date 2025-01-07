import { CronWeekDayEnum } from './CronInput.enum';
import { CronWeekDayType } from './CronInput.types';

export const weekDayKeys = Object.keys(CronWeekDayEnum).filter(
  (key) => !/^\d+$/.test(key)
) as CronWeekDayType[];

export const weekDayValues = Object.keys(CronWeekDayEnum)
  .filter((key) => /^\d+$/.test(key))
  .map((value) => Number(value));
