export enum enumWeek {
  Sun = 0,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat
}

export type typeWeekday = keyof typeof enumWeek;

export const weekKeys = Object.keys(enumWeek).filter(
  (item) => !/^\d+$/.test(item)
) as typeWeekday[];

export const weekValues = Object.keys(enumWeek)
  .filter((item) => /^\d+$/.test(item))
  .map((item) => Number(item));

export enum enumHourMinute {
  hour = 'hour',
  minute = 'minute'
}

export type typeHourMinute = keyof typeof enumHourMinute;
