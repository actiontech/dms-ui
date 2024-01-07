import {
  renderWithReduxAndTheme,
  renderHooksWithTheme
} from '@actiontech/shared/lib/testUtil/customRender';
import { Form } from 'antd';
import WhitelistForm from '../WhitelistForm';
import { WhitelistFormFields } from '../index.type';

describe('sqle/Whitelist/WhitelistForm', () => {
  it('should match snapshot', () => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<WhitelistFormFields>()
    );
    const { baseElement } = renderWithReduxAndTheme(
      <WhitelistForm form={result.current[0]} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
