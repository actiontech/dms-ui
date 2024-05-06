import reducers, { updateSelectProject } from '.';
import { IReduxState } from '..';
import { mockProjectList } from '../../testUtils/mockApi/project/data';

describe('store/project', () => {
  const state: IReduxState['project'] = {
    selectProject: null,
    modalStatus: {}
  };

  it('should create action', () => {
    expect(updateSelectProject({ selectProject: mockProjectList[0] })).toEqual({
      type: 'project/updateSelectProject',
      payload: {
        selectProject: mockProjectList[0]
      }
    });
  });

  it('should update select project when dispatch updateSelectProject action', () => {
    const newState = reducers(
      state,
      updateSelectProject({
        selectProject: mockProjectList[0]
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      selectProject: mockProjectList[0],
      modalStatus: {}
    });
  });
});
