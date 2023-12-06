import { renderWithTheme } from '../../../testUtil/customRender';

import CustomOptionLabel, { ICustomOptionLabel } from '../CustomOptionLabel';

describe('lib/CustomOptionLabel', () => {
  const customRender = (params: ICustomOptionLabel) => {
    return renderWithTheme(<CustomOptionLabel {...params} />);
  };

  it('render ui when has prefix', () => {
    const { container } = customRender({
      prefix: 'prefix string',
      label: 'label string'
    });

    expect(container).toMatchSnapshot();
  });

  it('render ui when no prefix', () => {
    const { container } = customRender({
      label: 'label string'
    });

    expect(container).toMatchSnapshot();
  });
});
