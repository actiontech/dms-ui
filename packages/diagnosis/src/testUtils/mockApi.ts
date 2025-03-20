import { AxiosResponse } from 'axios';

// some api return data params is not data, like V1GetServerHostname
export const createSpySuccessResponseWithoutDataParams = (
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
          msg: 'ok',
          ...data
        }
      });
    }, 3000);
  });
};
