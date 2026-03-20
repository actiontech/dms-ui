import CompanyNoticeModal from '.';
import { useDispatch, useSelector } from 'react-redux';

import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { baseSuperRender } from '../../../../../../testUtils/superRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import dms from '@actiontech/shared/lib/testUtil/mockApi/base/global';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { ModalName } from '../../../../../../data/ModalName';
import { SystemRole } from '@actiontech/dms-kit';
import { CompanyNoticeMockData } from '@actiontech/shared/lib/testUtil/mockApi/base/global/data';

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
    return baseSuperRender(<CompanyNoticeModal />);
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
        },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
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

    expect(requestGetCompanyNotice).toHaveBeenCalledTimes(1);
    expect(requestGetCompanyNotice).toHaveBeenCalledWith({
      include_latest_outside_period: true
    });

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

  it('should display notice content and effective period in view mode', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    expect(
      screen.getByText(CompanyNoticeMockData.notice_str!)
    ).toBeInTheDocument();
    expect(screen.getByText(/有效期/)).toBeInTheDocument();
  });

  describe('render snap when edit notice', () => {
    it('click cancel btn without dirty data', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      expect(screen.getByText('编 辑')).toBeInTheDocument();
      fireEvent.click(screen.getByText('编 辑'));
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(screen.getByText('取 消'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      expect(scopeDispatch).toHaveBeenCalledWith({
        payload: { modalStatus: { [ModalName.Company_Notice]: false } },
        type: 'nav/initModalStatus'
      });
    });

    it('click cancel btn with dirty data and confirm to cancel', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
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
      expect(screen.getByText('确 认')).toBeInTheDocument();
      fireEvent.click(screen.getByText('确 认'));
    });

    it('click submit btn without any data shows validation error', async () => {
      requestGetCompanyNotice.mockImplementation(() =>
        createSpySuccessResponse({ data: { notice_str: undefined } })
      );
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      fireEvent.click(screen.getByText('编 辑'));
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestUpdateCompanyNotice).not.toHaveBeenCalled();
    });

    it('click submit btn with valid content and time range', async () => {
      requestUpdateCompanyNotice.mockClear();
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3300));
      fireEvent.click(screen.getByText('编 辑'));
      await act(async () => jest.advanceTimersByTime(500));

      expect(baseElement).toMatchSnapshot();
      expect(requestGetCompanyNotice).toHaveBeenCalledWith({
        include_latest_outside_period: true
      });

      fireEvent.click(screen.getByText('提 交'));
      // Allow validateFields microtask to resolve and UpdateCompanyNotice timer to register
      await act(async () => jest.advanceTimersByTime(500));
      // Resolve the UpdateCompanyNotice 3000ms timer
      await act(async () => jest.advanceTimersByTime(3000));

      expect(requestUpdateCompanyNotice).toHaveBeenCalledTimes(1);
      expect(requestUpdateCompanyNotice).toHaveBeenCalledWith(
        expect.objectContaining({
          company_notice: expect.objectContaining({
            notice_str: CompanyNoticeMockData.notice_str
          })
        })
      );
      expect(scopeDispatch).toHaveBeenCalledWith({
        payload: {
          modalName: ModalName.Company_Notice,
          status: false
        },
        type: 'nav/updateModalStatus'
      });
    });
  });

  describe('render current user is not admin and global manager', () => {
    beforeEach(() => {
      mockUseCurrentUser({
        userRoles: {
          [SystemRole.admin]: false,
          [SystemRole.systemAdministrator]: false,
          [SystemRole.auditAdministrator]: false,
          [SystemRole.certainProjectManager]: false,
          [SystemRole.projectDirector]: false
        }
      });
    });

    it('render snap when visible is true - no edit button', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(baseElement).toMatchSnapshot();
      expect(requestGetCompanyNotice).toHaveBeenCalledTimes(1);
      expect(requestGetCompanyNotice).toHaveBeenCalledWith({
        include_latest_outside_period: true
      });

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
