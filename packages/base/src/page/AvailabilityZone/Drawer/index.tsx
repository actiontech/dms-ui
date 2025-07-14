import CreateAvailabilityZoneDrawer from './Create';
import UpdateAvailabilityZoneDrawer from './Update';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { initAvailabilityZoneModalStatus } from '../../../store/availabilityZone';
import { ModalName } from '../../../data/ModalName';

const AvailabilityZoneDrawer: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initAvailabilityZoneModalStatus({
        modalStatus: {
          [ModalName.DMS_Create_Availability_zone]: false,
          [ModalName.DMS_Update_Availability_zone]: false
        }
      })
    );
  }, [dispatch]);

  return (
    <>
      <CreateAvailabilityZoneDrawer />
      <UpdateAvailabilityZoneDrawer />
    </>
  );
};

export default AvailabilityZoneDrawer;
