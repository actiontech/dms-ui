import { renderWithTheme } from '../../../testUtil/customRender';

import CustomPlaceholder, { ICustomPlaceholder } from '../CustomPlaceholder';

describe('lib/CustomPlaceholder', () => {
  const customRender = (params: ICustomPlaceholder) => {
    return renderWithTheme(<CustomPlaceholder {...params} />);
  };

  it('render ui when has prefix', () => {
    const { container } = customRender({
      prefix: 'prefix string',
      placeholder: 'placeholder string'
    });

    expect(container).toMatchSnapshot();
  });

  it('render ui when no prefix', () => {
    const { container } = customRender({
      placeholder: 'placeholder string'
    });

    expect(container).toMatchSnapshot();
  });
});
