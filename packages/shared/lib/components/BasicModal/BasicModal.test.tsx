import { screen } from '@testing-library/react';
import { superRender } from '../../testUtil/superRender';
import BasicModal from './BasicModal';
import { BasicModalProps } from './BasicModal.types';

describe('lib/BasicModal', () => {
  const customRender = (params: BasicModalProps) => {
    return superRender(<BasicModal {...params} />);
  };

  it('should match snapshot', () => {
    const { baseElement } = customRender({
      title: '基础modal',
      open: true
    });
    expect(baseElement).toMatchSnapshot();
  });

  describe('width calculation', () => {
    it('should render small modal with width 480px by default', () => {
      const { baseElement } = customRender({
        title: '基础modal480',
        open: true
      });
      const modalElement = baseElement.querySelector('.ant-modal');
      expect(modalElement).toHaveStyle({ width: '480px' });
    });

    it('should render large modal with width 960px', () => {
      const { baseElement } = customRender({
        title: '基础modal960',
        open: true,
        size: 'large'
      });
      const modalElement = baseElement.querySelector('.ant-modal');
      expect(modalElement).toHaveStyle({ width: '960px' });
    });

    it('should prioritize custom width over size prop', () => {
      const { baseElement } = customRender({
        title: '自定义宽度',
        open: true,
        size: 'small',
        width: 720
      });
      const modalElement = baseElement.querySelector('.ant-modal');
      expect(modalElement).toHaveStyle({ width: '720px' });
    });
  });

  describe('close icon', () => {
    it('should render close icon by default', () => {
      const { baseElement } = customRender({
        title: '基础modal',
        open: true
      });
      expect(baseElement.querySelector('.ant-modal-close')).toBeInTheDocument();
    });

    it('should not render close icon when closable is false', () => {
      const { baseElement } = customRender({
        title: '基础modal',
        open: true,
        closable: false
      });
      expect(
        baseElement.querySelector('.ant-modal-close')
      ).not.toBeInTheDocument();
    });
  });

  describe('custom className', () => {
    it('should apply custom className correctly', () => {
      const { baseElement } = customRender({
        title: '基础modal',
        open: true,
        className: 'custom-modal'
      });
      expect(baseElement.querySelector('.custom-modal')).toBeInTheDocument();
      expect(
        baseElement.querySelector('.basic-modal-wrapper')
      ).toBeInTheDocument();
    });
  });

  describe('content rendering', () => {
    it('should render children content correctly', () => {
      customRender({
        title: '基础modal',
        open: true,
        children: <div data-testid="modal-content">测试内容</div>
      });
      expect(screen.getByTestId('modal-content')).toHaveTextContent('测试内容');
    });
  });
});
