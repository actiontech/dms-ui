import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { SQLStatementFormProps, UploadTypeEnum } from '../../index.type';
import {
  BasicInput,
  EmptyBox,
  FormItemLabel,
  ModeSwitcher,
  CustomLabelContent
} from '@actiontech/shared';
import SqlUploadFileCont from './SqlUploadFileCont';
import { Form } from 'antd';
import { uploadTypeOptions } from './index.data';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../store';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';

const SQLStatementFormWrapper = ({
  form,
  isReadOnlyMode
}: SQLStatementFormProps) => {
  const { t } = useTranslation();
  const submitLoading = useSelector(
    (state: IReduxState) => state.sqlOptimization.submitLoading
  );

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
        className="has-required-style has-label-tip"
        required={true}
        name="uploadType"
        label={
          <CustomLabelContent
            title={t('sqlOptimization.create.sqlInfo.uploadType')}
            tips={t('sqlOptimization.create.simpleSqlTips')}
          />
        }
        initialValue={UploadTypeEnum.sql}
        style={{
          marginBottom: 16
        }}
        wrapperCol={{
          span: 24
        }}
        labelCol={{
          span: 24
        }}
      >
        <ModeSwitcher
          rowProps={{
            gutter: [10, 10]
          }}
          options={uploadTypeOptions}
          disabled={submitLoading}
        />
      </FormItemLabel>
      <EmptyBox
        if={uploadType === UploadTypeEnum.git}
        defaultNode={
          <SqlUploadFileCont form={form} isReadOnlyMode={isReadOnlyMode} />
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
          label={t('sqlOptimization.create.sqlInfo.uploadLabelEnum.gitUrl')}
        >
          <BasicInput
            disabled={submitLoading}
            placeholder={t('common.form.placeholder.input', {
              name: t('sqlOptimization.create.sqlInfo.uploadLabelEnum.gitUrl')
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
