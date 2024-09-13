import { Button, Form, Upload, UploadProps } from 'antd';
import { BasicButton, EmptyBox, ReminderInformation } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import {
  FileUploadCheckStatusType,
  SelectFileFormFields
} from '../../../../hooks/useRuleTemplateForm/index.type';
import { getRuleTemplateFileV1FileTypeEnum } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.enum';
import DownloadTemplateModal from './components/DownloadTemplateModal';

type Props = UploadProps & {
  uploadCheckStatus: FileUploadCheckStatusType;
};

const FileUpload: React.FC<Props> = ({ uploadCheckStatus, ...props }) => {
  const { t } = useTranslation();

  const form = Form.useFormInstance<SelectFileFormFields>();

  const fileType = Form.useWatch('fileType', form);

  const [
    downloadTemplateModalVisibility,
    { setTrue: openModal, setFalse: closeModal }
  ] = useBoolean();

  return (
    <div className="vertical-flex">
      <div className="flex-display">
        <Upload {...props}>
          <BasicButton>{t('common.upload')}</BasicButton>
        </Upload>
        <Button type="link" onClick={openModal}>
          {t('ruleTemplate.importRuleTemplate.downloadTemplate')}
        </Button>
      </div>

      <EmptyBox if={!!uploadCheckStatus.success}>
        <ReminderInformation
          status="success"
          message={t('ruleTemplate.importRuleTemplate.checkSuccess')}
        />
      </EmptyBox>
      <EmptyBox if={!!uploadCheckStatus.errorMessage}>
        <ReminderInformation
          status="error"
          message={uploadCheckStatus.errorMessage ?? ''}
        />
      </EmptyBox>

      <DownloadTemplateModal
        fileType={fileType as unknown as getRuleTemplateFileV1FileTypeEnum}
        open={downloadTemplateModalVisibility}
        onClose={closeModal}
      />
    </div>
  );
};

export default FileUpload;
