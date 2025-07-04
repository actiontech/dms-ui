import ProjectTitle from '.';
import { useNavigate } from 'react-router-dom';

import { cleanup, fireEvent, screen, act } from '@testing-library/react';
import { mockSystemConfig } from '../../../../testUtils/mockHooks/mockSystemConfig';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('base/page/Nav/SideMenu/ProjectTitle', () => {
  const navigateSpy = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    mockSystemConfig();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap', async () => {
    const { baseElement } = superRender(<ProjectTitle />);
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('SQLE')).toBeInTheDocument();
    fireEvent.click(screen.getByText('SQLE'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/');
  });
});
