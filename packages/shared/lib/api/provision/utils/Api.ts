import axios from 'axios';
import { PROVISION_BASE_URL } from '../../../data/common';
import ApiBase from '../../common/ApiBase';
import { addFailedRequest } from '../../common/authInvalid';

const doNotAddAuthRequest = ['/login'];

const apiInstance = axios.create({ baseURL: PROVISION_BASE_URL });

const apiBase = new ApiBase();

apiInstance.interceptors.request.use((config) =>
  apiBase.interceptorsRequest(doNotAddAuthRequest)(config)
);

const { successFn, errorFn } = apiBase.interceptorsResponse(addFailedRequest);

apiInstance.interceptors.response.use(
  (res) => successFn(res),
  (err) => errorFn(err)
);

export default apiInstance;
