import { Upload, UploadProps, Button, Space } from 'antd';
import { BasicButton, ReminderInformation, EmptyBox } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { ImportProjectUploadFileFieldWrapper } from '../../style';
import Project from '@actiontech/shared/lib/api/base/service/Project';
import { useBoolean } from 'ahooks';
import { FileUploadCheckStatusType } from '../index.type';

const FileUpload: React.FC<
  UploadProps & { uploadCheckStatus: FileUploadCheckStatusType }
> = ({ uploadCheckStatus, ...props }) => {
  const { t } = useTranslation();

  const [loading, { setTrue: setPending, setFalse: setDone }] = useBoolean();

  const onDownload = () => {
    setPending();
    Project.GetImportDBServicesTemplate({ responseType: 'blob' }).finally(() =>
      setDone()
    );
  };

  return (
    <Space direction="vertical">
      <ImportProjectUploadFileFieldWrapper>
        <Upload {...props}>
          <BasicButton>{t('common.upload')}</BasicButton>
        </Upload>
        <Button type="link" onClick={onDownload} loading={loading}>
          {t('dmsProject.importProject.downloadTemplate')}
        </Button>
      </ImportProjectUploadFileFieldWrapper>
      <EmptyBox if={!!uploadCheckStatus.success}>
        <ReminderInformation
          status="success"
          message={t('dmsProject.batchImportDataSource.checkSuccess')}
        />
      </EmptyBox>
      <EmptyBox if={!!uploadCheckStatus.errorMessage}>
        <ReminderInformation
          status="error"
          message={uploadCheckStatus.errorMessage ?? ''}
        />
      </EmptyBox>
    </Space>
  );
};

export default FileUpload;
