import { getRuleTemplateFileV1FileTypeEnum } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.enum';

export type DownloadTemplateModalProps = {
  open: boolean;
  fileType: getRuleTemplateFileV1FileTypeEnum;
  onClose: () => void;
};

export type DownloadTemplateFormFields = {
  dbType: string;
};
