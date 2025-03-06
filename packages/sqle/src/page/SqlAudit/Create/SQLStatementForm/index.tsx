import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/CustomForm';
import {
  SQLStatementFormProps,
  UploadTypeEnum
} from '../SQLInfoForm/index.type';
import {
  BasicInput,
  BasicToolTip,
  EmptyBox,
  ModeSwitcher,
  BasicButton,
  BasicSelect,
  ReminderInformation
} from '@actiontech/shared';
import SqlUploadFileCont from './SqlUploadFileCont';
import { formItemLayout } from '@actiontech/shared/lib/components/CustomForm/style';
import { FormSubmitStatusContext } from '..';
import { Form } from 'antd';
import { uploadTypeOptions } from './index.data';
import { RingPieFilled } from '@actiontech/icons';
import useRespConnection from './hooks/useRespConnection';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';

const SQLStatementFormWrapper = ({ form }: SQLStatementFormProps) => {
  const { t } = useTranslation();
  const submitLoading = useContext(FormSubmitStatusContext);

  const uploadType = Form.useWatch('uploadType', form);

  const {
    branchOptions,
    isConnectable,
    verifyConnection,
    verifyConnectionLoading,
    connectionInfoHide,
    connectionErrorMsg,
    initConnectionState
  } = useRespConnection(form);

  useEffect(() => {
    form.resetFields([
      'sql',
      'sqlFile',
      'mybatisFile',
      'zipFile',
      'gitHttpUrl',
      'gitUserName',
      'gitUserPassword',
      'gitBranch'
    ]);
    initConnectionState();
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
          className="has-required-style"
          name="gitHttpUrl"
          required={true}
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.input', {
                name: t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitUrl')
              })
            }
          ]}
          {...formItemLayout.fullLine}
          label={
            <BasicToolTip
              suffixIcon
              title={t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitUrlTips')}
            >
              {t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitUrl')}
            </BasicToolTip>
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
          className="has-required-style"
          name="gitUserName"
          label={t('common.username')}
          {...formItemLayout.spaceBetween}
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.input', {
                name: t('common.username')
              })
            }
          ]}
        >
          <BasicInput
            disabled={submitLoading}
            placeholder={t('common.form.placeholder.input', {
              name: t('common.username')
            })}
          />
        </FormItemLabel>
        <FormItemLabel
          className="has-required-style"
          name="gitUserPassword"
          label={t('common.password')}
          {...formItemLayout.spaceBetween}
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.input', {
                name: t('common.password')
              })
            }
          ]}
        >
          <BasicInput.Password
            disabled={submitLoading}
            placeholder={t('common.form.placeholder.input', {
              name: t('common.password')
            })}
          />
        </FormItemLabel>
        <FormItemNoLabel {...formItemLayout.spaceBetween}>
          <BasicButton
            onClick={verifyConnection}
            loading={verifyConnectionLoading}
          >
            {t('sqlAudit.create.sqlInfo.uploadLabelEnum.verifyConnection')}
          </BasicButton>
          <EmptyBox if={!connectionInfoHide}>
            {!verifyConnectionLoading && isConnectable && (
              <ReminderInformation
                status="success"
                message={t(
                  'sqlAudit.create.sqlInfo.uploadLabelEnum.connectSuccess'
                )}
              />
            )}
            {!verifyConnectionLoading && !isConnectable && (
              <ReminderInformation
                status="error"
                message={connectionErrorMsg ?? t('common.unknownError')}
              />
            )}
          </EmptyBox>
        </FormItemNoLabel>
        <FormItemLabel
          className="has-required-style"
          name="gitBranch"
          label={t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitBranch')}
          {...formItemLayout.spaceBetween}
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.select', {
                name: t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitBranch')
              })
            }
          ]}
        >
          <BasicSelect
            disabled={submitLoading || !isConnectable}
            placeholder={
              !isConnectable
                ? t(
                    'sqlAudit.create.sqlInfo.uploadLabelEnum.pleaseVerifyConnection'
                  )
                : t('common.form.placeholder.select', {
                    name: t('sqlAudit.create.sqlInfo.uploadLabelEnum.gitBranch')
                  })
            }
            options={branchOptions}
            showSearch
            filterOption={filterOptionByLabel}
          />
        </FormItemLabel>
      </EmptyBox>
    </>
  );
};

export default SQLStatementFormWrapper;
