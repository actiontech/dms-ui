import {
  CustomLabelContent,
  FormItemLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { BasicInput } from '@actiontech/shared';
import { workflowNameRule } from '@actiontech/shared/lib/utils/FormRule';

const VersionBaseInfo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <FormItemSubTitle>
        {t('versionManagement.form.baseInfo')}
      </FormItemSubTitle>
      <FormItemLabel
        className="has-required-style has-label-tip"
        label={
          <CustomLabelContent
            title={t('versionManagement.form.name')}
            tips={t('versionManagement.form.nameTip')}
          />
        }
        name="version"
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.input', {
              name: t('versionManagement.form.name')
            })
          },
          { validator: workflowNameRule() },
          { max: 59 }
        ]}
      >
        <BasicInput />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('versionManagement.form.desc')}
            tips={t('versionManagement.form.descTip')}
          />
        }
        name="desc"
      >
        <BasicInput.TextArea />
      </FormItemLabel>
    </>
  );
};

export default VersionBaseInfo;
