import { Upload, UploadProps, Button } from 'antd';
import { BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { ImportProjectUploadFileFieldWrapper } from '../../style';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { useBoolean } from 'ahooks';

const FileUpload: React.FC<UploadProps> = (props) => {
  const { t } = useTranslation();

  const [loading, { setTrue: setPending, setFalse: setDone }] = useBoolean();

  const onDownload = () => {
    setPending();
    dms
      .GetImportProjectsTemplate({ responseType: 'blob' })
      .finally(() => setDone());
  };

  return (
    <ImportProjectUploadFileFieldWrapper>
      <Upload {...props}>
        <BasicButton>{t('common.upload')}</BasicButton>
      </Upload>
      <Button type="link" onClick={onDownload} loading={loading}>
        {t('dmsProject.importProject.downloadTemplate')}
      </Button>
    </ImportProjectUploadFileFieldWrapper>
  );
};

export default FileUpload;
