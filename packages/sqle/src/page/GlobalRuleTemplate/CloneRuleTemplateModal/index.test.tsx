import {
  superRender,
  superRenderHook
} from '@actiontech/shared/lib/testUtil/superRender';
import { Form } from 'antd';
import CloneRuleTemplateModal from '../CloneRuleTemplateModal';
import { CloneRuleTemplateFormFields } from './index.type';

describe('sqle/GlobalRuleTemplate/CloneRuleTemplateModal', () => {
  it('should match snapshot', () => {
    const { result } = superRenderHook(() =>
      Form.useForm<CloneRuleTemplateFormFields>()
    );
    const { baseElement } = superRender(
      <CloneRuleTemplateModal
        form={result.current[0]}
        visible={true}
        loading={false}
        link=""
        templateName="test_template"
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
