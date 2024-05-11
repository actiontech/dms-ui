import { BasicDrawer } from '@actiontech/shared';
import { EditSQLInfoDrawerProps } from './index.type';
import SQLInfoFormItem from '../SQLInfoForm/SQLInfoFormItem';
import {
  EditBaseInfoFormStyleWrapper,
  EditOrderFormTitleStyleWrapper,
  EditSQLInfoFormStyleWrapper
} from './style';
import { useForm } from 'antd/es/form/Form';
import { OrderBaseInfoFormFields } from '../BaseInfoForm/index.type';
import { SQLInfoFormFields, SQLInfoFormProps } from '../SQLInfoForm/index.type';
import { useTranslation } from 'react-i18next';
import BaseInfoFormItem from '../BaseInfoForm/BaseInfoFormItem';
import BaseInfoTag from './BaseInfoTag';
import { useRef } from 'react';
import { Divider, Spin } from 'antd';

const EditSQLInfoDrawer: React.FC<EditSQLInfoDrawerProps> = ({
  open,
  onClose,
  baseFormValues,
  sqlInfoFormValues,
  username,
  submit,
  ...props
}) => {
  const { t } = useTranslation();
  const syncDataReady = useRef(false);
  const [baseInfoForm] = useForm<OrderBaseInfoFormFields>();
  const [sqlInfoForm] = useForm<SQLInfoFormFields>();

  const closeHandle = () => {
    if (props.auditLoading) {
      return;
    }

    onClose();
  };

  const internalSubmit: SQLInfoFormProps['submit'] = (values) => {
    return submit(values, baseInfoForm.getFieldsValue());
  };

  return (
    <BasicDrawer
      afterOpenChange={(_open) => {
        if (_open && !syncDataReady.current) {
          baseInfoForm.setFieldsValue({ ...baseFormValues });
          sqlInfoForm.setFieldsValue({ ...sqlInfoFormValues });
          syncDataReady.current = true;
        }
      }}
      open={open}
      size="large"
      title={false}
      closeIcon={false}
      onClose={closeHandle}
      bodyStyle={{
        padding: 0
      }}
      width={735}
      noBodyPadding
    >
      <Spin spinning={props.auditLoading}>
        <EditBaseInfoFormStyleWrapper form={baseInfoForm}>
          <EditOrderFormTitleStyleWrapper>
            {t('order.baseInfo.title')}
          </EditOrderFormTitleStyleWrapper>
          <BaseInfoFormItem
            slot={
              <BaseInfoTag
                projectName={props.projectName}
                username={username}
              />
            }
          />
        </EditBaseInfoFormStyleWrapper>

        <Divider style={{ marginTop: 12 }} />

        <EditSQLInfoFormStyleWrapper
          labelAlign="left"
          form={sqlInfoForm}
          colon={false}
        >
          <EditOrderFormTitleStyleWrapper>
            {t('order.sqlInfo.title')}
          </EditOrderFormTitleStyleWrapper>
          <SQLInfoFormItem
            form={sqlInfoForm}
            submit={internalSubmit}
            {...props}
          />
        </EditSQLInfoFormStyleWrapper>
      </Spin>
    </BasicDrawer>
  );
};

export default EditSQLInfoDrawer;
