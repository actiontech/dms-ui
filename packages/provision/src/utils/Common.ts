import { AxiosResponse } from 'axios';
import moment from 'moment';
import { t } from 'i18next';

export const emailValidate = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
};

export const formatTime = (timeString?: string, defaultVal = ''): string => {
  if (!timeString) {
    return defaultVal;
  }
  return moment(timeString).format('YYYY-MM-DD HH:mm:ss');
};

export function translateTimeForRequest(time: undefined): undefined;
export function translateTimeForRequest(time: moment.Moment): string;
export function translateTimeForRequest(
  time: moment.Moment | undefined
): string | undefined;
export function translateTimeForRequest(
  time?: moment.Moment
): string | undefined {
  if (!time) {
    return;
  }
  return time.format('YYYY-MM-DDTHH:mm:ssZ');
}

export const getFileFromUploadChangeEvent = (e: any) => {
  if (e.file && e.file.status !== 'removed') {
    return [e.file];
  }
  return [];
};

export const timeAddZero = (time: number): string => {
  return time < 10 ? `0${time}` : `${time}`;
};

type GetErrorMessageParams = Error | AxiosResponse | string;
export const getErrorMessage = (error: GetErrorMessageParams): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error.data) {
    if (typeof error.data?.message === 'string') {
      return error.data.message;
    }

    if (typeof error.data === 'string') {
      return error.data;
    }

    return JSON.stringify(error.data);
  }

  return t('common.unknownError');
};

export const jsonParse = <T>(str: string, defaultVal: any = {}): T => {
  let val: any;
  try {
    val = JSON.parse(str);
  } catch {
    val = defaultVal;
  }
  return val;
};

export function cleanEmptyParams<T extends Record<string, any>>(params: T): T {
  const turnData = params;
  Object.entries(turnData).forEach((item: any) => {
    const key = item[0];
    const value = item[1];

    if (!value && value !== false && value !== 0) {
      delete params[key];
    }
  });
  return turnData;
}
