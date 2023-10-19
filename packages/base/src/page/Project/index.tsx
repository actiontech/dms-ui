import { BasicButton, PageHeader } from '@actiontech/shared';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { Space } from 'antd5';
import { useTranslation } from 'react-i18next';
import EventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import ProjectList from './List';
import { useDispatch } from 'react-redux';
import { updateProjectModalStatus } from '../../store/project';
import { ModalName } from '../../data/ModalName';
import ProjectManageModal from './Modal';
import { ProjectListStyledWrapper } from './style';

const Project: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const refreshTable = () => {
    EventEmitter.emit(EmitterKey.DMS_Refresh_Project_List);
  };

  const createProject = () => {
    dispatch(
      updateProjectModalStatus({
        modalName: ModalName.DMS_Add_Project,
        status: true
      })
    );
  };

  return (
    <ProjectListStyledWrapper>
      <PageHeader
        title={
          <Space size={12}>
            {t('dmsProject.projectList.title')}
            <TableRefreshButton refresh={refreshTable} />
          </Space>
        }
        extra={
          <BasicButton type="primary" onClick={createProject}>
            {t('dmsProject.createProject.modalTitle')}
          </BasicButton>
        }
      />
      <ProjectList />
      <ProjectManageModal />
    </ProjectListStyledWrapper>
  );
};

export default Project;
