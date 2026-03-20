import { Dayjs } from 'dayjs';

export interface ICompanyNoticeFormValues {
  notice_str: string;
  validPeriod: [Dayjs, Dayjs] | null;
}
