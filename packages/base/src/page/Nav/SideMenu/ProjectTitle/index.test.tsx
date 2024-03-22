import ProjectTitle from '.';
import { useNavigate } from 'react-router-dom';

import { cleanup, fireEvent, screen, act } from '@testing-library/react';
import { mockSystemConfig } from '../../../../testUtils/mockHooks/mockSystemConfig';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

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
    const { baseElement } = renderWithTheme(<ProjectTitle />);
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('DMS')).toBeInTheDocument();
    fireEvent.click(screen.getByText('DMS'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/');
  });
});
