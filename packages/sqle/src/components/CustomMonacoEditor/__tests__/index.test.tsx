import CustomMonacoEditor from '..';
import { sqleSuperRender } from '../../../testUtils/superRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('test sqle/CustomMonacoEditor', () => {
  it('should render correctly', () => {
    mockUseCurrentUser();
    const { baseElement } = sqleSuperRender(<CustomMonacoEditor />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render correctly with showAlert', () => {
    mockUseCurrentUser();
    const { baseElement } = sqleSuperRender(<CustomMonacoEditor showAlert />);
    expect(baseElement).toMatchSnapshot();
  });
});
