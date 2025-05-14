import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { baseSuperRender } from '../../../../../testUtils/superRender';
import account from '../../../../../testUtils/mockApi/account';
import GenerateTokenModal from '../GenerateTokenModal';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('test GenerateTokenModal', () => {
  let genAccessTokenSpy: jest.SpyInstance;
  beforeEach(() => {
    genAccessTokenSpy = account.GenAccessToken();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const onCloseSpy = jest.fn();
  const refreshSpy = jest.fn();

  const customRender = (open = true) => {
    return baseSuperRender(
      <GenerateTokenModal
        open={open}
        onClose={onCloseSpy}
        refresh={refreshSpy}
      />
    );
  };

  it('should match snapshot', () => {
    expect(customRender(false).container).toMatchSnapshot();

    cleanup();

    expect(customRender().container).toMatchSnapshot();
  });

  it('should called request when clicked submit button', async () => {
    customRender();

    fireEvent.change(getBySelector('#expirationDays'), {
      target: { value: -1 }
    });

    await act(async () => {
      fireEvent.blur(getBySelector('#expirationDays'));
    });

    expect(getBySelector('#expirationDays')).toHaveValue('1');

    fireEvent.change(getBySelector('#expirationDays'), {
      target: { value: 10.2 }
    });

    await act(async () => {
      fireEvent.blur(getBySelector('#expirationDays'));
    });

    expect(getBySelector('#expirationDays')).toHaveValue('10');

    fireEvent.change(getBySelector('#expirationDays'), {
      target: { value: 10.6 }
    });

    await act(async () => {
      fireEvent.blur(getBySelector('#expirationDays'));
    });

    expect(getBySelector('#expirationDays')).toHaveValue('10');

    fireEvent.click(screen.getByText('提 交'));

    await act(async () => {
      jest.advanceTimersByTime(0);
    });

    expect(genAccessTokenSpy).toHaveBeenCalledTimes(1);
    expect(genAccessTokenSpy).toHaveBeenCalledWith({
      expiration_days: '10'
    });

    expect(screen.getByText('关 闭').closest('button')).toBeDisabled();
    expect(screen.getByText('提 交').closest('button')).toHaveClass(
      'ant-btn-loading'
    );

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.getByText('关 闭').closest('button')).not.toBeDisabled();
    expect(screen.getByText('提 交').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );

    expect(getBySelector('#expirationDays')).toHaveValue('');
    expect(onCloseSpy).toHaveBeenCalledTimes(1);
    expect(refreshSpy).toHaveBeenCalledTimes(1);
  });
});
