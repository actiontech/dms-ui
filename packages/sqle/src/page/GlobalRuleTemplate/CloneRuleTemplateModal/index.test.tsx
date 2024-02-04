import {
  renderWithReduxAndTheme,
  renderHooksWithTheme
} from '@actiontech/shared/lib/testUtil/customRender';
import { Form } from 'antd';
import CloneRuleTemplateModal from '../CloneRuleTemplateModal';
import { CloneRuleTemplateFormFields } from './index.type';
import { BrowserRouter } from 'react-router-dom';

describe('sqle/GlobalRuleTemplate/CloneRuleTemplateModal', () => {
  it('should match snapshot', () => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<CloneRuleTemplateFormFields>()
    );
    const { baseElement } = renderWithReduxAndTheme(
      <BrowserRouter>
        <CloneRuleTemplateModal
          form={result.current[0]}
          visible={true}
          loading={false}
          link=""
          templateName="test_template"
          onClose={jest.fn()}
          onSubmit={jest.fn()}
        />
      </BrowserRouter>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
