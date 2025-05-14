import { Form, FormInstance } from 'antd';
import { FilterContainerStyleWrapper } from '@actiontech/shared/lib/components/ActiontechTable/components/style';
import RuleFilterCommonFields from './RuleFilterCommonFields';
import { RuleFilterFieldsType } from '../index.type';

type RuleFilterProps = {
  form: FormInstance<RuleFilterFieldsType>;
};

const RuleFilter: React.FC<RuleFilterProps> = ({ form }) => {
  return (
    <FilterContainerStyleWrapper className="full-width-element flex-space-between">
      <Form form={form}>
        <RuleFilterCommonFields />
      </Form>
    </FilterContainerStyleWrapper>
  );
};

export default RuleFilter;
