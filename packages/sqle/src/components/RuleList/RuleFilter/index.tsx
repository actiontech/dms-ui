import { Form, Space, FormInstance } from 'antd';
import { FilterContainerStyleWrapper } from '@actiontech/shared/lib/components/ActiontechTable/components/style';
import { useTranslation } from 'react-i18next';
import RuleFilterCommonFields from './RuleFilterCommonFields';

type RuleFilterProps = {
  form: FormInstance;
};

const RuleFilter: React.FC<RuleFilterProps> = ({ form }) => {
  const { t } = useTranslation();

  return (
    <FilterContainerStyleWrapper className="full-width-element">
      <Form form={form}>
        <RuleFilterCommonFields />
      </Form>
    </FilterContainerStyleWrapper>
  );
};

export default RuleFilter;
