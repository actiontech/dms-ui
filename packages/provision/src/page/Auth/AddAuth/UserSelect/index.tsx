import { useRequest } from 'ahooks';
import { Form, FormInstance, Select } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import './index.less';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
interface IUserSelect {
  form: FormInstance<{ userValue: string }>;
}

const UserSelect: FC<IUserSelect> = ({ form }) => {
  const { t } = useTranslation();
  const userValue = Form.useWatch('userValue', form);
  const { projectID } = useCurrentProject();

  const { data: authUserOptions } = useRequest(() =>
    auth
      .AuthListUser({
        page_index: 1,
        page_size: 999,
        namespace_uid: projectID
      })
      .then((res) => {
        return (
          res.data.data?.map((item) => ({
            value: item.user_uid ?? '',
            label: item.name ?? ''
          })) ?? []
        );
      })
  );

  const handleDropdownVisibleChange = (open: boolean) => {
    if (!open && userValue) {
      form.resetFields(['userValue']);
    }
  };
  return (
    <Form.Item
      name="permission_user_uid"
      label={t('auth.addAuth.purposeForm.username')}
      rules={[{ required: true }]}
    >
      <Select
        showSearch={true}
        optionFilterProp="label"
        options={authUserOptions}
        popupClassName="permission_user_uid_select"
        onDropdownVisibleChange={handleDropdownVisibleChange}
      />
    </Form.Item>
  );
};

export default UserSelect;
