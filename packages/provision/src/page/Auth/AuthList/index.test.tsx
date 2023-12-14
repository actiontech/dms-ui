import { useNavigate } from 'react-router-dom';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';

import auth from '../../../testUtil/mockApi/auth';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

import AuthList from '.';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/Auth/AuthList', () => {
  const navigateSpy = jest.fn();

  const customRender = () => {
    return superRender(<AuthList />);
  };

  beforeEach(() => {
    mockUseCurrentProject();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    auth.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', () => {
    const { baseElement } = customRender();

    expect(screen.getByText('授权清单')).toBeInTheDocument();
    expect(screen.getByText('授 权')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render click auth btn when has auth', async () => {
    customRender();

    const authBtnText = '授 权';
    expect(screen.getByText(authBtnText)).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText(authBtnText));
      await jest.advanceTimersByTime(300);
      expect(navigateSpy).toBeCalledTimes(1);
      expect(navigateSpy).toBeCalledWith(
        `/provision/project/${mockProjectInfo.projectID}/auth/list/add`
      );
    });
  });
});
