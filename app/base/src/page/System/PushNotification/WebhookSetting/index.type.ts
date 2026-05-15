export type WebhookFormFields = {
  enable: boolean;
  token: string;
  maxRetryTimes: number;
  retryIntervalSeconds: number;
  url: string;
};
