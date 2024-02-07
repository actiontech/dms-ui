import CopyrightInformation from '.';

import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

describe('base/page/Nav/Copyright', () => {
  it('render snap', () => {
    const { baseElement } = renderWithTheme(<CopyrightInformation />);
    expect(baseElement).toMatchSnapshot();
  });
});
