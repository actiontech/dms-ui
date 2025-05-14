import {
  renderWithReduxAndTheme,
  renderHooksWithTheme
} from '@actiontech/shared/lib/testUtil/customRender';
import { Form } from 'antd';
import WhitelistForm from '../WhitelistForm';
import { WhitelistFormFields } from '../index.type';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

describe('sqle/Whitelist/WhitelistForm', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

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
