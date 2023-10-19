import { AxiosResponse } from 'axios';
import moment from 'moment';
import {
  cleanEmptyParams,
  emailValidate,
  formatTime,
  getCookie,
  timeAddZero,
  getErrorMessage,
  getFileFromUploadChangeEvent,
  jsonParse,
  translateTimeForRequest
} from '../Common';

describe('utils/Common', () => {
  test('should check params is a email address', () => {
    expect(emailValidate('aaaa@bbb.com')).toBe(true);
    expect(emailValidate('a.a.a.a@bbb.com')).toBe(true);
    expect(emailValidate('aaaa@b.b.b.com')).toBe(true);
    expect(emailValidate('a+_.a-aa@bbb.com')).toBe(true);
    expect(emailValidate('" about xac v我的 close "@bbb.com')).toBe(true);

    expect(emailValidate('a aaa@bbb.com')).toBe(false);
    expect(emailValidate('<aaaa@bbb.com')).toBe(false);
    expect(emailValidate('aaaa@bbb.c')).toBe(false);
    expect(emailValidate('aaaa@b<b.c')).toBe(false);
    expect(emailValidate('')).toBe(false);
  });

  test('should format moment to YYYY-MM-DD HH:mm:ss', () => {
    expect(formatTime('2021-06-09T08:11:52Z')).toBe('2021-06-09 16:11:52');
    expect(formatTime('2021-06-09T08:11:52Z', '--')).toBe(
      '2021-06-09 16:11:52'
    );
    expect(formatTime(undefined, '--')).toBe('--');
  });

  test('should format a time from moment to YYYY-MM-DDTHH:mm:ssZ', () => {
    expect(translateTimeForRequest(moment('2021-06-09 08:11:52'))).toBe(
      `2021-06-09T08:11:52+08:00`
    );
    expect(translateTimeForRequest(undefined)).toBe(undefined);
  });

  test('should return file list from event', () => {
    expect(
      getFileFromUploadChangeEvent({
        file: {
          status: 'add',
          file: '111'
        }
      })
    ).toEqual([
      {
        status: 'add',
        file: '111'
      }
    ]);

    expect(
      getFileFromUploadChangeEvent({
        file: {
          status: 'removed',
          file: '111'
        }
      })
    ).toEqual([]);
    expect(
      getFileFromUploadChangeEvent({
        file2: {
          status: 'add',
          file: '111'
        }
      })
    ).toEqual([]);
  });

  test('should add zero when time is smaller than 10', () => {
    expect(timeAddZero(5)).toEqual('05');
    expect(timeAddZero(15)).toEqual('15');
  });
  test('should generate error string from error', () => {
    const error1 = '123';
    expect(getErrorMessage(error1)).toBe('123');

    const error2 = new Error('123');
    expect(getErrorMessage(error2)).toBe('123');

    const error3: AxiosResponse = {
      data: { msg: '123' },
      status: 404,
      statusText: 'error',
      headers: '' as any,
      config: 'config' as any
    };
    expect(getErrorMessage(error3)).toBe('123');

    error3.data = '123';
    expect(getErrorMessage(error3)).toBe('123');

    error3.data = ['123'];
    expect(getErrorMessage(error3)).toBe('["123"]');

    error3.data = { message: '456' };
    expect(getErrorMessage(error3)).toBe('456');

    error3.data = undefined;
    expect(getErrorMessage(error3)).toBe('error');

    const error4 = [''];
    expect(getErrorMessage(error4 as any)).toBe('未知错误...');
  });

  test('test jsonParse', () => {
    expect(jsonParse('')).toEqual({});
    expect(jsonParse('{')).toEqual({});
    expect(jsonParse('[')).toEqual({});
    expect(jsonParse('', [])).toEqual([]);
    expect(jsonParse('["1","2"]')).toEqual(['1', '2']);
    expect(jsonParse('123')).toBe(123);
  });

  test('test cleanEmptyParams', () => {
    const data = {
      key0: [],
      key1: '123',
      key2: false,
      key3: 0,

      key4: null,
      key5: undefined,
      key6: '',
      key7: NaN
    };
    expect(cleanEmptyParams(data)).toEqual({
      key0: [],
      key1: '123',
      key2: false,
      key3: 0
    });
  });

  test('should return cookie value with key', () => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'sqle-token=token-value; test-key=test-value'
    });
    expect(getCookie('sqle-token')).toBe('token-value');
    expect(getCookie('test-key')).toBe('test-value');
    expect(getCookie('unknown')).toBe('');

    Object.defineProperty(document, 'cookie', {
      writable: false,
      value: ''
    });
  });
});
