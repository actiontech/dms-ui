import { superRender } from '../../testUtil/superRender';
import BasicResult from './BasicResult';
import { BasicResultProps } from './BasicResult.types';

describe('lib/BasicResult', () => {
  const customRender = (params: BasicResultProps) => {
    return superRender(<BasicResult {...params} />);
  };

  it('should match snapshot', () => {
    const { container } = customRender({
      status: 'success',
      title: '成功标题',
      subTitle: '成功副标题'
    });
    expect(container).toMatchSnapshot();
  });

  describe('render with different status', () => {
    it('should render with success status', () => {
      const { container } = customRender({
        status: 'success',
        title: '成功标题',
        subTitle: '成功副标题'
      });
      expect(
        container.querySelector('.ant-result-success')
      ).toBeInTheDocument();
      expect(container.querySelector('.ant-result-title')).toHaveTextContent(
        '成功标题'
      );
      expect(container.querySelector('.ant-result-subtitle')).toHaveTextContent(
        '成功副标题'
      );
    });

    it('should render with error status', () => {
      const { container } = customRender({
        status: 'error',
        title: '错误标题'
      });
      expect(container.querySelector('.ant-result-error')).toBeInTheDocument();
      expect(container.querySelector('.ant-result-title')).toHaveTextContent(
        '错误标题'
      );
    });

    it('should render with info status', () => {
      const { container } = customRender({
        status: 'info',
        title: '信息标题'
      });
      expect(container.querySelector('.ant-result-info')).toBeInTheDocument();
      expect(container.querySelector('.ant-result-title')).toHaveTextContent(
        '信息标题'
      );
    });

    it('should render with warning status', () => {
      const { container } = customRender({
        status: 'warning',
        title: '警告标题'
      });
      expect(
        container.querySelector('.ant-result-warning')
      ).toBeInTheDocument();
      expect(container.querySelector('.ant-result-title')).toHaveTextContent(
        '警告标题'
      );
    });
  });

  describe('render with custom props', () => {
    it('should render with custom className', () => {
      const { container } = customRender({
        className: 'custom-result-box'
      });
      expect(container.querySelector('.custom-result-box')).toBeInTheDocument();
      expect(
        container.querySelector('.basic-result-wrapper')
      ).toBeInTheDocument();
    });

    it('should render with extra content', () => {
      const extraContent = <div className="extra-content">额外内容</div>;
      const { container } = customRender({
        title: '标题',
        extra: extraContent
      });
      expect(container.querySelector('.extra-content')).toBeInTheDocument();
      expect(container.querySelector('.extra-content')).toHaveTextContent(
        '额外内容'
      );
    });
  });
});
