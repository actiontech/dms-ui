import CopyrightInformation from '.';
import mockdate from 'mockdate';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

describe('base/page/Nav/Copyright', () => {
  it('render snap', () => {
    mockdate.set('2024');
    const { baseElement } = renderWithTheme(<CopyrightInformation />);
    expect(baseElement).toMatchSnapshot();
    mockdate.reset();
  });
});
