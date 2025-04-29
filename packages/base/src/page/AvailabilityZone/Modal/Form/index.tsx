import { Form } from 'antd';
import { BasicInput } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { AvailabilityZoneFormProps } from './type';

const AvailabilityZoneForm: React.FC<AvailabilityZoneFormProps> = ({
  form
}) => {
  const { t } = useTranslation();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label={t('availabilityZone.form.name')}
        rules={[{ required: true }]}
      >
        <BasicInput />
      </Form.Item>
      <Form.Item
        name="address"
        label={t('availabilityZone.form.node')}
        rules={[{ required: true }]}
      >
        <BasicInput />
      </Form.Item>
    </Form>
  );
};

export default AvailabilityZoneForm;
