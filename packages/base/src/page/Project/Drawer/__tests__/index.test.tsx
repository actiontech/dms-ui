import { cleanup } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { baseSuperRender } from '../../../../testUtils/superRender';
import ProjectManageDrawer from '..';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn()
  };
});

describe('test base/page/Project/Drawer', () => {
  it('should match snapshot', () => {
    const dispatchSpy = jest.fn();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);

    const { baseElement } = baseSuperRender(<ProjectManageDrawer />);
    expect(baseElement).toMatchSnapshot();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      payload: {
        modalStatus: {
          DMS_ADD_PROJECT: false,
          DMS_UPDATE_PROJECT: false
        }
      },
      type: 'project/initModalStatus'
    });

    cleanup();
    jest.clearAllMocks();
  });
});
