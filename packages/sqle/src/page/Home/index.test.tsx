import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import Home from '.';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import home from '../../testUtils/mockApi/home';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('page/Home', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    home.mockAllApi();
    mockUseCurrentProject();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render Home page', () => {
    const request = home.getWorkflows();
    const staticsRequest = home.getDashboard();
    const { baseElement } = superRender(<Home />);
    expect(request).toBeCalled();
    expect(staticsRequest).toBeCalled();
    expect(screen.getByText('工作台')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    expect(getAllBySelector('.ant-btn').length).toBe(3);
    fireEvent.click(getAllBySelector('.ant-btn')?.[0]);
    expect(request).toBeCalled();
    expect(staticsRequest).toBeCalled();
  });
});
