import { setupServer } from 'msw/node';
import { RestContext, RestHandler, MockedRequest, DefaultBodyType } from 'msw';
import MockBaseApi from './mockApi/baseApi';

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

export const createSuccessResponse = (ctx: RestContext, data?: any) => {
  return [
    ctx.delay(200),
    ctx.status(200),
    ctx.json({
      code: 0,
      msg: 'ok',
      payload: data
    })
  ];
};

export type MockServer = ReturnType<typeof setupServer>;

export default new TestMockApi();
