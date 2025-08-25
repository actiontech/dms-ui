import { useTranslation } from 'react-i18next';
import {
  FormAreaBlockStyleWrapper,
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/dms-kit/es/components/CustomForm/style';
import { FormItemBigTitle, FormItemLabel } from '@actiontech/dms-kit';
import Icon from '@ant-design/icons';
import { getFileFromUploadChangeEvent } from '@actiontech/dms-kit';
import {
  BatchImportDataSourceFormType,
  FileUploadCheckStatusType
} from '../index.type';
import FileUpload from './FileUpload';
import { UploadProps } from 'antd';
import { OverviewOutlined } from '@actiontech/icons';

const BatchImportDataSourceForm: React.FC<{
  form: BatchImportDataSourceFormType;
  customRequest: UploadProps['customRequest'];
  uploadCheckStatus: FileUploadCheckStatusType;
  clearUploadCheckStatus: () => void;
}> = ({ form, customRequest, uploadCheckStatus, clearUploadCheckStatus }) => {
  const { t } = useTranslation();

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
              clearUploadCheckStatus();
            }}
            accept=".csv"
            customRequest={customRequest}
            uploadCheckStatus={uploadCheckStatus}
          />
        </FormItemLabel>
      </FormStyleWrapper>
    </FormAreaBlockStyleWrapper>
  );
};

export default BatchImportDataSourceForm;
