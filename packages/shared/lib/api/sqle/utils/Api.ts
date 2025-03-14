import axios from 'axios';
import { SQLE_BASE_URL } from '../../../data/common';
import ApiBase from '../../common/ApiBase';
import { refreshAuthToken } from '../../common/authInvalid';

const doNotAddAuthRequest = ['/login'];

const apiInstance = axios.create({ baseURL: SQLE_BASE_URL });

const apiBase = new ApiBase();

const { successFn, errorFn } = apiBase.interceptorsResponse(refreshAuthToken);

apiInstance.interceptors.request.use((config) =>
  apiBase.interceptorsRequest(doNotAddAuthRequest)(config)
);

apiInstance.interceptors.response.use(
  (res) => successFn(res),
  (err) => errorFn(err)
);

export default apiInstance;
