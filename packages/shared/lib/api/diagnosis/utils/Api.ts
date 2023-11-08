import axios from 'axios';
import { DIAGNOSIS_BASE_URL } from '../../../data/common';
import globalAuthInvalid from '../../common/authInvalid';
import ApiBase from '../../common/ApiBase';

const doNotAddAuthRequest = ['/login'];

const apiInstance = axios.create({ baseURL: DIAGNOSIS_BASE_URL });

const apiBase = new ApiBase();

const { successFn, errorFn } = apiBase.interceptorsResponse(globalAuthInvalid);

apiInstance.interceptors.request.use((config) =>
  apiBase.interceptorsRequest(doNotAddAuthRequest)(config)
);

apiInstance.interceptors.response.use(
  (res) => successFn(res),
  (err) => errorFn(err)
);

export default apiInstance;
