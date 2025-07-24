import ApiBase from '.';
import Download from '../../../utils/Download';
import axios from 'axios';
import { TestMockApi } from '../../../testUtil/mockApi';
import { eventEmitter } from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import 'blob-polyfill';

const downloadSpy = jest.spyOn(Download, 'downloadByCreateElementA');
const emitSpy = jest.spyOn(eventEmitter, 'emit');
const token = 'token1';

const authInvalid = jest.fn();

const apiInstance = axios.create();

const doNotAddAuthRequest = ['/test/login'];

const apiBase = new ApiBase();

apiInstance.interceptors.request.use((config) =>
  apiBase.interceptorsRequest(doNotAddAuthRequest, token)(config)
);

const { successFn, errorFn } = apiBase.interceptorsResponse(authInvalid);

apiInstance.interceptors.response.use(
  (res) => successFn(res),
  (err) => errorFn(err)
);

describe('Api', () => {
  const api = TestMockApi.getServer();
  beforeAll(() => {
    api.listen();
  });
  afterEach(() => {
    downloadSpy.mockClear();
    emitSpy.mockClear();
    api.resetHandlers();
  });

  afterAll(() => {
    downloadSpy.mockRestore();
    emitSpy.mockRestore();
    api.close();
  });

  it('should execute authInvalid  when request return 401', async () => {
    let result;
    authInvalid.mockImplementation(() => {
      return Promise.reject({
        response: {
          data: {
            code: 2,
            msg: 'error'
          },
          status: 401
        }
      });
    });
    try {
      expect(authInvalid).toHaveBeenCalledTimes(0);

      await apiInstance.post('/test/401');
    } catch (error: any) {
      result = error;
    } finally {
      expect(authInvalid).toHaveBeenCalledTimes(1);
      expect(result?.response?.data).toEqual({
        code: 2,
        msg: 'error'
      });
      expect(result?.response?.status).toBe(401);
    }
  });

  test('should download file when request header includes content-disposition and attachment', async () => {
    const result = await apiInstance.post('/download/en');
    expect(downloadSpy).toHaveBeenCalledTimes(1);
    expect(downloadSpy).toHaveBeenCalledWith(result.data, 'exec_sql_db1_5.sql');
  });

  test('should get truthy filename when request header includes content-disposition and attachment and filename includes *=', async () => {
    const result = await apiInstance.post('/download/cn');
    expect(downloadSpy).toHaveBeenCalledTimes(1);
    expect(downloadSpy).toHaveBeenCalledWith(
      result.data,
      'SQL审核报告_db1_5.csv'
    );
  });

  test('should show error message when response status code is not equal 200', async () => {
    let result: any;
    try {
      await apiInstance.post('/test/500');
    } catch (error) {
      result = error;
    } finally {
      expect(result?.response?.data).toEqual({
        code: 2,
        msg: 'error message'
      });
      expect(result?.response?.status).toBe(500);
      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(
        EmitterKey.OPEN_GLOBAL_NOTIFICATION,
        'error',
        {
          message: '请求错误',
          description: 'error message'
        }
      );
    }
  });

  test('should emit DMS_CLEAR_AVAILABILITY_ZONE_AND_RELOAD_INITIAL_DATA when response code is 502', async () => {
    let result: any;
    try {
      result = await apiInstance.post('/test/7007');
    } finally {
      expect(result?.data).toEqual({
        code: 7007,
        msg: 'Bad Gateway'
      });
      expect(result?.status).toBe(200);
      expect(emitSpy).toHaveBeenCalledTimes(2);
      expect(emitSpy).toHaveBeenNthCalledWith(
        1,
        EmitterKey.OPEN_GLOBAL_NOTIFICATION,
        'error',
        {
          message: '请求错误',
          description: 'Bad Gateway'
        }
      );
      expect(emitSpy).toHaveBeenNthCalledWith(
        2,
        EmitterKey.DMS_CLEAR_AVAILABILITY_ZONE_AND_RELOAD_INITIAL_DATA
      );
    }
  });

  test('should add token when request url is not equal "doNotAddAuthRequest"', async () => {
    let token = '';
    try {
      const res = await apiInstance.post('/test/token');
      token = res.data.token;
    } finally {
      expect(token).toBe(token);
      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(
        EmitterKey.OPEN_GLOBAL_NOTIFICATION,
        'error',
        {
          message: '请求错误',
          description: 'error message'
        }
      );
    }
  });

  test('should do not add token when request url is equal "doNotAddAuthRequest"', async () => {
    let token = '';

    try {
      const res = await apiInstance.post('/test/login');
      token = res.data.token;
    } finally {
      expect(token).toBe('');
    }
  });

  test('should return file stream when request header includes content-disposition and inline', async () => {
    let res;

    try {
      res = await apiInstance.post('/file/stream');
    } finally {
      expect(downloadSpy).not.toHaveBeenCalled();
      res?.data.text().then((res: string) => {
        expect(res).toBe('use aaa');
      });
    }
  });
});
