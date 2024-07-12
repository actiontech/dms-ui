import { BasicButton, EmptyBox } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import {
  FormAreaBlockStyleWrapper,
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import {
  FormItemBigTitle,
  FormItemLabel
} from '@actiontech/shared/lib/components/FormCom';
import Icon from '@ant-design/icons';
import { getFileFromUploadChangeEvent } from '@actiontech/shared/lib/utils/Common';
import { BatchImportDataSourceFormType } from '../index.type';
import FileUpload from './FileUpload';
import { UploadProps, Space, Typography } from 'antd';
import Project from '@actiontech/shared/lib/api/base/service/Project';
import { useBoolean } from 'ahooks';
import { useState } from 'react';
import { IDBServicesConnectionItem } from '@actiontech/shared/lib/api/base/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IDBService } from '@actiontech/shared/lib/api/base/service/common';
import { useEffect } from 'react';
import {
  CloseCircleOutlined,
  CheckCircleOutlined,
  OverviewOutlined
} from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

const BatchImportDataSourceForm: React.FC<{
  form: BatchImportDataSourceFormType;
  customRequest: UploadProps['customRequest'];
  dbServices?: IDBService[];
}> = ({ form, customRequest, dbServices }) => {
  const { t } = useTranslation();

  const [
    connectionTesting,
    { setTrue: setConnectionTesting, setFalse: setConnectionTestingDone }
  ] = useBoolean();

  const [connectionTestResult, setConnectionTestResult] =
    useState<IDBServicesConnectionItem>();

  const onBatchTestConnection = async () => {
    await form.validateFields();
    setConnectionTesting();
    Project.DBServicesConnection({
      db_services: dbServices?.map((i) => {
        return {
          additional_params: i.additional_params,
          db_type: i.db_type ?? '',
          host: i.host,
          name: i.name,
          password: i.password,
          port: i.port,
          user: i.user
        };
      })
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setConnectionTestResult(res.data.data);
        }
      })
      .finally(() => {
        setConnectionTestingDone();
      });
  };

  useEffect(() => {
    if (!dbServices?.length) {
      setConnectionTestResult(undefined);
    }
  }, [dbServices]);

  return (
    <FormAreaBlockStyleWrapper className="fix-header-padding">
      <FormStyleWrapper
        form={form}
        colon={false}
        labelAlign="left"
        className="hasTopHeader"
        {...formItemLayout.spaceBetween}
      >
        <FormItemBigTitle>
          <Icon component={OverviewOutlined} className="title-icon" />
          <span>{t('dmsProject.batchImportDataSource.title')}</span>
        </FormItemBigTitle>
        <FormItemLabel
          className="has-required-style"
          label={t('dmsProject.importProject.selectFile')}
          name="files"
          valuePropName="fileList"
          getValueFromEvent={getFileFromUploadChangeEvent}
          rules={[
            {
              required: true,
              message: t('dmsProject.importProject.fileRequireTips')
            }
          ]}
        >
          <FileUpload
            maxCount={1}
            onRemove={() => {
              form.setFieldsValue({
                files: undefined
              });
              setConnectionTestResult(undefined);
            }}
            accept=".csv"
            customRequest={customRequest}
          />
        </FormItemLabel>
        <Space direction="vertical">
          <BasicButton
            disabled={!dbServices?.length}
            type="primary"
            onClick={onBatchTestConnection}
            loading={connectionTesting}
          >
            {t('dmsProject.batchImportDataSource.testConnect')}
          </BasicButton>
          <EmptyBox if={!connectionTesting && !!connectionTestResult}>
            <Space direction="vertical">
              <EmptyBox if={!!connectionTestResult?.successful_num}>
                <Space>
                  <CommonIconStyleWrapper>
                    <CheckCircleOutlined />
                  </CommonIconStyleWrapper>
                  <Typography.Text type="success">
                    {t('dmsProject.batchImportDataSource.testConnectSuccess', {
                      count: connectionTestResult?.successful_num
                    })}
                  </Typography.Text>
                </Space>
              </EmptyBox>
              <EmptyBox if={!!connectionTestResult?.failed_num}>
                <Space>
                  <CommonIconStyleWrapper>
                    <CloseCircleOutlined />
                  </CommonIconStyleWrapper>
                  <Typography.Text type="danger">
                    {t('dmsProject.batchImportDataSource.testConnectFail', {
                      count: connectionTestResult?.failed_num,
                      name: connectionTestResult?.failed_names?.join(',')
                    })}
                  </Typography.Text>
                </Space>
              </EmptyBox>
            </Space>
          </EmptyBox>
        </Space>
      </FormStyleWrapper>
    </FormAreaBlockStyleWrapper>
  );
};

export default BatchImportDataSourceForm;
