import { Form } from 'antd';
import { IDatabaseRoleFormProps } from './index.type';
import { useTranslation } from 'react-i18next';
import useServiceOptions from '../../../../hooks/useServiceOptions';
import { BasicInput, BasicSelect } from '@actiontech/shared';
import { useEffect } from 'react';
import DatabasePrivilegesSelector from '../../../../components/DatabasePrivilegesSelector';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import {
  FormAreaBlockStyleWrapper,
  formItemLayout,
  FormStyleWrapper
} from '@actiontech/shared/lib/components/CustomForm/style';
import {
  FormItemBigTitle,
  FormItemLabel
} from '@actiontech/shared/lib/components/CustomForm';

const RoleForm: React.FC<IDatabaseRoleFormProps> = ({ form, mode, title }) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();

  const {
    loading: getServiceOptionsPending,
    updateServiceList,
    serviceOptions,
    serviceList
  } = useServiceOptions();
  const selectedDBServiceID = Form.useWatch('dbServiceID', form);

  useEffect(() => {
    updateServiceList();
  }, [updateServiceList]);

  useEffect(() => {
    if (selectedDBServiceID) {
      form.setFieldValue(
        'dbType',
        serviceList.find((v) => v.uid === selectedDBServiceID)?.db_type
      );
    }
  }, [form, selectedDBServiceID, serviceList]);

  return (
    <FormStyleWrapper
      colon={false}
      labelAlign="left"
      className="hasTopHeader"
      form={form}
      {...formItemLayout.spaceBetween}
    >
      <FormAreaBlockStyleWrapper>
        <FormItemBigTitle>{title}</FormItemBigTitle>

        <FormItemLabel
          className="has-required-style"
          name="dbServiceID"
          label={t('databaseRole.createRole.dbService')}
          rules={[
            {
              required: true
            }
          ]}
        >
          <BasicSelect
            options={serviceOptions}
            loading={getServiceOptionsPending}
            disabled
          />
        </FormItemLabel>

        <FormItemLabel name="dbType" hidden>
          <BasicInput />
        </FormItemLabel>

        <FormItemLabel
          className="has-required-style"
          name="roleName"
          label={t('databaseRole.createRole.roleName')}
          rules={[
            {
              required: true
            }
          ]}
        >
          <BasicInput disabled={mode === 'update'} />
        </FormItemLabel>

        <DatabasePrivilegesSelector
          mode={mode}
          form={form}
          projectID={projectID}
        />
      </FormAreaBlockStyleWrapper>
    </FormStyleWrapper>
  );
};

export default RoleForm;
