export const DEFAULT_CONSTANT = {
  maxRetryTimes: 3,
  retryIntervalSeconds: 1
};

export const defaultFormData = {
  enable: false,
  token: '',
  max_retry_times: 0,
  //retry_interval_seconds 后端默认返回 0, 而这个值的范围为 1-5
  retry_interval_seconds: 0,
  url: ''
};

export const serviceInitialData = {
  enable: null,
  token: null,
  max_retry_times: null,
  retry_interval_seconds: null,
  url: null
};

export const switchFieldName = 'enable';
