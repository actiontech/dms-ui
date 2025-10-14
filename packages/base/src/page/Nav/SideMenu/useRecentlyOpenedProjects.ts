import { LocalStorageWrapper } from '@actiontech/dms-kit';
import { StorageKey } from '@actiontech/dms-kit';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import { cloneDeep, remove } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { RecentlyProjectsRecordType } from './ProjectSelector/index.type';
import { IGetUser } from '@actiontech/shared/lib/api/base/service/common';

export const DEFAULT_MAX_SHOW_PROJECT_NUMBER = 3;

const useRecentlyOpenedProjects = () => {
  const { bindProjects, username } = useCurrentUser();

  const [recentlyProjectsRecord, setRecentlyProjectsRecord] =
    useState<RecentlyProjectsRecordType>(() => {
      const data = LocalStorageWrapper.get(StorageKey.DMS_Project_Catch);
      try {
        return JSON.parse(data || '{}');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return {};
      }
    });

  const recentlyProjects = useMemo(() => {
    const localData = recentlyProjectsRecord[username] ?? [];
    return localData.filter((v) =>
      bindProjects.some((project) => project.project_id === v.project_id)
    );
  }, [bindProjects, recentlyProjectsRecord, username]);

  const [projectID, setProjectID] = useState<string | undefined>(() => {
    return recentlyProjects?.[0]?.project_id;
  });

  const updateRecentlyProject = useCallback(
    (id: string, name: string) => {
      if (!bindProjects.some((v) => v.project_id === id)) {
        return;
      }

      EventEmitter.emit(EmitterKey.Update_Current_Project_ID, id);

      const temp = cloneDeep(recentlyProjectsRecord[username] ?? []);

      if (temp.some((v) => v.project_id === id)) {
        remove(temp, (v) => v.project_id === id);
      }

      temp.unshift({ project_id: id, project_name: name });

      if (temp.length > DEFAULT_MAX_SHOW_PROJECT_NUMBER) {
        temp.pop();
      }

      const realRecord = {
        ...recentlyProjectsRecord,
        [username]: temp
      };

      EventEmitter.emit(EmitterKey.Update_Recently_Opened_Projects, realRecord);
      LocalStorageWrapper.set(
        StorageKey.DMS_Project_Catch,
        JSON.stringify(realRecord)
      );
    },
    [bindProjects, recentlyProjectsRecord, username]
  );

  useEffect(() => {
    setProjectID(recentlyProjects[0]?.project_id);
  }, [recentlyProjects]);

  const getRecentlyProjectIdByUserInfo = useCallback((userInfo?: IGetUser) => {
    if (!userInfo) {
      return;
    }
    const data = LocalStorageWrapper.get(StorageKey.DMS_Project_Catch);
    try {
      const memorizedProjects: RecentlyProjectsRecordType = JSON.parse(
        data || '{}'
      );
      const localData = memorizedProjects[userInfo.name ?? ''] ?? [];
      return localData.filter((v) =>
        userInfo.user_bind_projects?.some((p) => p.project_id === v.project_id)
      )?.[0]?.project_id;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return undefined;
    }
  }, []);

  const getRecentlyProjectId = useCallback(() => {
    const data = LocalStorageWrapper.get(StorageKey.DMS_Project_Catch);
    try {
      const memorizedProjects: RecentlyProjectsRecordType = JSON.parse(
        data || '{}'
      );
      const localData = memorizedProjects[username] ?? [];
      return localData.filter((v) =>
        bindProjects.some((p) => p.project_id === v.project_id)
      )?.[0]?.project_id;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [bindProjects, username]);

  useEffect(() => {
    const updateRecentlyProjectsRecord = (
      value: RecentlyProjectsRecordType
    ) => {
      setRecentlyProjectsRecord(value);
    };
    const updateCurrentProjectID = (id: string) => {
      setProjectID(id);
    };
    EventEmitter.subscribe(
      EmitterKey.Update_Recently_Opened_Projects,
      updateRecentlyProjectsRecord
    );

    EventEmitter.subscribe(
      EmitterKey.Update_Current_Project_ID,
      updateCurrentProjectID
    );

    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Update_Recently_Opened_Projects,
        updateRecentlyProjectsRecord
      );
      EventEmitter.unsubscribe(
        EmitterKey.Update_Current_Project_ID,
        updateCurrentProjectID
      );
    };
  }, []);

  return {
    recentlyProjects,
    updateRecentlyProject,
    currentProjectID: projectID,
    getRecentlyProjectId,
    getRecentlyProjectIdByUserInfo
  };
};

export default useRecentlyOpenedProjects;
