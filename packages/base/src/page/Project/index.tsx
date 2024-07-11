import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { Space, message } from 'antd';
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
import { useNavigate } from 'react-router-dom';
import ProjectApi from '@actiontech/shared/lib/api/base/service/Project';
import { useBoolean } from 'ahooks';

const Project: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const [exportLoading, { setTrue: exportPending, setFalse: exportFinish }] =
    useBoolean();

  const { isAdmin, managementPermissions } = useCurrentUser();
  const dispatch = useDispatch();

  const allowCreateProject = useMemo(() => {
    return (
      isAdmin ||
      managementPermissions.some(
        (v) => OpPermissionTypeUid['project_admin'] === (v?.uid ?? '')
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

  const onExport = () => {
    exportPending();
    const hideLoading = messageApi.loading(
      t('dmsProject.projectList.exportMessage'),
      0
    );
    ProjectApi.ExportProjects({}, { responseType: 'blob' }).finally(() => {
      exportFinish();
      hideLoading();
    });
  };

  const onImport = () => {
    navigate('/project/import');
  };

  const onBatchImportDataSource = () => {
    navigate('/project/batch-import');
  };

  return (
    <section>
      {contextHolder}
      <PageHeader
        title={
          <Space size={12}>
            {t('dmsProject.projectList.title')}
            <TableRefreshButton refresh={refreshTable} />
          </Space>
        }
        extra={
          <Space>
            <EmptyBox if={isAdmin}>
              <BasicButton onClick={onBatchImportDataSource}>
                {t('dmsProject.batchImportDataSource.buttonText')}
              </BasicButton>
            </EmptyBox>
            <EmptyBox if={allowCreateProject}>
              <Space>
                <BasicButton onClick={onExport} loading={exportLoading}>
                  {t('dmsProject.exportProject.buttonText')}
                </BasicButton>
                <BasicButton onClick={onImport}>
                  {t('dmsProject.importProject.buttonText')}
                </BasicButton>
                <BasicButton type="primary" onClick={createProject}>
                  {t('dmsProject.createProject.modalTitle')}
                </BasicButton>
              </Space>
            </EmptyBox>
          </Space>
        }
      />
      <ProjectList />
      <ProjectManageModal />
    </section>
  );
};

export default Project;
