import { cleanup, act } from '@testing-library/react';
import { renderHooksWithTheme } from '../../../../testUtils/customRender';
import useCreateRuleTemplatePermission from '../useCreateRuleTemplatePermission';
import {
  createSpySuccessResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import dms from '@actiontech/shared/lib/api/base/service/dms';

describe('sqle/Rule/hooks/useRuleListFilter', () => {
  let getProjectListSpy: jest.SpyInstance;
  let mockUseCurrentUserSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUserSpy = mockUseCurrentUser();
    getProjectListSpy = jest.spyOn(dms, 'ListProjects');
    getProjectListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        total_nums: 1,
        data: [
          {
            is_manager: true,
            project_name: 'default',
            project_id: '1',
            archived: false
          }
        ]
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should not call getProjectList when projectID is falsy', async () => {
    renderHooksWithTheme(() =>
      useCreateRuleTemplatePermission({
        projectID: '',
        projectName: mockProjectInfo.projectName,
        showNotRuleTemplatePage: true
      })
    );

    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(getProjectListSpy).not.toBeCalled();
  });

  it('should not call getProjectList when showNotRuleTemplatePage is falsy', async () => {
    renderHooksWithTheme(() =>
      useCreateRuleTemplatePermission({
        projectID: mockProjectInfo.projectID,
        projectName: mockProjectInfo.projectName,
        showNotRuleTemplatePage: false
      })
    );

    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(getProjectListSpy).not.toBeCalled();
  });

  it('should set allowCreateRuleTemplate to be true', async () => {
    const { result } = renderHooksWithTheme(() =>
      useCreateRuleTemplatePermission({
        projectID: mockProjectInfo.projectID,
        projectName: mockProjectInfo.projectName,
        showNotRuleTemplatePage: true
      })
    );

    await act(async () => {
      await jest.advanceTimersByTime(3000);
    });
    expect(getProjectListSpy).toBeCalled();
    expect(result.current.allowCreateRuleTemplate).toEqual(true);
  });

  it('should set allowCreateRuleTemplate to be false', async () => {
    mockUseCurrentUserSpy.mockClear();
    mockUseCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      isAdmin: false,
      isProjectManager: jest.fn(() => true)
    }));
    const { result } = renderHooksWithTheme(() =>
      useCreateRuleTemplatePermission({
        projectID: mockProjectInfo.projectID,
        projectName: mockProjectInfo.projectName,
        showNotRuleTemplatePage: true
      })
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.allowCreateRuleTemplate).toEqual(true);

    mockUseCurrentUserSpy.mockClear();
    mockUseCurrentUserSpy.mockImplementation(() => ({
      ...mockCurrentUserReturn,
      isAdmin: false,
      isProjectManager: jest.fn(() => false)
    }));
    const { result: result1 } = renderHooksWithTheme(() =>
      useCreateRuleTemplatePermission({
        projectID: mockProjectInfo.projectID,
        projectName: mockProjectInfo.projectName,
        showNotRuleTemplatePage: true
      })
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(result1.current.allowCreateRuleTemplate).toEqual(false);
  });

  it('should set allowCreateRuleTemplate to be false when response code is not equal success code', async () => {
    getProjectListSpy.mockClear();
    getProjectListSpy.mockImplementation(() => createSpyFailResponse({}));

    const { result } = renderHooksWithTheme(() =>
      useCreateRuleTemplatePermission({
        projectID: mockProjectInfo.projectID,
        projectName: mockProjectInfo.projectName,
        showNotRuleTemplatePage: true
      })
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.allowCreateRuleTemplate).toEqual(false);
  });
});
