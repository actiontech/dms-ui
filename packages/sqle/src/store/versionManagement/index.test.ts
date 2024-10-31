import reducers, {
  updateSelectVersionStageId,
  updateSelectVersionStageWorkflowList,
  updateSelectWorkflowId
} from '.';
import { IReduxState } from '..';

describe('store/versionManagement', () => {
  test('should create action', () => {
    expect(
      updateSelectVersionStageId({
        stageId: 1
      })
    ).toEqual({
      payload: {
        stageId: 1
      },
      type: 'versionManagement/updateSelectVersionStageId'
    });

    expect(
      updateSelectVersionStageWorkflowList({
        workflowList: [
          {
            workflow_id: '1'
          }
        ]
      })
    ).toEqual({
      payload: {
        workflowList: [
          {
            workflow_id: '1'
          }
        ]
      },
      type: 'versionManagement/updateSelectVersionStageWorkflowList'
    });

    expect(
      updateSelectWorkflowId({
        workflowId: '1'
      })
    ).toEqual({
      payload: {
        workflowId: '1'
      },
      type: 'versionManagement/updateSelectWorkflowId'
    });
  });

  const state: IReduxState['versionManagement'] = {
    modalStatus: {},
    stageId: null,
    workflowId: null,
    currentStageWorkflowList: null
  };

  test('should update stage id when dispatch updateSelectVersionStageId action', () => {
    const newState = reducers(
      state,
      updateSelectVersionStageId({
        stageId: 1
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      ...state,
      stageId: 1
    });
  });

  test('should update stage id when dispatch updateSelectWorkflowId action', () => {
    const newState = reducers(
      state,
      updateSelectWorkflowId({
        workflowId: '1'
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      ...state,
      workflowId: '1'
    });
  });

  test('should update workflow list when dispatch updateSelectVersionStageWorkflowList action', () => {
    const newState = reducers(
      state,
      updateSelectVersionStageWorkflowList({
        workflowList: [
          {
            workflow_id: '1'
          }
        ]
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      ...state,
      currentStageWorkflowList: [
        {
          workflow_id: '1'
        }
      ]
    });
  });
});
