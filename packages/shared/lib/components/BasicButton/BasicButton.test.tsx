import { superRender } from '../../testUtil/customRender';
import BasicButton from './BasicButton';
import { BasicButtonProps } from './BasicButton.types';

describe('lib/BasicButton', () => {
  const customRender = (params: BasicButtonProps) => {
    return superRender(<BasicButton {...params} />);
  };

  it('should match snapshot', () => {
    const { container } = superRender(<BasicButton />);
    expect(container).toMatchSnapshot();
  });

  describe('render with different sizes', () => {
    it('should render default size button correctly', () => {
      const { container } = customRender({
        children: '默认大小主题按钮'
      });
      const button = container.querySelector('button');
      expect(button).toHaveClass(
        'ant-btn',
        'ant-btn-default',
        'basic-button-wrapper'
      );
      expect(button?.textContent).toBe('默认大小主题按钮');
    });

    it('should render middle size button correctly', () => {
      const { container } = customRender({
        size: 'middle',
        children: '中型默认主题按钮'
      });
      const button = container.querySelector('button');
      expect(button).toHaveClass(
        'ant-btn',
        'ant-btn-default',
        'basic-button-wrapper'
      );
      expect(button?.textContent).toBe('中型默认主题按钮');
    });

    it('should render large size button correctly', () => {
      const { container } = customRender({
        size: 'large',
        children: '大型默认主题按钮'
      });
      const button = container.querySelector('button');
      expect(button).toHaveClass(
        'ant-btn',
        'ant-btn-default',
        'ant-btn-lg',
        'basic-button-wrapper'
      );
      expect(button?.textContent).toBe('大型默认主题按钮');
    });

    it('should render small size button correctly', () => {
      const { container } = customRender({
        size: 'small',
        children: '小型默认主题按钮'
      });
      const button = container.querySelector('button');
      expect(button).toHaveClass(
        'ant-btn',
        'ant-btn-default',
        'ant-btn-sm',
        'basic-button-wrapper'
      );
      expect(button?.textContent).toBe('小型默认主题按钮');
    });
  });

  describe('render with different styles', () => {
    it('should render default style button correctly', () => {
      const { container } = customRender({
        children: '默认主题按钮'
      });
      const button = container.querySelector('button');
      expect(button).toHaveClass(
        'ant-btn',
        'ant-btn-default',
        'basic-button-wrapper'
      );
      expect(button?.textContent).toBe('默认主题按钮');
    });

    it('should render primary style button correctly', () => {
      const { container } = customRender({
        type: 'primary',
        children: '默认主题按钮'
      });
      const button = container.querySelector('button');
      expect(button).toHaveClass(
        'ant-btn',
        'ant-btn-primary',
        'basic-button-wrapper'
      );
      expect(button?.textContent).toBe('默认主题按钮');
    });

    it('should render dashed style button correctly', () => {
      const { container } = customRender({
        type: 'dashed',
        children: '虚线默认主题按钮'
      });
      const button = container.querySelector('button');
      expect(button).toHaveClass(
        'ant-btn',
        'ant-btn-dashed',
        'basic-button-wrapper'
      );
      expect(button?.textContent).toBe('虚线默认主题按钮');
    });

    it('should render danger style button correctly', () => {
      const { container } = customRender({
        danger: true,
        children: '危险按钮'
      });
      const button = container.querySelector('button');
      expect(button).toHaveClass(
        'ant-btn',
        'ant-btn-default',
        'ant-btn-dangerous',
        'basic-button-wrapper'
      );
      expect(button?.textContent).toBe('危险按钮');
    });

    it('should render button with no border icon correctly', () => {
      const { container } = customRender({
        noBorderIcon: true,
        icon: <>这是一个假装的图标</>
      });
      const button = container.querySelector('button');
      expect(button).toHaveClass(
        'ant-btn',
        'ant-btn-default',
        'basic-button-wrapper',
        'btn-icon-no-border'
      );
      expect(button?.textContent).toBe('这是一个假装的图标');
    });
  });
});
