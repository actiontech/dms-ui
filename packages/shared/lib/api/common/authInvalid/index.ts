import axios from 'axios';
import store from '../../../../../base/src/store';
import {
  updateBindProjects,
  updateManagementPermissions,
  updateToken,
  updateUser,
  updateUserUid,
  updateUserInfoFetchStatus
} from '../../../../../base/src/store/user';
import { DMS_REDIRECT_KEY_PARAMS_NAME } from '../../../data/routePaths';
import { IRefreshSessionReturn } from '../../base/service/Session/index.d';
import { ResponseCode } from '../../../enum';
import { getErrorMessage, getResponseCode } from '../../../utils';
import EmitterKey from '../../../data/EmitterKey';
import { eventEmitter } from '../../../utils/EventEmitter';
import { ArgsProps } from 'antd/es/notification/interface';
import { NotificationInstanceKeyType } from '../../../hooks/useNotificationContext';
import i18n from 'i18next';

// 添加一个标志位和Promise来跟踪刷新状态
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export const redirectToLogin = () => {
  const currentPath = window.location.pathname;
  const currentSearch = window.location.search;
  if (currentPath === '/login') {
    return;
  }

  const targetUrl = currentPath + currentSearch;
  window.location.href = `/login?${DMS_REDIRECT_KEY_PARAMS_NAME}=${encodeURIComponent(
    targetUrl
  )}`;

  store.dispatch(updateToken({ token: '' }));
  store.dispatch(updateUser({ username: '', role: '' }));
  store.dispatch(updateUserUid({ uid: '' }));
  store.dispatch(updateManagementPermissions({ managementPermissions: [] }));
  store.dispatch(updateBindProjects({ bindProjects: [] }));
  store.dispatch(updateUserInfoFetchStatus(false));
};

export const refreshAuthToken = () => {
  // 如果已经在刷新中，直接返回之前的Promise
  if (isRefreshing) {
    return refreshPromise;
  }

  // 设置刷新状态为true
  isRefreshing = true;

  // 创建新的刷新Promise
  refreshPromise = axios
    .post<IRefreshSessionReturn>('/v1/dms/sessions/refresh')
    .then(async (res) => {
      const responseCode = await getResponseCode(res);
      if (res.status === 401) {
        redirectToLogin();
      } else if (responseCode === ResponseCode.SUCCESS) {
        const newToken = res.data.data?.token
          ? `Bearer ${res.data.data.token}`
          : '';
        if (newToken) {
          store.dispatch(updateToken({ token: newToken }));
        }
      } else {
        const errorMessage = getErrorMessage(res.data.message ?? '');
        eventEmitter.emit<[NotificationInstanceKeyType, ArgsProps]>(
          EmitterKey.OPEN_GLOBAL_NOTIFICATION,
          'error',
          {
            message: `${i18n.t('common.request.noticeFailTitle')}`,
            description: errorMessage
          }
        );
      }
      return res;
    })
    .catch((error) => {
      const errorMessage =
        error.message || i18n.t('common.request.networkError');
      eventEmitter.emit<[NotificationInstanceKeyType, ArgsProps]>(
        EmitterKey.OPEN_GLOBAL_NOTIFICATION,
        'error',
        {
          message: `${i18n.t('common.request.noticeFailTitle')}`,
          description: errorMessage
        }
      );

      if (error.response?.status === 401) {
        redirectToLogin();
      }
      return Promise.reject(error);
    })
    .finally(() => {
      // 重置刷新状态
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
};
