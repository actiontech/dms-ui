import CreateAvailabilityZoneModal from './Create';
import UpdateAvailabilityZoneModal from './Update';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { initAvailabilityZoneModalStatus } from '../../../store/availabilityZone';
import { ModalName } from '../../../data/ModalName';

const AvailabilityZoneModal: React.FC = () => {
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
      <CreateAvailabilityZoneModal />
      <UpdateAvailabilityZoneModal />
    </>
  );
};

export default AvailabilityZoneModal;
