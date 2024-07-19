import { Upload, UploadProps, Button, Space, Typography } from 'antd';
import { BasicButton, EmptyBox } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { ImportProjectUploadFileFieldWrapper } from '../../style';
import Project from '@actiontech/shared/lib/api/base/service/Project';
import { useBoolean } from 'ahooks';
import { FileUploadCheckStatusType } from '../index.type';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { CloseCircleOutlined, CheckCircleOutlined } from '@actiontech/icons';

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
      <section>
        <EmptyBox if={uploadCheckStatus.success}>
          <Space>
            <CommonIconStyleWrapper>
              <CheckCircleOutlined />
            </CommonIconStyleWrapper>
            <Typography.Text type="success">
              {t('dmsProject.batchImportDataSource.checkSuccess')}
            </Typography.Text>
          </Space>
        </EmptyBox>
        <EmptyBox if={!!uploadCheckStatus.errorMessage}>
          <Space align="start">
            <CommonIconStyleWrapper>
              <CloseCircleOutlined />
            </CommonIconStyleWrapper>
            <Typography.Text type="danger">
              {uploadCheckStatus.errorMessage}
            </Typography.Text>
          </Space>
        </EmptyBox>
      </section>
    </Space>
  );
};

export default FileUpload;
