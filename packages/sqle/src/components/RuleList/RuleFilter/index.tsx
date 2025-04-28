import { Form, FormInstance } from 'antd';
import { FilterContainerStyleWrapper } from '@actiontech/shared/lib/components/ActiontechTable/components/style';
import RuleFilterCommonFields from './RuleFilterCommonFields';
import { RuleFilterFieldsType } from '../index.type';

type RuleFilterProps = {
  form: FormInstance<RuleFilterFieldsType>;
  extra?: React.ReactNode;
};

const RuleFilter: React.FC<RuleFilterProps> = ({ form, extra }) => {
  return (
    <FilterContainerStyleWrapper className="full-width-element flex-space-between">
      <Form form={form}>
        <RuleFilterCommonFields />
      </Form>
      {extra}
    </FilterContainerStyleWrapper>
  );
};

export default RuleFilter;
