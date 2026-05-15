import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { FormItemLabel } from '@actiontech/dms-kit';
import {
  SQLStatementFormProps,
  UploadTypeEnum
} from '../SQLInfoForm/index.type';
import { EmptyBox, ModeSwitcher } from '@actiontech/dms-kit';
import SqlUploadFileCont from './components/SqlUploadCont';
import { FormSubmitStatusContext } from '..';
import { Form } from 'antd';
import { uploadTypeOptions } from './index.data';
import { RingPieFilled } from '@actiontech/icons';
import RepositoryConfig from './components/RepositoryConfig';
const SQLStatementFormWrapper = ({ form }: SQLStatementFormProps) => {
  const { t } = useTranslation();
  const submitLoading = useContext(FormSubmitStatusContext);
  const uploadType = Form.useWatch('uploadType', form);
  const handleChangeUploadType = () => {
    form.resetFields([
      'sql',
      'sqlFile',
      'mybatisFile',
      'zipFile',
      'gitHttpUrl',
      'gitUserName',
      'gitUserPassword',
      'gitBranch',
      'gitProtocol',
      'formatted',
      'originSql'
    ]);
  };
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
          onChange={handleChangeUploadType}
          rowProps={{
            gutter: [10, 10]
          }}
          options={uploadTypeOptions}
          disabled={submitLoading}
        />
      </FormItemLabel>
      <EmptyBox
        if={uploadType === UploadTypeEnum.git}
        defaultNode={<SqlUploadFileCont form={form} />}
      >
        <RepositoryConfig submitLoading={submitLoading} />
      </EmptyBox>
    </>
  );
};
export default SQLStatementFormWrapper;
