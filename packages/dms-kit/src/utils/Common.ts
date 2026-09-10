import { AxiosResponse } from 'axios';
import i18n from 'i18next';
import { MIMETypeEnum, ResponseBlobJsonType, StorageKey } from '../enum';
import dayjs, { Dayjs } from 'dayjs';
import queryString from 'query-string';
import LocalStorageWrapper from './LocalStorageWrapper';

export const emailValidate = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
};

export const findDuplicateKeys: (objects: Record<string, any>[]) => string[] = (
  objects
) => {
  const keys = new Map<string, number>();
  const duplicates: string[] = [];

  objects.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      if (!keys.has(key)) {
        keys.set(key, 1);
      } else if (keys.get(key) === 1) {
        duplicates.push(key);
        keys.set(key, keys.get(key)! + 1);
      }
    });
  });

  return duplicates;
};

export const integerValidate = (value: string): boolean => {
  const reg = /^\d+$/;

  return reg.test(value);
};

export const formatTime = (
  timeVal?: string | Date | Dayjs,
  defaultVal = ''
): string => {
  if (!timeVal) {
    return defaultVal;
  }
  return dayjs(timeVal).format('YYYY-MM-DD HH:mm:ss');
};

export function translateTimeForRequest(time: undefined): undefined;
export function translateTimeForRequest(time: Dayjs): string;
export function translateTimeForRequest(
  time: Dayjs | undefined
): string | undefined;
export function translateTimeForRequest(time?: Dayjs): string | undefined {
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

const BUSINESS_ERROR_I18N_KEYS: Record<string, string> = {
  'privilege_apply.no_assignee': 'privilegeApply.create.errors.noAssignee',
  'privilege_apply.account_mismatch':
    'privilegeApply.create.errors.accountMismatch',
  'privilege_apply.invalid_argument':
    'privilegeApply.create.errors.invalidArgument',
  'privilege_apply.duplicate_open':
    'privilegeApply.create.errors.duplicateOpen',
  'privilege_apply.invalid_account_name':
    'privilegeApply.create.errors.invalidAccountName'
};

const BUSINESS_ERROR_FALLBACK_ZH: Record<string, string> = {
  'privilege_apply.no_assignee': '请先配置提权审批人后再提交（未落单）',
  'privilege_apply.account_mismatch':
    '当前连库账号已变更，请回到工作台刷新后重新申请',
  'privilege_apply.invalid_argument': '请完善必填项后重试',
  'privilege_apply.duplicate_open':
    '该数据源已有进行中的提权申请，请等待处理完成后再提交',
  'privilege_apply.invalid_account_name':
    '新账号名不合法：仅支持字母开头，字母、数字、下划线、连字符与点，最长 32 字符'
};

const mapBusinessErrorMessage = (message: string): string => {
  const i18nKey = BUSINESS_ERROR_I18N_KEYS[message];
  if (!i18nKey) {
    return message;
  }
  const translated = i18n.t(i18nKey);
  if (translated && translated !== i18nKey) {
    return translated;
  }
  return BUSINESS_ERROR_FALLBACK_ZH[message] || message;
};

export const getErrorMessage = (error: GetErrorMessageParams): string => {
  if (typeof error === 'string') {
    return mapBusinessErrorMessage(error);
  }

  if (error instanceof Error || 'code' in error) {
    return mapBusinessErrorMessage(error.message);
  }

  if (error.data) {
    if (typeof error.data?.message === 'string') {
      return mapBusinessErrorMessage(error.data.message);
    }

    if (typeof error.data?.msg === 'string') {
      return mapBusinessErrorMessage(error.data.msg);
    }

    if (typeof error.data === 'string') {
      return mapBusinessErrorMessage(error.data);
    }

    return JSON.stringify(error.data);
  }

  if (typeof error?.statusText === 'string') {
    return error.statusText;
  }

  return i18n.t('common.unknownError');
};

export const getResponseErrorMessage = async (
  error: GetErrorMessageParams
): Promise<string> => {
  if (
    error instanceof Object &&
    !(error instanceof Error) &&
    !('code' in error) &&
    error.data instanceof Blob &&
    error.data.type === MIMETypeEnum.Application_Json
  ) {
    return error.data.text().then((text) => {
      const json = jsonParse<ResponseBlobJsonType>(text);
      return json.message;
    });
  } else {
    return getErrorMessage(error);
  }
};

export const getResponseCode = async (
  res: AxiosResponse<any, any>
): Promise<number | undefined> => {
  if (
    res instanceof Object &&
    !(res instanceof Error) &&
    !('code' in res) &&
    res.data instanceof Blob &&
    res.data.type === MIMETypeEnum.Application_Json
  ) {
    return res.data.text().then((text) => {
      const json = jsonParse<ResponseBlobJsonType>(text);
      return json.code;
    });
  }

  return res?.data?.code;
};

export const isExportFileResponse = (res: AxiosResponse<any, any>): boolean => {
  return res.headers?.['content-disposition']?.includes('attachment') ?? false;
};

export const isFileStreamResponse = (res: AxiosResponse<any, any>): boolean => {
  return res.headers?.['content-disposition']?.includes('inline') ?? false;
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

export const paramsSerializer = <T extends Record<string, any>>(query: T) => {
  return queryString.stringify(query, {
    arrayFormat: 'none'
  });
};

export const maskPhoneNumber = (phone: string): string => {
  if (!/^\d{11}$/.test(phone)) {
    return phone;
  }
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

export const getRecentlySelectedZone = (): string => {
  const data = LocalStorageWrapper.get(StorageKey.DMS_AVAILABILITY_ZONE);
  try {
    const parsedData = JSON.parse(data || '[]');
    return parsedData?.[0]?.uid ?? '';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return '';
  }
};
