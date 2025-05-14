import CopyrightInformation from '.';
import mockdate from 'mockdate';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';

describe('base/page/Nav/Copyright', () => {
  it('render snap', () => {
    mockdate.set('2024');
    const { baseElement } = superRender(<CopyrightInformation />);
    expect(baseElement).toMatchSnapshot();
    mockdate.reset();
  });
});
