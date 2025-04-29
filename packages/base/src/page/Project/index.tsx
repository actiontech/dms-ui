import { PageHeader } from '@actiontech/shared';
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
import { DmsApi } from '@actiontech/shared/lib/api';
import { useBoolean } from 'ahooks';
import { ProjectManagementPageHeaderActions } from './action';

const Project: React.FC = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const [exportLoading, { setTrue: exportPending, setFalse: exportFinish }] =
    useBoolean();

  const dispatch = useDispatch();

  const refreshTable = () => {
    EventEmitter.emit(EmitterKey.DMS_Refresh_Project_List);
  };

  const onCreateProject = () => {
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
    DmsApi.ProjectService.ExportProjects({}, { responseType: 'blob' }).finally(
      () => {
        exportFinish();
        hideLoading();
      }
    );
  };

  const headerActions = ProjectManagementPageHeaderActions(
    onExport,
    exportLoading,
    onCreateProject
  );

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
            {headerActions.configure_availability_zone}
            {headerActions.global_resource_overview}
            {headerActions.batch_import_data_source}
            {headerActions.export}
            {headerActions.import}
            {headerActions.create}
          </Space>
        }
      />
      <ProjectList />
      <ProjectManageModal />
    </section>
  );
};

export default Project;
