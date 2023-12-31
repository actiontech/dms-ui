import axios from 'axios';
import ApiBase from '../../common/ApiBase';
import store from '../../../../../base/src/store';
import globalAuthInvalid from '../../common/authInvalid';

const doNotAddAuthRequest = ['v1/dms/sessions'];

const apiInstance = axios.create();

const apiBase = new ApiBase();

apiInstance.interceptors.request.use((config) =>
  apiBase.interceptorsRequest(
    doNotAddAuthRequest,
    store.getState().user.token
  )(config)
);

const { successFn, errorFn } = apiBase.interceptorsResponse(globalAuthInvalid);

apiInstance.interceptors.response.use(
  (res) => successFn(res),
  (err) => errorFn(err)
);

export default apiInstance;
