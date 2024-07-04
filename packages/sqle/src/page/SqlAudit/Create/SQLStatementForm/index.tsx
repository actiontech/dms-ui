import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import {
  SQLStatementFormProps,
  UploadTypeEnum
} from '../SQLInfoForm/index.type';
import {
  BasicInput,
  BasicToolTips,
  EmptyBox,
  ModeSwitcher
} from '@actiontech/shared';
import SqlUploadFileCont from './SqlUploadFileCont';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import { FormSubmitStatusContext } from '..';
import { Form } from 'antd';
import { uploadTypeOptions } from './index.data';
import { RingPieFilled } from '@actiontech/icons';

const SQLStatementFormWrapper = ({ form }: SQLStatementFormProps) => {
  const { t } = useTranslation();
  const submitLoading = useContext(FormSubmitStatusContext);

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
            <RingPieFilled className="custom-icon-ellipse" />
            <span>{t('sqlAudit.create.sqlInfo.form.uploadType')}</span>
          </>
        }
        initialValue={UploadTypeEnum.sql}
        style={{ marginBottom: 16 }}
        wrapperCol={{ span: 24 }}
        labelCol={{ span: 24 }}
      >
        <ModeSwitcher
          rowProps={{ gutter: [10, 10] }}
          options={uploadTypeOptions}
          disabled={submitLoading}
        />
      </FormItemLabel>
      <EmptyBox
        if={uploadType === UploadTypeEnum.git}
        defaultNode={<SqlUploadFileCont form={form} />}
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
          label={
            <BasicToolTips
              suffixIcon
              title={t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitUrlTips')}
            >
              {t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitUrl')}
            </BasicToolTips>
          }
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
