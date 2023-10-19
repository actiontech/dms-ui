export type SMTPSettingFormFields = {
  enable: boolean;
  isSkipVerify: boolean;
  host: string;
  port: number;
  username: string;
  password: string;
  passwordConfirm: string;
};
