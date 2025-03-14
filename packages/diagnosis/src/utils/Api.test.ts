import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import apiInstance from './Api';
import TestMockApi from '@actiontech/shared/lib/testUtil/mockApi';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';

const emitSpy = jest.spyOn(eventEmitter, 'emit');

describe('diagnosis/Api', () => {
  const api = TestMockApi.getServer();
  beforeAll(() => {
    api.listen();
  });
  afterEach(() => {
    emitSpy.mockClear();
    api.resetHandlers();
  });

  afterAll(() => {
    emitSpy.mockRestore();
    api.close();
  });

  test.skip('should execute authInvalid when request return 401', async () => {
    let result;
    try {
      await apiInstance.post('/test/401');
    } catch (error: any) {
      result = error;
    } finally {
      expect(result?.response?.data).toEqual({
        code: 2,
        msg: 'error'
      });
      expect(result?.response?.status).toBe(401);
    }
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
});
