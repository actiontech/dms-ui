import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
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
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { useMemo } from 'react';
import { OpPermissionItemOpPermissionTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

const Project: React.FC = () => {
  const { t } = useTranslation();
  const { isAdmin, managementPermissions } = useCurrentUser();
  const dispatch = useDispatch();

  const allowCreateProject = useMemo(() => {
    return (
      isAdmin ||
      managementPermissions.some(
        (v) =>
          OpPermissionItemOpPermissionTypeEnum['create_project'] ===
          (v?.name ?? '')
      )
    );
  }, [isAdmin, managementPermissions]);

  const refreshTable = () => {
    EventEmitter.emit(EmitterKey.DMS_Refresh_Project_List);
  };

  const createProject = () => {
    if (!allowCreateProject) return;
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
          <EmptyBox if={allowCreateProject}>
            <BasicButton type="primary" onClick={createProject}>
              {t('dmsProject.createProject.modalTitle')}
            </BasicButton>
          </EmptyBox>
        }
      />
      <ProjectList />
      <ProjectManageModal />
    </ProjectListStyledWrapper>
  );
};

export default Project;
