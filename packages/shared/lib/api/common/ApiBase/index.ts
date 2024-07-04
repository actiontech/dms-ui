import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseCode } from '../../../enum';
import Download from '../../../utils/Download';
import i18n from 'i18next';
import store from '../../../../../base/src/store';
import {
  getResponseErrorMessage,
  getResponseCode,
  isExportFileResponse
} from '../../../utils/Common';
import { eventEmitter } from '../../../utils/EventEmitter';
import { NotificationInstanceKeyType } from '../../../hooks/useNotificationContext';
import { ArgsProps } from 'antd/es/notification/interface';
import EmitterKey from '../../../data/EmitterKey';

class ApiBase {
  public interceptorsResponse(authInvalid: () => void) {
    const successFn = async (res: AxiosResponse<any, any>) => {
      const code = await getResponseCode(res);
      if (res.status === 401) {
        authInvalid();
      } else if (isExportFileResponse(res)) {
        const disposition: string = res.headers?.['content-disposition'];
        const flag = 'filename=';
        const flagCharset = 'filename*=';
        let filename = '';
        if (disposition.includes(flagCharset)) {
          const tempArr = disposition.split("'");
          filename = decodeURI(tempArr[tempArr.length - 1]);
        } else {
          const startIndex = disposition.indexOf(flag);
          filename = disposition.slice(startIndex + flag.length);
        }
        Download.downloadByCreateElementA(res.data, filename);
        return res;
      } else if (
        (res.status === 200 && code !== ResponseCode.SUCCESS) ||
        res.status !== 200
      ) {
        const message = await getResponseErrorMessage(res);
        eventEmitter.emit<[NotificationInstanceKeyType, ArgsProps]>(
          EmitterKey.OPEN_GLOBAL_NOTIFICATION,
          'error',
          {
            message: `${i18n.t('common.request.noticeFailTitle')}`,
            description: message
          }
        );
      }
      return res;
    };

    const errorFn = async (error: any) => {
      if (error?.response?.status === 401) {
        authInvalid();
      } else if (error?.response?.status !== 200) {
        const message = await getResponseErrorMessage(error.response);
        eventEmitter.emit<[NotificationInstanceKeyType, ArgsProps]>(
          EmitterKey.OPEN_GLOBAL_NOTIFICATION,
          'error',
          {
            message: `${i18n.t('common.request.noticeFailTitle')}`,
            description: message
          }
        );
      }
      return Promise.reject(error);
    };

    return { successFn, errorFn };
  }

  public interceptorsRequest(
    doNotAddAuthRequest: string[],
    token = store.getState().user.token
  ) {
    return (config: AxiosRequestConfig) => {
      if (!token || doNotAddAuthRequest.some((url) => config.url === url)) {
        return config;
      }

      if (config.data || config.params) {
        const trimDataSource = config.data || config.params;
        Object.keys(trimDataSource).forEach((key) => {
          if (typeof trimDataSource[key] === 'string') {
            trimDataSource[key] = trimDataSource[key].trim();
          }
        });
      }

      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: token
        }
      };
    };
  }
}

export default ApiBase;
