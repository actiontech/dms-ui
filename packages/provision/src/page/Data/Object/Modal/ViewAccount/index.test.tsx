import ViewAccount from '.';
import { act, screen, cleanup, fireEvent } from '@testing-library/react';
import { ModalName } from '~/data/enum';
import {
  DataObjectModalStatus,
  DataObjectSelectedData
} from '~/store/data/object';
import { superRender } from '~/testUtil/customRender';
import { authorizationList } from '~/testUtil/mockApi/auth/data';
import RecoilObservable from '~/testUtil/RecoilObservable';
import auth from '~/testUtil/mockApi/auth';

describe('ViewAccount Modal', () => {
  const customRender = (defaultVisible = true) => {
    return superRender(
      <ViewAccount />,
      {},
      {
        recoilRootProps: {
          initializeState: ({ set }) => {
            set(DataObjectModalStatus, {
              [ModalName.ViewAccount]: defaultVisible
            });
            set(
              DataObjectSelectedData,
              defaultVisible ? authorizationList[0] : {}
            );
          }
        }
      }
    );
  };
  let getUsersFromDBServiceSpy: jest.SpyInstance;

  beforeEach(() => {
    getUsersFromDBServiceSpy = auth.getUsersFromDBService();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should match close modal when modal status is false', async () => {
    const { container } = customRender(false);
    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it('should match open modal when modal status is true', async () => {
    const { baseElement } = customRender();
    await screen.findAllByText('数据库账号');
    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot();
  });
  it("should close 'view_account' modal when click close button", async () => {
    const DataObjectModalStatusChangeSpy = jest.fn();
    superRender(
      <>
        <ViewAccount />
        <RecoilObservable
          state={DataObjectModalStatus}
          onChange={DataObjectModalStatusChangeSpy}
        />
      </>,
      {},
      {
        recoilRootProps: {
          initializeState({ set }) {
            set(DataObjectModalStatus, {
              [ModalName.ViewAccount]: true
            });
          }
        }
      }
    );
    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(100));

    expect(DataObjectModalStatusChangeSpy).toBeCalledTimes(1);
    expect(DataObjectModalStatusChangeSpy).nthCalledWith(1, {
      [ModalName.ViewAccount]: false
    });
  });
});
