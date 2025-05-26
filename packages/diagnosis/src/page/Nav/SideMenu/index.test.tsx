import SideMenu from '.';
import { diagnosisSuperRender } from '../../../testUtils/superRender';
import { screen, act, fireEvent } from '@testing-library/react';

describe('diagnosis/SideMenu', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should match snapshot', async () => {
    const { baseElement } = diagnosisSuperRender(<SideMenu />);
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Diagnosis')).toBeInTheDocument();
  });

  it('click other menu', async () => {
    const { baseElement } = diagnosisSuperRender(<SideMenu />);
    await act(async () => {
      jest.runOnlyPendingTimers();
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Diagnosis')).toBeInTheDocument();
    expect(screen.getByText('用户管理')).toBeInTheDocument();
    fireEvent.click(screen.getByText('用户管理'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('监控源配置'));
  });
});
