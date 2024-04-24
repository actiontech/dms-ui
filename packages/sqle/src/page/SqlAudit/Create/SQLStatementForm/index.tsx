import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import {
  UploadTypeEnum,
  SQLStatementFormType
} from '../SQLInfoForm/index.type';
import { IconEllipse } from '@actiontech/shared/lib/Icon/common';
import { BasicInput, EmptyBox } from '@actiontech/shared';
import SqlUploadFileCont from './SqlUploadFileCont';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import { Form } from 'antd';
import SqlUploadType from './SqlUploadType';

const SQLStatementFormWrapper = <T extends SQLStatementFormType>(props: {
  form: T;
  submitLoading: boolean;
}) => {
  const { form, submitLoading } = props;
  const { t } = useTranslation();

  const uploadType = Form.useWatch('uploadType', form);

  useEffect(() => {
    form.resetFields([
      'sql',
      'sqlFile',
      'mybatisFile',
      'zipFile',
      'gitHttpUrl',
      'gitUserName',
      'gitUserPassword'
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadType]);

  return (
    <>
      <FormItemLabel
        className="has-required-style"
        required={true}
        name="uploadType"
        label={
          <>
            <IconEllipse />
            <span>{t('sqlAudit.create.sqlInfo.form.uploadType')}</span>
          </>
        }
        initialValue={UploadTypeEnum.sql}
        style={{ marginBottom: 16 }}
        wrapperCol={{ span: 24 }}
        labelCol={{ span: 24 }}
      >
        <SqlUploadType submitLoading={submitLoading} />
      </FormItemLabel>
      <EmptyBox
        if={uploadType === UploadTypeEnum.git}
        defaultNode={
          <SqlUploadFileCont form={form} submitLoading={submitLoading} />
        }
      >
        {/* git form info */}
        <FormItemLabel
          name="gitHttpUrl"
          required={true}
          rules={[
            {
              required: true
            }
          ]}
          {...formItemLayout.fullLine}
          label={t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitUrl')}
        >
          <BasicInput
            disabled={submitLoading}
            placeholder={t('common.form.placeholder.input', {
              name: t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitUrl')
            })}
          />
        </FormItemLabel>
        <FormItemLabel
          name="gitUserName"
          label={t('common.username')}
          {...formItemLayout.spaceBetween}
        >
          <BasicInput
            disabled={submitLoading}
            placeholder={t('common.form.placeholder.input', {
              name: t('common.username')
            })}
          />
        </FormItemLabel>
        <FormItemLabel
          name="gitUserPassword"
          label={t('common.password')}
          {...formItemLayout.spaceBetween}
        >
          <BasicInput.Password
            disabled={submitLoading}
            placeholder={t('common.form.placeholder.input', {
              name: t('common.password')
            })}
          />
        </FormItemLabel>
      </EmptyBox>
    </>
  );
};

export default SQLStatementFormWrapper;
