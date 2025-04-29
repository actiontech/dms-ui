import { FormInstance } from 'antd';

export type AvailabilityZoneFormType = {
  name: string;
  address: string;
};

export type AvailabilityZoneFormProps = {
  form: FormInstance<AvailabilityZoneFormType>;
  isUpdate?: boolean;
};
