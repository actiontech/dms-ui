import AvailabilityZoneModal from '../index';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
    useSelector: jest.fn()
  };
});

describe('base/AvailabilityZoneModal', () => {
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        availabilityZone: {
          modalStatus: {
            [ModalName.DMS_Create_Availability_zone]: false,
            [ModalName.DMS_Update_Availability_zone]: false
          }
        }
      });
    });
  });
  it('should render', () => {
    const { container } = superRender(<AvailabilityZoneModal />);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'availabilityZone/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.DMS_Create_Availability_zone]: false,
          [ModalName.DMS_Update_Availability_zone]: false
        }
      }
    });
    expect(container).toMatchSnapshot();
  });
});
