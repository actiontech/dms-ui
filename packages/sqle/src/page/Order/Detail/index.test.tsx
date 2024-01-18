import OrderDetail from '.';

import { useParams } from 'react-router-dom';
import { act, cleanup } from '@testing-library/react';
import { superRender } from '../../../testUtils/customRender';

import order from '../../../testUtils/mockApi/order';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';


jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

describe('sqle/Order/Detail', () => {
  let requestTaskInfo: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  const customRender = () => {
    return superRender(<OrderDetail />);
  }

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockUseCurrentProject();
    order.mockAllApi();
    requestTaskInfo = order.getWorkflow();
    useParamsMock.mockReturnValue({ orderId: 'orderId' });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap detail', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();
    expect(requestTaskInfo).toBeCalled();
    expect(requestTaskInfo).toBeCalledWith({
      project_name: 'default',
      workflow_id: 'orderId'
    });
  })
})
