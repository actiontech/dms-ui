import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import NotFoundRecentlyProject from '..';
import { baseSuperRender } from '../../../../../testUtils/superRender';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { act, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { useNavigate } from 'react-router-dom';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('test base/page/project/detail/notFoundRecentlyProject', () => {
  const updateRecentlyProjectSpy = jest.fn();
  const customRender = (currentProjectID?: string) => {
    return baseSuperRender(
      <NotFoundRecentlyProject
        updateRecentlyProject={updateRecentlyProjectSpy}
        currentProjectID={currentProjectID}
      />,
      undefined,
      {
        routerProps: { initialEntries: ['/sqle/project//overview'] }
      }
    );
  };
  const navigateSpy = jest.fn();

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match snapshot', async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();

    fireEvent.mouseDown(getBySelector('.custom-project-selector'), baseElement);
    await act(async () => jest.advanceTimersByTime(0));

    expect(baseElement).toMatchSnapshot();
  });

  it('should execute "navigate" when clicked cancel button', () => {
    const { baseElement } = customRender();
    expect(navigateSpy).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText('取 消'));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(-1);

    expect(baseElement).toMatchSnapshot();
  });

  it('should execute "navigate" when clicked ok button', async () => {
    const { baseElement } = customRender();
    expect(navigateSpy).toHaveBeenCalledTimes(0);

    expect(screen.getByText('确 认').closest('button')).toBeDisabled();

    fireEvent.mouseDown(getBySelector('.ant-select-selector'), baseElement);
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(
      screen.getAllByText(mockCurrentUserReturn.bindProjects[0].project_name)[0]
    );
    expect(screen.getByText('确 认').closest('button')).not.toBeDisabled();

    fireEvent.click(screen.getByText('确 认'));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${mockCurrentUserReturn.bindProjects[0].project_id}/overview`,
      { replace: true }
    );

    expect(updateRecentlyProjectSpy).toHaveBeenCalledTimes(1);
    expect(updateRecentlyProjectSpy).toHaveBeenCalledWith(
      mockCurrentUserReturn.bindProjects[0].project_id,
      mockCurrentUserReturn.bindProjects[0].project_name
    );
  });
});
