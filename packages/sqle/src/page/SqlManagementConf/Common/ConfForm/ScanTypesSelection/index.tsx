import {
  CustomLabelContent,
  FormItemLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { ScanTypesSelectorStyleWrapper } from './style';
import { Form } from 'antd';

const ScanTypesSelection: React.FC = () => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const options = [
    { label: '全部', value: 'all' },
    { label: '库表元数据', value: 'value1' },
    { label: '慢日志', value: 'value2' },
    { label: '会话SQL', value: 'value3' }
  ];
  return (
    <>
      <FormItemSubTitle>
        {t('managementConf.create.scanTypesSelection')}
      </FormItemSubTitle>

      <FormItemLabel
        name="scanTypes"
        className="has-label-tip has-required-style"
        label={
          <CustomLabelContent
            title={t('managementConf.create.scanType')}
            tips={t('managementConf.create.scanTypeTips')}
          />
        }
      >
        <ScanTypesSelectorStyleWrapper
          onChange={(values) => {
            if (values.includes('all')) {
              form.setFieldValue(
                'scanTypes',
                options.map((v) => v.value)
              );
            }
          }}
          wrap
          className="scan-types-selector"
          noStyle
          withCheckbox
          multiple
          options={options}
        />
      </FormItemLabel>
    </>
  );
};

export default ScanTypesSelection;
