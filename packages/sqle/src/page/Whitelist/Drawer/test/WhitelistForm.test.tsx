import {
  superRender,
  superRenderHook
} from '@actiontech/shared/lib/testUtil/superRender';
import { Form } from 'antd';
import WhitelistForm from '../WhitelistForm';
import { WhitelistFormFields } from '../index.type';

describe('sqle/Whitelist/WhitelistForm', () => {
  it('should match snapshot', () => {
    const { result } = superRenderHook(() =>
      Form.useForm<WhitelistFormFields>()
    );
    const { baseElement } = superRender(
      <WhitelistForm form={result.current[0]} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
