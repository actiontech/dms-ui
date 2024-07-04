import { renderWithTheme } from '../../testUtil/customRender';

import SpinIndicator from '.';

describe('lib/SpinIndicator', () => {
  it('should match init snap', () => {
    const { baseElement } = renderWithTheme(<SpinIndicator />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snap when modify prop', () => {
    const { baseElement } = renderWithTheme(
      <SpinIndicator width={30} height={40} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
