import { IReduxState } from '../..';
import reducers, {
  updateSelectAvailabilityZone,
  updateAvailabilityZoneTips
} from '..';

describe('store/availabilityZone', () => {
  const state: IReduxState['availabilityZone'] = {
    modalStatus: {},
    selectAvailabilityZone: null,
    availabilityZoneTips: []
  };

  it('should execute updateSelectAvailabilityZone', () => {
    const zoneData = {
      gateway_id: '1',
      gateway_name: 'test',
      gateway_address: '127.0.0.1',
      gateway_desc: 'test'
    };

    const newState = reducers(
      state,
      updateSelectAvailabilityZone({
        availabilityZone: zoneData
      })
    );

    expect(newState).toEqual({
      modalStatus: {},
      selectAvailabilityZone: zoneData,
      availabilityZoneTips: []
    });
  });

  it('should execute updateAvailabilityZoneTips', () => {
    const tips = [
      { uid: '1', name: 'test1' },
      { uid: '2', name: 'test2' }
    ];

    const newState = reducers(
      state,
      updateAvailabilityZoneTips({
        availabilityZoneTips: tips
      })
    );

    expect(newState).toEqual({
      modalStatus: {},
      selectAvailabilityZone: null,
      availabilityZoneTips: tips
    });
  });
});
