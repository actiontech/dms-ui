import { act, fireEvent, screen } from '@testing-library/react';
import NotFoundProject from '.';
import { superRender } from '../../../../../testUtils/customRender';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ignoreComponentCustomAttr } from '@actiontech/shared/lib/testUtil/common';
import { useNavigate } from 'react-router-dom';
import { RuleUrlParamKey } from '@actiontech/shared/lib/types/common.type';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('test base/home/NotFoundProject', () => {
  const setOpenSpy = jest.fn();
  const updateRecentlyProjectSpy = jest.fn();
  const navigateSpy = jest.fn();

  ignoreComponentCustomAttr();
  beforeEach(() => {
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const customRender = (open = true) => {
    return superRender(
      <NotFoundProject
        open={open}
        setOpen={setOpenSpy}
        bindProjects={mockCurrentUserReturn.bindProjects}
        updateRecentlyProject={updateRecentlyProjectSpy}
      />
    );
  };

  it('should match snapshot when open props is equal false', () => {
    const { baseElement } = customRender(false);
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot', async () => {
    const { baseElement } = customRender();

    fireEvent.mouseDown(getBySelector('.ant-select-selector'), baseElement);
    await act(async () => jest.advanceTimersByTime(0));

    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when clicked cancel button', () => {
    const { baseElement } = customRender();
    fireEvent.click(screen.getByText('取 消'));
    expect(setOpenSpy).toBeCalledTimes(1);
    expect(setOpenSpy).toBeCalledWith(false);
    expect(baseElement).toMatchSnapshot();
  });

  it('should execute "navigate" when clicked ok button', async () => {
    const { baseElement } = customRender();
    expect(navigateSpy).toBeCalledTimes(0);

    expect(screen.getByText('确 认').closest('button')).toBeDisabled();

    fireEvent.mouseDown(getBySelector('.ant-select-selector'), baseElement);
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(
      screen.getAllByText(mockCurrentUserReturn.bindProjects[0].project_name)[0]
    );
    expect(screen.getByText('确 认').closest('button')).not.toBeDisabled();

    fireEvent.click(screen.getByText('确 认'));
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).toBeCalledWith(
      `/sqle/rule?${RuleUrlParamKey.projectID}=${mockCurrentUserReturn.bindProjects[0].project_id}`,
      { replace: true }
    );

    expect(updateRecentlyProjectSpy).toBeCalledTimes(1);
    expect(updateRecentlyProjectSpy).toBeCalledWith(
      mockCurrentUserReturn.bindProjects[0].project_id,
      mockCurrentUserReturn.bindProjects[0].project_name
    );
  });
});
