import { useTranslation } from 'react-i18next';
import { ReactNode, useContext, useEffect, useState } from 'react';

import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';

import {
  SQLStatementFormProps,
  UploadTypeEnum
} from '../SQLInfoForm/index.type';
import { IconEllipse } from '@actiontech/shared/lib/Icon/common';
import { UploadTypeStyleWrapper } from '../../../Order/SQLStatementForm/style';
import UploadTypeItem from '../../../Order/SQLStatementForm/UploadTypeItem';
import {
  IconOrderFileUpload,
  IconOrderSQLUpload
} from '../../../../icon/Order';
import { SQLUploadTypeKeys, TypeUploadKeys } from './index.type';
import { SettingOutlined } from '@ant-design/icons';
import { BasicInput, EmptyBox } from '@actiontech/shared';
import SqlUploadFileCont from './SqlUploadFileCont';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import { FormSubmitStatusContext } from '..';
import { Form } from 'antd';

const uploadItemIcon: {
  [key in TypeUploadKeys]: ReactNode;
} = {
  sql: <IconOrderSQLUpload />,
  git: <SettingOutlined style={{ color: '#c3c6cd' }} />,
  sqlFile: <IconOrderFileUpload />,
  mybatisFile: <IconOrderFileUpload />,
  zipFile: <IconOrderFileUpload />
};

const SQLStatementFormWrapper = ({ form }: SQLStatementFormProps) => {
  const { t } = useTranslation();
  const submitLoading = useContext(FormSubmitStatusContext);

  const uploadType = Form.useWatch('uploadType', form);
  const [currentSQLInputType, setCurrentSQLInputType] = useState(
    UploadTypeEnum.sql
  );

  const currentSQLInputTypeChange = (value: UploadTypeEnum) => {
    if (submitLoading) {
      return;
    }
    setCurrentSQLInputType(value);
    form.resetFields([
      'sql',
      'sqlFile',
      'mybatisFile',
      'zipFile',
      'gitHttpUrl',
      'gitUserName',
      'gitUserPassword'
    ]);
  };

  useEffect(() => {
    form.setFieldsValue({ uploadType: currentSQLInputType });
  }, [currentSQLInputType, form]);

  useEffect(() => {
    if (
      uploadType === UploadTypeEnum.sql &&
      currentSQLInputType !== UploadTypeEnum.sql
    ) {
      setCurrentSQLInputType(UploadTypeEnum.sql);
    }
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
      />
      <div style={{ marginBottom: 16 }}>
        <UploadTypeStyleWrapper>
          {SQLUploadTypeKeys.map((type) => {
            return (
              <UploadTypeItem
                key={`upload-item-${type}`}
                onClick={() =>
                  currentSQLInputTypeChange?.(UploadTypeEnum[type])
                }
                active={currentSQLInputType === UploadTypeEnum[type]}
              >
                {uploadItemIcon[type]}
                <span className="text">
                  {t(`sqlAudit.create.sqlInfo.uploadTypeEnum.${type}`)}
                </span>
              </UploadTypeItem>
            );
          })}
        </UploadTypeStyleWrapper>
      </div>
      <EmptyBox
        if={currentSQLInputType === UploadTypeEnum.git}
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
