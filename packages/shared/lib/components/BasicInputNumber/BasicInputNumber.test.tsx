import { renderWithTheme } from '../../testUtil/customRender';
import BasicInputNumber from './BasicInputNumber';
import { BasicInputNumberProps } from './BasicInputNumber.types';

describe('lib/BasicInputNumber', () => {
  const customRender = (params: BasicInputNumberProps) => {
    return renderWithTheme(<BasicInputNumber {...params} />);
  };

  it('render diff size input number', () => {
    const { container } = customRender({
      className: 'custom-input-number-class'
    });
    expect(container).toMatchSnapshot();

    const { container: container1 } = customRender({
      size: 'large'
    });
    expect(container1).toMatchSnapshot();

    const { container: container2 } = customRender({
      size: 'middle'
    });
    expect(container2).toMatchSnapshot();

    const { container: container3 } = customRender({
      size: 'small'
    });
    expect(container3).toMatchSnapshot();
  });
});
