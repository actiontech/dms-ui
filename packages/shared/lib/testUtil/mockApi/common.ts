import { setupServer } from 'msw/node';
import { RestContext, RestHandler, MockedRequest, DefaultBodyType } from 'msw';
import MockBaseApi from './baseApi';
import { AxiosResponse } from 'axios';

class TestMockApi {
  private server!: ReturnType<typeof setupServer>;

  constructor() {
    this.initServer();
  }

  public getServer() {
    return this.server;
  }

  public initServer() {
    this.server = setupServer(...MockBaseApi.getHandler());
  }
}

export interface MockApi {
  getHandler(): RestHandler<MockedRequest<DefaultBodyType>>[];
}

export interface MockSpyApy {
  mockAllApi(): void;
}

export const createSuccessResponse = (ctx: RestContext, data?: any) => {
  return [
    ctx.delay(200),
    ctx.status(200),
    ctx.json({
      code: 0,
      message: 'ok',
      ...data
    })
  ];
};

export const createSpySuccessResponse = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return new Promise<AxiosResponse<any>>((res) => {
    setTimeout(() => {
      res({
        status,
        headers,
        config,
        statusText,
        data: {
          code: 0,
          message: 'ok',
          ...data
        }
      });
    }, 3000);
  });
};

export const createSpyFailResponse = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return new Promise<AxiosResponse<any>>((res) => {
    setTimeout(() => {
      res({
        status,
        headers,
        config,
        statusText,
        data: {
          code: 100,
          message: 'error',
          ...data
        }
      });
    }, 3000);
  });
};

export const createSpyErrorResponse = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return new Promise<AxiosResponse<any>>((_, rej) => {
    setTimeout(() => {
      rej({
        status,
        headers,
        config,
        statusText,
        data: {
          code: 100,
          message: 'error',
          ...data
        }
      });
    }, 3000);
  });
};

export const throwErrorThreeSecond = (error = 'error') => {
  return new Promise(() => {
    throw new Error(error);
  });
};
export type MockServer = ReturnType<typeof setupServer>;

// eslint-disable-next-line import/no-anonymous-default-export
export default new TestMockApi();
