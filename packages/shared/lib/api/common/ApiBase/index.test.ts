import ApiBase from '.';
import Download from '../../../utils/Download';
import { notification } from 'antd';
import axios from 'axios';

const downloadSpy = jest.spyOn(Download, 'downloadByCreateElementA');
const notificationSpy = jest.spyOn(notification, 'error');
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
  afterEach(() => {
    downloadSpy.mockClear();
    notificationSpy.mockClear();
  });

  afterAll(() => {
    downloadSpy.mockRestore();
    notificationSpy.mockRestore();
  });

  test('should execute authInvalid  when request return 401', async () => {
    let result;
    try {
      expect(authInvalid).toBeCalledTimes(0);

      await apiInstance.post('/test/401');
    } catch (error: any) {
      result = error;
    } finally {
      expect(authInvalid).toBeCalledTimes(1);
      expect(result?.response?.data).toEqual({
        code: 2,
        msg: 'error'
      });
      expect(result?.response?.status).toBe(401);
    }
  });

  test('should download file when request header includes content-disposition and attachment', async () => {
    const result = await apiInstance.post('/download/en');
    expect(downloadSpy).toBeCalledTimes(1);
    expect(downloadSpy).toBeCalledWith(result.data, 'exec_sql_db1_5.sql');
  });

  test('should get truthy filename when request header includes content-disposition and attachment and filename includes *=', async () => {
    const result = await apiInstance.post('/download/cn');
    expect(downloadSpy).toBeCalledTimes(1);
    expect(downloadSpy).toBeCalledWith(result.data, 'SQL审核报告_db1_5.csv');
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
      expect(notificationSpy).toBeCalledTimes(1);
      expect(notificationSpy).toBeCalledWith({
        message: '请求错误',
        description: 'error message'
      });
    }
  });

  test('should add token when request url is not equal "doNotAddAuthRequest"', async () => {
    let token = '';
    try {
      const res = await apiInstance.post('/test/token');
      token = res.data.token;
    } finally {
      expect(token).toBe(token);
      expect(notificationSpy).toBeCalledTimes(1);
      expect(notificationSpy).toBeCalledWith({
        message: '请求错误',
        description: 'error message'
      });
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
});
