import { rest } from 'msw';
import { MockApi } from './common';

class MockBaseApi implements MockApi {
  public getHandler() {
    return [
      this.authFailedRequest(),
      this.downloadFileByCnName(),
      this.downloadFileByEnName(),
      this.response500(),
      this.responseToken(),
      this.mockLoginWithoutToken(),
      this.responseFileStream()
    ];
  }

  private authFailedRequest() {
    return rest.post('/test/401', (req, res, ctx) => {
      return res(
        ctx.status(401),
        ctx.json({
          code: 2,
          msg: 'error'
        })
      );
    });
  }

  private downloadFileByEnName() {
    return rest.post('/download/en', (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.set(
          'content-disposition',
          'attachment; filename=exec_sql_db1_5.sql'
        ),
        ctx.body(new Blob(['use aaa']))
      );
    });
  }

  private downloadFileByCnName() {
    return rest.post('/download/cn', (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.set(
          'content-disposition',
          `attachment; filename*=utf-8'maybe have some code 'SQL%E5%AE%A1%E6%A0%B8%E6%8A%A5%E5%91%8A_db1_5.csv`
        ),
        ctx.body(new Blob(['use aaa']))
      );
    });
  }

  private response500() {
    return rest.post('/test/500', (req, res, ctx) => {
      return res(
        ctx.status(500),
        ctx.json({
          code: 2,
          msg: 'error message'
        })
      );
    });
  }

  private responseToken() {
    return rest.post('/test/token', (req, res, ctx) => {
      const token = req.headers.get('Authorization') ?? '';
      return res(
        ctx.status(200),
        ctx.json({
          code: 1,
          token,
          msg: 'error message'
        })
      );
    });
  }

  private mockLoginWithoutToken() {
    return rest.post('/test/login', (req, res, ctx) => {
      const token = req.headers.get('Authorization') ?? '';
      return res(
        ctx.status(200),
        ctx.json({
          code: 0,
          token,
          msg: 'error message'
        })
      );
    });
  }

  private responseFileStream() {
    return rest.post('/file/stream', (_, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.set('content-disposition', `inline`),
        ctx.body(new Blob(['use aaa']))
      );
    });
  }
}

export default new MockBaseApi();
