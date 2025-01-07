import TestDatabaseConnectButton from './TestDatabaseConnectButton';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../testUtil/customRender';
import { TestDatabaseConnectButtonProps } from './TestDatabaseConnectButton.types';

describe('TestDatabaseConnectButton', () => {
  const buttonText = '测试数据源连通性';

  const customRender = (params: TestDatabaseConnectButtonProps) => {
    return renderWithTheme(<TestDatabaseConnectButton {...params} />);
  };

  describe('uncontrolled mode', () => {
    test('should render message by initHide', () => {
      const { container } = customRender({
        onClickTestButton: jest.fn,
        loading: true,
        connectAble: true
      });
      expect(container).toMatchSnapshot();

      const { container: container1 } = customRender({
        onClickTestButton: jest.fn,
        loading: false,
        connectAble: true
      });

      expect(container1).toMatchSnapshot();
    });

    test('should show connect result when click the test button', () => {
      const handleClickButton = jest.fn();
      customRender({
        onClickTestButton: handleClickButton,
        loading: true,
        connectAble: true
      });
      fireEvent.click(screen.getByText(buttonText));
      expect(handleClickButton).not.toHaveBeenCalled();

      const { container: container1 } = customRender({
        onClickTestButton: handleClickButton,
        loading: false,
        connectAble: true
      });
      expect(container1).toMatchSnapshot();
      fireEvent.click(screen.getAllByText(buttonText)[1]);
      expect(handleClickButton).toHaveBeenCalledTimes(1);
      expect(container1).toMatchSnapshot();

      handleClickButton.mockClear();
      cleanup();

      const { container: disableContainer } = customRender({
        onClickTestButton: handleClickButton,
        loading: false,
        connectAble: true,
        connectDisableReason: 'disable reason'
      });

      expect(disableContainer).toMatchSnapshot();
      fireEvent.click(screen.getByText(buttonText));
      expect(handleClickButton).toHaveBeenCalledTimes(1);
      expect(disableContainer).toMatchSnapshot();
    });
  });

  describe('controlled mode', () => {
    test('should render message by initHide', () => {
      const { container } = customRender({
        onClickTestButton: jest.fn,
        initHide: true,
        loading: false,
        connectAble: false
      });
      expect(container).toMatchSnapshot();

      const { container: container1 } = customRender({
        onClickTestButton: jest.fn,
        initHide: true,
        loading: true,
        connectAble: false
      });
      expect(container1).toMatchSnapshot();

      const { container: container2 } = customRender({
        onClickTestButton: jest.fn,
        initHide: false,
        loading: true,
        connectAble: false,
        connectDisableReason: 'disable reason'
      });
      expect(container2).toMatchSnapshot();

      const { container: container3 } = customRender({
        onClickTestButton: jest.fn,
        initHide: false,
        loading: false,
        connectAble: true,
        connectDisableReason: 'disable reason'
      });
      expect(container3).toMatchSnapshot();

      const { container: container4 } = customRender({
        onClickTestButton: jest.fn,
        initHide: false,
        loading: false,
        connectAble: false,
        connectDisableReason: 'disable reason'
      });
      expect(container4).toMatchSnapshot();
    });

    test('should call onClickTestButton when click the test button', () => {
      const handleClickTestButton = jest.fn();
      const { container } = renderWithTheme(
        <TestDatabaseConnectButton
          onClickTestButton={handleClickTestButton}
          initHide={true}
          loading={false}
          connectAble={false}
          connectDisableReason="disable reason"
        />
      );
      expect(container).toMatchSnapshot();
      fireEvent.click(screen.getByText(buttonText));
      expect(handleClickTestButton).toHaveBeenCalledTimes(1);
      expect(container).toMatchSnapshot();
    });
  });
});
