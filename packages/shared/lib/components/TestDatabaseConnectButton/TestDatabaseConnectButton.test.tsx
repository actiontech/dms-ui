import TestDatabaseConnectButton from './TestDatabaseConnectButton';
import { fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../testUtil/customRender';
import { TestDatabaseConnectButtonProps } from './TestDatabaseConnectButton.types';

describe('TestDatabaseConnectButton', () => {
  const buttonText = '测试数据源连通性';

  const customRender = (params: TestDatabaseConnectButtonProps) => {
    return superRender(<TestDatabaseConnectButton {...params} />);
  };

  describe('rendering', () => {
    it('should render basic button with correct text', () => {
      const { container } = customRender({
        onClickTestButton: jest.fn(),
        loading: false,
        connectAble: true
      });
      expect(screen.getByText(buttonText)).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });
  });

  describe('uncontrolled mode behavior', () => {
    it('should show success message when connection test succeeds', () => {
      const handleClickButton = jest.fn();
      const { container } = customRender({
        onClickTestButton: handleClickButton,
        loading: false,
        connectAble: true
      });

      fireEvent.click(screen.getByText(buttonText));
      expect(handleClickButton).toHaveBeenCalledTimes(1);
      expect(screen.getByText('数据源连通性测试成功')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

    it('should show error message when connection test fails', () => {
      const handleClickButton = jest.fn();
      const errorMessage = 'disable reason';
      const { container } = customRender({
        onClickTestButton: handleClickButton,
        loading: false,
        connectAble: false,
        connectDisableReason: errorMessage
      });

      fireEvent.click(screen.getByText(buttonText));
      expect(handleClickButton).toHaveBeenCalledTimes(1);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });
  });

  describe('controlled mode behavior', () => {
    it('should respect initHide prop and show loading state', () => {
      const handleClickButton = jest.fn();
      customRender({
        onClickTestButton: handleClickButton,
        initHide: false,
        loading: true,
        connectAble: false
      });

      expect(screen.getByText('正在尝试进行连接...')).toBeInTheDocument();
    });
  });
});
