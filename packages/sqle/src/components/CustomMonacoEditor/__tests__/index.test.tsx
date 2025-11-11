import CustomMonacoEditor from '..';
import { sqleSuperRender } from '../../../testUtils/superRender';

describe('test sqle/CustomMonacoEditor', () => {
  it('should render correctly', () => {
    const { baseElement } = sqleSuperRender(<CustomMonacoEditor />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render correctly with showAlert', () => {
    const { baseElement } = sqleSuperRender(<CustomMonacoEditor showAlert />);
    expect(baseElement).toMatchSnapshot();
  });
});
