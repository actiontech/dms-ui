import { AxiosResponse } from 'axios';
import {
  cleanEmptyParams,
  emailValidate,
  formatTime,
  getCookie,
  timeAddZero,
  getErrorMessage,
  getResponseErrorMessage,
  getResponseCode,
  isExportFileResponse,
  isFileStreamResponse,
  getFileFromUploadChangeEvent,
  jsonParse,
  translateTimeForRequest,
  findDuplicateKeys
} from '../Common';
import { act } from '@testing-library/react';
import 'blob-polyfill';
import { MIMETypeEnum } from '../../enum';
import dayjs from 'dayjs';

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

  test('should format date now to YYYY-MM-DD HH:mm:ss', () => {
    const mockDate = new Date('2010-01-01T00:00:00Z');
    const spy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as any);

    expect(formatTime(new Date())).toBe('2010-01-01 08:00:00');

    spy.mockRestore();
  });

  test('should format moment to YYYY-MM-DD HH:mm:ss', () => {
    expect(formatTime('2021-06-09T08:11:52Z')).toBe('2021-06-09 16:11:52');
    expect(formatTime('2021-06-09T08:11:52Z', '--')).toBe(
      '2021-06-09 16:11:52'
    );
    expect(formatTime(undefined, '--')).toBe('--');
  });

  test('should format a time from dayjs to YYYY-MM-DDTHH:mm:ssZ', () => {
    expect(translateTimeForRequest(dayjs('2021-06-09 08:11:52'))).toBe(
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

  test('should generate error string from Blob error', async () => {
    const blobError = {
      data: new Blob([JSON.stringify({ code: 7004, message: 'test Blob' })], {
        type: MIMETypeEnum.Application_Json
      }),
      status: 404,
      statusText: 'error',
      headers: '' as any,
      config: 'config' as any
    };
    await act(async () => {
      const data = await getResponseErrorMessage(blobError);
      expect(data).toBe('test Blob');
    });

    const stringError = '123';
    getResponseErrorMessage(stringError).then((error) => {
      expect(error).toBe('123');
    });
  });

  test('should get response code', async () => {
    const responseBlobData = {
      data: new Blob([JSON.stringify({ code: 0, message: 'success' })], {
        type: MIMETypeEnum.Application_Json
      }),
      status: 200,
      statusText: 'success',
      headers: '' as any,
      config: 'config' as any
    };

    await act(async () => {
      const code = await getResponseCode(responseBlobData);
      expect(code).toBe(0);
    });

    const responseJsonData = {
      data: { code: 0, message: 'success' },
      status: 200,
      statusText: 'success',
      headers: '' as any,
      config: 'config' as any
    };

    await act(async () => {
      const code = await getResponseCode(responseJsonData);
      expect(code).toBe(0);
    });

    const responseErrorData = {
      data: new Blob([JSON.stringify({ code: 7004, message: 'test Blob' })], {
        type: MIMETypeEnum.Application_Json
      }),
      status: 404,
      statusText: 'error',
      headers: '' as any,
      config: 'config' as any
    };

    await act(async () => {
      const code = await getResponseCode(responseErrorData);
      expect(code).toBe(7004);
    });
  });

  test('test isExportFileResponse', () => {
    expect(
      isExportFileResponse({
        status: 200,
        headers: {
          'content-disposition':
            'attachment; filename=import_db_services_problems.csv'
        },
        config: {},
        statusText: '',
        data: ''
      })
    ).toBe(true);

    expect(
      isExportFileResponse({
        status: 200,
        headers: {},
        config: {},
        statusText: '',
        data: ''
      })
    ).toBe(false);
  });

  test('test isFileStreamResponse', () => {
    expect(
      isFileStreamResponse({
        status: 200,
        headers: {
          'content-disposition': 'inline'
        },
        config: {},
        statusText: '',
        data: ''
      })
    ).toBe(true);

    expect(
      isFileStreamResponse({
        status: 200,
        headers: {},
        config: {},
        statusText: '',
        data: ''
      })
    ).toBe(false);
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

  describe('utils/findDuplicateKeys', () => {
    it('render when obj has same key', () => {
      const objA = {
        a: '1'
      };
      const objB = {
        a: '2',
        b: '1'
      };
      const result = findDuplicateKeys([objA, objB]);
      expect(result.length).toBe(1);
      expect(result).toEqual(['a']);
    });

    it('render more obj when obj has same key', () => {
      const objA = {
        c: '1',
        e: {
          a: '2'
        }
      };
      const objB = {
        a: '2',
        b: '1'
      };
      const result = findDuplicateKeys([objA, objB]);
      expect(result.length).toBe(0);
      expect(result).toEqual([]);
    });

    it('render when obj no same key', () => {
      const objA = {
        a: '1'
      };
      const objB = {
        b: '2'
      };
      const result = findDuplicateKeys([objA, objB]);
      expect(result.length).toBe(0);
      expect(result).toEqual([]);
    });
  });
});
