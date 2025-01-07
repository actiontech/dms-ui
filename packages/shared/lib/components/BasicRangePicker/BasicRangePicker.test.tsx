import { renderWithTheme } from '../../testUtil/customRender';
import BasicRangePicker from './BasicRangePicker';
import { BasicRangePickerProps } from './BasicRangePicker.types';

describe('lib/BasicRangePicker', () => {
  const customRender = (params: BasicRangePickerProps) => {
    return renderWithTheme(<BasicRangePicker {...params} />);
  };

  it('render diff size range date', () => {
    const { baseElement } = customRender({
      className: 'custom-date-range',
      size: 'small'
    });
    expect(baseElement).toMatchSnapshot();

    const { baseElement: baseElement1 } = customRender({
      size: 'middle'
    });
    expect(baseElement1).toMatchSnapshot();

    const { baseElement: baseElement2 } = customRender({
      size: 'large'
    });
    expect(baseElement2).toMatchSnapshot();
  });

  it('render none prefix icon', () => {
    const { baseElement } = customRender({
      className: 'custom-date-range',
      suffixIcon: false,
      prefix: false
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render no supper icon', () => {
    const { baseElement } = customRender({
      className: 'custom-date-range',
      hideSuperIcon: false
    });
    expect(baseElement).toMatchSnapshot();
  });
});
