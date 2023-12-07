import Nav from '.';
import { superRender } from '../../testUtils/customRender';

describe('diagnosis/Nav', () => {
  it('should match snapshot', async () => {
    const { baseElement } = superRender(<Nav />);
    expect(baseElement).toMatchSnapshot();
  });
});
