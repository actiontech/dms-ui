import reducers, { updateSelectProject } from '.';
import { IReduxState } from '..';
import { projectList } from '../../testUtils/mockApi/project/data';

describe('store/project', () => {
  const state: IReduxState['project'] = {
    selectProject: null,
    modalStatus: {}
  };

  it('should create action', () => {
    expect(updateSelectProject({ project: projectList[0] })).toEqual({
      type: 'project/updateSelectProject',
      payload: {
        project: projectList[0]
      }
    });
  });

  it('should update select project when dispatch updateSelectProject action', () => {
    const newState = reducers(
      state,
      updateSelectProject({
        project: projectList[0]
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      selectProject: projectList[0],
      modalStatus: {}
    });
  });
});
