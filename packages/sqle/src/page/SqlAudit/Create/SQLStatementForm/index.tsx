import { useTranslation } from 'react-i18next';
import React, { ReactNode, useEffect, useState } from 'react';
import { Form } from 'antd5';

import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';

import {
  SQLStatementFormProps,
  UploadTypeEnum
} from '../SQLInfoForm/index.type';
import { IconEllipse } from '@actiontech/shared/lib/Icon/common';
import {
  UploadItemTypeSpaceOccupyingStyleWrapper,
  UploadTypeStyleWrapper
} from '../../../Order/SQLStatementForm/style';
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

const uploadItemIcon: {
  [key in TypeUploadKeys]: ReactNode;
} = {
  sql: <IconOrderSQLUpload />,
  git: <SettingOutlined style={{ color: '#c3c6cd' }} />,
  sqlFile: <IconOrderFileUpload />,
  xmlFile: <IconOrderFileUpload />,
  zipFile: <IconOrderFileUpload />
};

const SQLStatementFormWrapper = ({ form }: SQLStatementFormProps) => {
  const { t } = useTranslation();

  const [currentSQLInputType, setCurrentSQLInputTYpe] = useState(
    UploadTypeEnum.sql
  );

  const currentSQLInputTypeChange = (value: UploadTypeEnum) => {
    setCurrentSQLInputTYpe(value);
    form.resetFields([
      'sql',
      'sqlFile',
      'xmlFile',
      'zipFile',
      'gitHttpUrl',
      'gitUserName',
      'gitUserPassword'
    ]);
  };

  useEffect(() => {
    form.setFieldsValue({ uploadType: currentSQLInputType });
  }, [currentSQLInputType, form]);

  return (
    <>
      <FormItemLabel
        className="has-required-style"
        required={true}
        label={
          <>
            <IconEllipse />
            <span>{t('sqlAudit.create.sqlInfo.form.uploadType')}</span>
          </>
        }
        style={{ marginBottom: 16 }}
      />
      <FormItemNoLabel name="uploadType">
        <UploadTypeStyleWrapper>
          {SQLUploadTypeKeys.slice(0, 3).map((type) => {
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
        <UploadTypeStyleWrapper style={{ marginTop: '12px' }}>
          {SQLUploadTypeKeys.slice(3).map((type) => {
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
          <UploadItemTypeSpaceOccupyingStyleWrapper />
        </UploadTypeStyleWrapper>
      </FormItemNoLabel>
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
