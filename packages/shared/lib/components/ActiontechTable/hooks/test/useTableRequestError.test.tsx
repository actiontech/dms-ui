import { renderHook, act, cleanup } from '@testing-library/react';
import useTableRequestError from '../useTableRequestError';
import { AxiosResponse } from 'axios';

jest.mock('axios');

//todo: mock Promise<AxiosResponse>类型
describe('lib/ActiontechTable-hooks-useTableRequestError', () => {
  beforeAll(() => {
    cleanup();
  });

  it('render api return right info', async () => {
    const { result } = renderHook(() => useTableRequestError());
    await act(async () => {
      const eacuteResult = result.current.handleTableRequestError(
        new Promise((resolve, reject) => {
          resolve({
            data: {
              data: [],
              total_nums: 1,
              a: 'a'
            }
          });
        }) as unknown as Promise<AxiosResponse>
      );
      eacuteResult.then((res) => {
        expect(res).toEqual({
          list: [],
          total: 1,
          otherData: {
            a: 'a'
          }
        });
      });
    });

    await act(async () => {
      const eacuteResult = result.current.handleTableRequestError(
        new Promise((resolve, reject) => {
          resolve({
            data: {
              data: [],
              a: 'b'
            }
          });
        }) as unknown as Promise<AxiosResponse>
      );
      eacuteResult.then((res) => {
        expect(res).toEqual({
          list: [],
          total: 0,
          otherData: {
            a: 'b'
          }
        });
      });
    });
  });

  it('render api return error info', async () => {
    const errorMes = 'this is a error';
    const { result } = renderHook(() => useTableRequestError());
    await act(async () => {
      const eacuteResult = result.current.handleTableRequestError(
        new Promise((resolve, reject) => {
          reject({
            data: {
              message: errorMes
            }
          });
        }) as unknown as Promise<AxiosResponse>
      );
      eacuteResult.then((res) => {
        expect(res).toEqual({
          data: {
            message: errorMes
          }
        });
      });
      const requestErrorMessage = result.current.requestErrorMessage;
      expect(requestErrorMessage).toBe(requestErrorMessage);
    });
  });
});
