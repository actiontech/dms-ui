import axios from 'axios';
import store from '../store';
import { createBrowserHistory } from 'history';
import ApiBase from '@actiontech/shared/lib/api/common/ApiBase';
import { updateToken, updateUser, updateUserScope } from '../store/user';

const authInvalid = () => {
  store.dispatch(updateToken({ token: '' }));
  store.dispatch(updateUser({ username: '', roleId: null, userId: null }));
  store.dispatch(updateUserScope({ userScope: [] }));
  const history = createBrowserHistory();
  history.push('/login');
};

const doNotAddAuthRequest = ['/login'];

const apiInstance = axios.create();

const apiBase = new ApiBase();

const { successFn, errorFn } = apiBase.interceptorsResponse(authInvalid);

apiInstance.interceptors.request.use((config) =>
  apiBase.interceptorsRequest(doNotAddAuthRequest)(config)
);

apiInstance.interceptors.response.use(
  (res) => successFn(res),
  (err) => errorFn(err)
);

export default apiInstance;
