import { FormInstance } from 'antd';

export type CloneRuleTemplateFormFields = {
  templateName: string;
  templateDesc?: string;
};

export type CloneRuleTemplateModalProps = {
  link: string;
  templateName: string | React.ReactNode;
  loading: boolean;
  visible: boolean;
  form: FormInstance<CloneRuleTemplateFormFields>;
  onClose: () => void;
  onSubmit: () => void;
};
