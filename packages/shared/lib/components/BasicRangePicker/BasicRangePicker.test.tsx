import { superRender } from '../../testUtil/customRender';
import BasicRangePicker from './BasicRangePicker';
import { BasicRangePickerProps } from './BasicRangePicker.types';

describe('lib/BasicRangePicker', () => {
  const customRender = (params: BasicRangePickerProps) => {
    return superRender(<BasicRangePicker {...params} />);
  };

  it('should match snapshot', () => {
    const { container } = customRender({});
    expect(container).toMatchSnapshot();
  });

  describe('size calculation', () => {
    it('should render small size range picker correctly', () => {
      const { container } = customRender({
        className: 'custom-date-range',
        size: 'small'
      });
      expect(container.querySelector('.ant-picker-small')).toBeInTheDocument();
      expect(container.querySelector('.custom-date-range')).toBeInTheDocument();
    });

    it('should render middle size range picker correctly', () => {
      const { container } = customRender({
        size: 'middle'
      });
      expect(container.querySelector('.ant-picker')).toBeInTheDocument();
      expect(
        container.querySelector('.ant-picker-small')
      ).not.toBeInTheDocument();
      expect(
        container.querySelector('.ant-picker-large')
      ).not.toBeInTheDocument();
    });

    it('should render large size range picker correctly', () => {
      const { container } = customRender({
        size: 'large'
      });
      expect(container.querySelector('.ant-picker-large')).toBeInTheDocument();
    });
  });

  describe('icon rendering', () => {
    it('should not render prefix icon when suffixIcon and prefix are false', () => {
      const { container } = customRender({
        className: 'custom-date-range',
        suffixIcon: false,
        prefix: false
      });
      expect(
        container.querySelector('.ant-picker-suffix')
      ).not.toBeInTheDocument();
    });

    it('should render with super icon when hideSuperIcon is false', () => {
      const { container } = customRender({
        className: 'custom-date-range',
        hideSuperIcon: false
      });
      expect(
        container.querySelector('.basic-range-picker-wrapper')
      ).toBeInTheDocument();
    });
  });

  describe('custom className', () => {
    it('should apply custom className correctly', () => {
      const { container } = customRender({
        className: 'custom-date-range'
      });
      expect(container.querySelector('.custom-date-range')).toBeInTheDocument();
      expect(
        container.querySelector('.basic-range-picker-wrapper')
      ).toBeInTheDocument();
    });
  });
});
