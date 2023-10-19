import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { initProjectModalStatus } from '../../../store/project';
import AddProject from './AddProject';
import UpdateProject from './UpdateProject';

const ProjectManageModal: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initProjectModalStatus({
        modalStatus: {
          [ModalName.DMS_Add_Project]: false,
          [ModalName.DMS_Update_Project]: false
        }
      })
    );
  }, [dispatch]);

  return (
    <>
      <AddProject />
      <UpdateProject />
    </>
  );
};

export default ProjectManageModal;
