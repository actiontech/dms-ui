import { superRender } from '../../testUtils/customRender';
import Overview from '.';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import EmitterKey from '../../data/EmitterKey';
import eventEmitter from '../../utils/EventEmitter';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('page/ProjectOverview', () => {
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = () => {
    return superRender(<Overview />);
  };

  it('render over view and refresh page', async () => {
    const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('项目概览')).toBeInTheDocument();
    fireEvent.click(getBySelector('.refresh-icon'));
    expect(eventEmitSpy).toHaveBeenCalled();
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Project_Overview
    );
  });
});
