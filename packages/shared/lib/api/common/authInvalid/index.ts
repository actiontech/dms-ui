import store from '../../../../../base/src/store';
import {
  updateBindProjects,
  updateManagementPermissions,
  updateToken,
  updateUser,
  updateUserUid,
  updateUserInfoFetchStatus
} from '../../../../../base/src/store/user';
import { DMS_REDIRECT_KEY_PARAMS_NAME } from '../../../data/common';

const globalAuthInvalid = () => {
  const targetUrl = window.location.pathname;
  if (targetUrl === '/login') {
    return;
  }
  window.location.href = `/login?${DMS_REDIRECT_KEY_PARAMS_NAME}=${targetUrl}`;
  store.dispatch(updateToken({ token: '' }));
  store.dispatch(updateUser({ username: '', role: '' }));
  store.dispatch(updateUserUid({ uid: '' }));
  store.dispatch(updateManagementPermissions({ managementPermissions: [] }));
  store.dispatch(updateBindProjects({ bindProjects: [] }));
  store.dispatch(updateUserInfoFetchStatus(false));
};

export default globalAuthInvalid;
