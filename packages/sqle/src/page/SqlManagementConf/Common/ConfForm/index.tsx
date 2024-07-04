import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { useTranslation } from 'react-i18next';
import { ConfFormProps } from './index.type';
import DataSourceSelection from './DataSourceSelection';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import Icon from '@ant-design/icons';
import { IconCreatedTitle } from '../../../../icon/AuditPlan';
import ScanTypesSelection from './ScanTypesSelection';

const ConfForm: React.FC<ConfFormProps> = ({ submitLoading, defaultValue }) => {
  const { t } = useTranslation();
  return (
    <>
      <FormAreaLineStyleWrapper className="has-border">
        <FormAreaBlockStyleWrapper>
          <FormItemBigTitle>
            <Icon component={IconCreatedTitle} className="title-icon" />
            <span>{t('managementConf.create.title')}</span>
          </FormItemBigTitle>

          <DataSourceSelection />

          <ScanTypesSelection />
        </FormAreaBlockStyleWrapper>
      </FormAreaLineStyleWrapper>
    </>
  );
};

export default ConfForm;
