import { AxiosResponse } from 'axios';
import moment from 'moment';
import i18n from 'i18next';

export const emailValidate = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
};

export const integerValidate = (value: string): boolean => {
  const reg = /^\d+$/;

  return reg.test(value);
};

export const formatTime = (
  timeVal?: string | Date,
  defaultVal = ''
): string => {
  if (!timeVal) {
    return defaultVal;
  }
  return moment(timeVal).format('YYYY-MM-DD HH:mm:ss');
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

export interface ISwaggerLoseRequireParamsRes {
  code: number;
  message: string;
}

export type GetErrorMessageParams =
  | Error
  | string
  | AxiosResponse
  | ISwaggerLoseRequireParamsRes;
export const getErrorMessage = (error: GetErrorMessageParams): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error || 'code' in error) {
    return error.message;
  }

  if (error.data) {
    if (typeof error.data?.message === 'string') {
      return error.data.message;
    }

    if (typeof error.data?.msg === 'string') {
      return error.data.msg;
    }

    if (typeof error.data === 'string') {
      return error.data;
    }

    return JSON.stringify(error.data);
  }

  if (typeof error?.statusText === 'string') {
    return error.statusText;
  }

  return i18n.t('common.unknownError');
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

export const getCookie = (name: string): string => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) {
    return match[2];
  }
  return '';
};
