import FileModeHeader from '.';
import { superRender } from '../../../../../../testUtils/customRender';

describe('test TaskResultList/FileModeHeader', () => {
  it('should match snapshot', () => {
    expect(superRender(<FileModeHeader />).container).toMatchSnapshot();
  });
});
