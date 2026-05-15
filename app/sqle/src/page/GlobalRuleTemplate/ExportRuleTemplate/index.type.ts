import { exportRuleTemplateV1ExportTypeEnum } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.enum';
import { FormInstance } from 'antd';

export type ExportRuleTemplateProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ExportRuleTemplateFormFields) => void;
  form: FormInstance<ExportRuleTemplateFormFields>;
  submitPending: boolean;
};

export type ExportRuleTemplateFormFields = {
  exportFileType: exportRuleTemplateV1ExportTypeEnum;
};
