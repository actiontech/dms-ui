import reducers, {
  updateSelectPipelineId,
  updatePipelineNodeTourStatus
} from '.';
import { IReduxState } from '..';
import { BlacklistResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('store/pipeline', () => {
  test('should create action', () => {
    expect(
      updateSelectPipelineId({
        id: 1
      })
    ).toEqual({
      payload: {
        id: 1
      },
      type: 'pipeline/updateSelectPipelineId'
    });

    expect(
      updatePipelineNodeTourStatus({
        show: true
      })
    ).toEqual({
      payload: {
        show: true
      },
      type: 'pipeline/updatePipelineNodeTourStatus'
    });
  });

  const state: IReduxState['pipeline'] = {
    modalStatus: {},
    showPipelineNodeTour: false,
    selectPipelineId: undefined
  };

  test('should update selectPipelineId when dispatch updateSelectPipelineId action', () => {
    const newState = reducers(
      state,
      updateSelectPipelineId({
        id: 1
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      ...state,
      selectPipelineId: 1
    });
  });

  test('should update showPipelineNodeTour when dispatch updatePipelineNodeTourStatus action', () => {
    const newState = reducers(
      state,
      updatePipelineNodeTourStatus({
        show: true
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      ...state,
      showPipelineNodeTour: true
    });
  });
});
