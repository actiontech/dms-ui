import ConnectionDetails from '.';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { ModalName } from '~/data/enum';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import { superRender } from '~/testUtil/customRender';
import { authorizationList } from '~/testUtil/mockApi/auth/data';
import RecoilObservable from '~/testUtil/RecoilObservable';
import auth from '~/testUtil/mockApi/auth';

describe('ConnectionDetails Modal', () => {
  const customRender = (defaultVisible = true) => {
    return superRender(
      <ConnectionDetails />,
      {},
      {
        recoilRootProps: {
          initializeState: ({ set }) => {
            set(AuthListModalStatus, {
              [ModalName.GetConnection]: defaultVisible
            });
            set(AuthListSelectData, defaultVisible ? authorizationList[0] : {});
          }
        }
      }
    );
  };

  let listDBAccountByAuthSpy: jest.SpyInstance;
  let getAuthorizationSpy: jest.SpyInstance;

  beforeEach(() => {
    listDBAccountByAuthSpy = auth.listDBAccountByAuth();
    getAuthorizationSpy = auth.getAuthorization();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  it('should match close modal when modal status is false', async () => {
    const { container } = customRender(false);
    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it('should match open modal when modal status is true', async () => {
    const { baseElement } = customRender();
    expect(getAuthorizationSpy).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(100));
    await screen.findAllByText('全文复制');
    expect(baseElement).toMatchSnapshot();
  });
  it("should close 'Connection_details' modal when click close button", async () => {
    const AuthListModalStatusChangeSpy = jest.fn();
    superRender(
      <>
        <ConnectionDetails />
        <RecoilObservable
          state={AuthListModalStatus}
          onChange={AuthListModalStatusChangeSpy}
        />
      </>,
      {},
      {
        recoilRootProps: {
          initializeState({ set }) {
            set(AuthListModalStatus, {
              [ModalName.GetConnection]: true
            });
          }
        }
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('关 闭'));

    expect(AuthListModalStatusChangeSpy).toBeCalledTimes(1);
    expect(AuthListModalStatusChangeSpy).nthCalledWith(1, {
      [ModalName.GetConnection]: false
    });
  });

  it('should copy text when user click copy button', async () => {
    document.execCommand = jest.fn();
    customRender();
    await screen.findAllByText('全文复制');
    await act(() => fireEvent.click(screen.getByText('全文复制')));

    const successEl = await screen.findByText('复制成功');
    expect(successEl).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('复制成功')).not.toBeInTheDocument();
  });
});
