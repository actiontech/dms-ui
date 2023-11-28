import { IListProject } from '@actiontech/shared/lib/api/base/service/common';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import {
  IListProjectsReturn,
  IListProjectsParams
} from '@actiontech/shared/lib/api/base/service/dms/index.d';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useCurrentUser, useUserInfo } from '@actiontech/shared/lib/global';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import ProjectListTableColumnFactory, {
  ProjectListActions
} from './tableHeader';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import {
  updateProjectModalStatus,
  updateSelectProject
} from '../../../store/project';
import { ModalName } from '../../../data/ModalName';

const ProjectList: React.FC = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();
  const { isAdmin, isProjectManager } = useCurrentUser();
  const { updateUserInfo } = useUserInfo();

  const allowOperateProject = useCallback(
    (projectName: string) => isAdmin || isProjectManager(projectName),
    [isAdmin, isProjectManager]
  );

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IListProject,
    IListProjectsParams
  >();

  const {
    data: projectListData,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IListProjectsParams = {
        ...pagination
      };
      return handleTableRequestError<IListProjectsReturn>(
        dms.ListProjects(params)
      );
    },
    {
      refreshDeps: [pagination],
      onFinally: () => updateUserInfo()
    }
  );

  const deleteProject = useCallback(
    (record: IListProject) => {
      if (!allowOperateProject(record?.name ?? '')) return;

      const { uid = '', name = '' } = record;
      if (!uid || !name) return;
      dms.DelProject({ project_uid: uid }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.open({
            type: 'success',
            content: t('dmsProject.projectList.deleteSuccessTips', {
              name
            })
          });
          refresh();
        }
      });
    },
    [allowOperateProject, refresh, t, messageApi]
  );

  const archiveProject = useCallback(
    (record: IListProject) => {
      if (!allowOperateProject(record?.name ?? '')) return;

      const { uid = '', name = '' } = record;
      if (!uid || !name) return;
      dms.ArchiveProject({ project_uid: uid }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.open({
            type: 'success',
            content: t('dmsProject.projectList.archiveProjectSuccessTips', {
              name
            })
          });
          refresh();
          EventEmitter.emit(EmitterKey.DMS_Sync_Project_Archived_Status);
        }
      });
    },
    [allowOperateProject, refresh, t, messageApi]
  );

  const unarchiveProject = useCallback(
    (record: IListProject) => {
      if (!allowOperateProject(record?.name ?? '')) return;

      const { uid = '', name = '' } = record;
      if (!uid || !name) return;
      dms.UnarchiveProject({ project_uid: uid }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.open({
            type: 'success',
            content: t('dmsProject.projectList.unarchiveProjectSuccessTips', {
              name
            })
          });
          refresh();
          EventEmitter.emit(EmitterKey.DMS_Sync_Project_Archived_Status);
        }
      });
    },
    [allowOperateProject, refresh, t, messageApi]
  );

  const updateProject = useCallback(
    (record: IListProject) => {
      if (!allowOperateProject(record?.name ?? '')) return;

      dispatch(
        updateProjectModalStatus({
          modalName: ModalName.DMS_Update_Project,
          status: true
        })
      );
      dispatch(updateSelectProject({ project: record }));
    },
    [allowOperateProject, dispatch]
  );

  const columns = useMemo(() => {
    return ProjectListTableColumnFactory();
  }, []);

  const actions = useMemo(() => {
    return ProjectListActions(
      deleteProject,
      updateProject,
      archiveProject,
      unarchiveProject,
      allowOperateProject
    );
  }, [
    deleteProject,
    updateProject,
    archiveProject,
    unarchiveProject,
    allowOperateProject
  ]);

  useEffect(() => {
    EventEmitter.subscribe(EmitterKey.DMS_Refresh_Project_List, refresh);

    return () => {
      EventEmitter.unsubscribe(EmitterKey.DMS_Refresh_Project_List, refresh);
    };
  }, [refresh]);

  return (
    <>
      {contextHolder}
      <ActiontechTable
        dataSource={projectListData?.list}
        pagination={{
          total: projectListData?.total ?? 0
        }}
        rowKey="uid"
        loading={loading}
        columns={columns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={actions}
      />
    </>
  );
};

export default ProjectList;
