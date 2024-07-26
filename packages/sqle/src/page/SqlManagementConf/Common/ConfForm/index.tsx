import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { useTranslation } from 'react-i18next';
import DataSourceSelection from './DataSourceSelection';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import ScanTypesSelection from './ScanTypesSelection';
import { PlanFilled } from '@actiontech/icons';
import ScanTypesDynamicParams from './ScanTypesDynamicParams';
import { useContext, useEffect } from 'react';
import { ConfFormContext } from './context';
import { Form } from 'antd';
import { SqlManagementConfFormFields } from './index.type';

const ConfForm: React.FC = () => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SqlManagementConfFormFields>();

  const defaultValue = useContext(ConfFormContext)?.defaultValue;

  useEffect(() => {
    if (!!defaultValue) {
      form.setFieldsValue({
        ...defaultValue,
        instanceName: defaultValue.instanceName || undefined
      });
    }
  }, [defaultValue, form]);

  return (
    <>
      <FormAreaLineStyleWrapper className="has-border">
        <FormAreaBlockStyleWrapper>
          <FormItemBigTitle>
            <PlanFilled width={42} height={40} className="title-icon" />
            <span>{t('managementConf.create.title')}</span>
          </FormItemBigTitle>

          <DataSourceSelection />

          <ScanTypesSelection />
        </FormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>

      <ScanTypesDynamicParams />
    </>
  );
};

export default ConfForm;
