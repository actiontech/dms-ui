import CompanyNoticeModal from '.';
import { useDispatch, useSelector } from 'react-redux';

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import dms from '../../../../../../testUtils/mockApi/global';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { ModalName } from '../../../../../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('base/page/Nav/SideMenu/UserMenu/CompanyNoticeModal', () => {
  let requestGetCompanyNotice: jest.SpyInstance;
  let requestUpdateCompanyNotice: jest.SpyInstance;
  const scopeDispatch = jest.fn();
  const customRender = () => {
    return superRender(<CompanyNoticeModal />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestGetCompanyNotice = dms.getCompanyNotice();
    requestUpdateCompanyNotice = dms.updateCompanyNotice();
    mockUseCurrentUser();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        nav: {
          modalStatus: {
            [ModalName.Company_Notice]: true
          }
        }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => scopeDispatch);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap when visible is true', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();
    expect(requestGetCompanyNotice).toHaveBeenCalled();

    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(scopeDispatch).toHaveBeenCalled();
    expect(scopeDispatch).toHaveBeenNthCalledWith(1, {
      type: 'nav/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Company_Notice]: false
        }
      }
    });
    expect(scopeDispatch).toHaveBeenNthCalledWith(2, {
      type: 'nav/updateModalStatus',
      payload: {
        modalName: ModalName.Company_Notice,
        status: false
      }
    });
  });

  describe('render snap when edit notice', () => {
    it('click cancel btn', async () => {
      const { baseElement } = customRender();

      expect(screen.getByText('编 辑')).toBeInTheDocument();
      fireEvent.click(screen.getByText('编 辑'));
      await act(async () => jest.advanceTimersByTime(500));

      const inputEle = getBySelector('textarea.ant-input', baseElement);
      fireEvent.change(inputEle, {
        target: {
          value: '这是一条公告信息'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(screen.getByText('取 消'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      expect(scopeDispatch).toHaveBeenCalledWith({
        payload: { modalStatus: { [ModalName.Company_Notice]: false } },
        type: 'nav/initModalStatus'
      });
    });

    it('click submit btn', async () => {
      const { baseElement } = customRender();

      fireEvent.click(screen.getByText('编 辑'));
      await act(async () => jest.advanceTimersByTime(500));

      const inputEle = getBySelector('textarea.ant-input', baseElement);
      fireEvent.change(inputEle, {
        target: {
          value: '公告信息'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestUpdateCompanyNotice).toHaveBeenCalled();
      expect(requestUpdateCompanyNotice).toHaveBeenCalledWith({
        company_notice: { notice_str: '公告信息' }
      });
      expect(screen.getByText('成功发布系统公告!')).toBeInTheDocument();
      expect(scopeDispatch).toHaveBeenCalledWith({
        payload: { modalStatus: { [ModalName.Company_Notice]: false } },
        type: 'nav/initModalStatus'
      });
    });
  });

  describe('render current user is not admin', () => {
    beforeEach(() => {
      mockUseCurrentUser({ isAdmin: false });
    });

    it('render snap when visible is true', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(baseElement).toMatchSnapshot();
      expect(requestGetCompanyNotice).toHaveBeenCalled();

      fireEvent.click(screen.getByText('关 闭'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(scopeDispatch).toHaveBeenCalled();
      expect(scopeDispatch).toHaveBeenNthCalledWith(1, {
        type: 'nav/initModalStatus',
        payload: {
          modalStatus: {
            [ModalName.Company_Notice]: false
          }
        }
      });
      expect(scopeDispatch).toHaveBeenNthCalledWith(2, {
        type: 'nav/updateModalStatus',
        payload: {
          modalName: ModalName.Company_Notice,
          status: false
        }
      });
    });
  });
});
