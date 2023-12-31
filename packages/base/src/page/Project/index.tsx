import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import EventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import ProjectList from './List';
import { useDispatch } from 'react-redux';
import { updateProjectModalStatus } from '../../store/project';
import { ModalName } from '../../data/ModalName';
import ProjectManageModal from './Modal';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { useMemo } from 'react';
import { OpPermissionTypeUid } from '@actiontech/shared/lib/enum';

const Project: React.FC = () => {
  const { t } = useTranslation();
  const { isAdmin, managementPermissions } = useCurrentUser();
  const dispatch = useDispatch();

  const allowCreateProject = useMemo(() => {
    return (
      isAdmin ||
      managementPermissions.some(
        (v) => OpPermissionTypeUid['create_project'] === (v?.uid ?? '')
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
    <section>
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
    </section>
  );
};

export default Project;
