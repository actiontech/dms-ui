import { FormInstance } from 'antd';

export type LoginFormFieldValue = {
  username: string;
  password: string;
  userAgreement: boolean;
};

export type LoginFormProps = {
  onSubmit: (values: LoginFormFieldValue) => void;
  loading: boolean;
  form: FormInstance<LoginFormFieldValue>;
  hidden: boolean;
};

export type VerificationCodeFormFieldValue = {
  verificationCode: string;
};

export type VerificationCodeFormProps = {
  form: FormInstance<VerificationCodeFormFieldValue>;
  loading: boolean;
  onVerify: (values: VerificationCodeFormFieldValue) => void;
  hideVerificationForm: () => void;
  username?: string;
  phone?: string;
};
