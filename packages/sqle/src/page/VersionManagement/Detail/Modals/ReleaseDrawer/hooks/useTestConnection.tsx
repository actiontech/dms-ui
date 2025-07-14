import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  TargetReleaseInstanceType,
  TargetReleaseWorkflowType
} from '../../../index.type';
import { useRequest } from 'ahooks';
import { IBatchCheckInstanceIsConnectableByNameParams } from '@actiontech/shared/lib/api/sqle/service/instance/index.d';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useMemo, useCallback } from 'react';
import { EmptyBox, ReminderInformation } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';

const useTestConnection = (releaseWorkflows: TargetReleaseWorkflowType[]) => {
  const { projectName } = useCurrentProject();

  const { t } = useTranslation();

  const instanceNames = useMemo(() => {
    return releaseWorkflows?.reduce(
      (prev: Array<{ name: string }>, next: TargetReleaseWorkflowType) => {
        return prev.concat(
          next.target_release_instances
            ?.filter((i: TargetReleaseInstanceType) => !!i.target_instance_name)
            ?.map((i) => ({
              name: i.target_instance_name!
            })) ?? []
        );
      },
      []
    );
  }, [releaseWorkflows]);

  const {
    data: connectionInfo,
    loading: getConnectionInfoLoading,
    run: getConnectionInfo,
    mutate: setConnectionInfo
  } = useRequest(
    () => {
      const params: IBatchCheckInstanceIsConnectableByNameParams = {
        instances: instanceNames,
        project_name: projectName
      };

      return instance
        .batchCheckInstanceIsConnectableByName(params)
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
        });
    },
    { manual: true }
  );

  const renderTestDatabasesConnectInfo = useCallback(
    (name?: string) => {
      const result = connectionInfo?.find((v) => v.instance_name === name);
      if (!result) {
        return null;
      }

      return (
        <>
          <EmptyBox if={!!result.is_instance_connectable}>
            <ReminderInformation
              status="success"
              message={t('common.testDatabaseConnectButton.testSuccess')}
            />
          </EmptyBox>
          <EmptyBox
            if={
              !result.is_instance_connectable && !!result.connect_error_message
            }
          >
            <ReminderInformation
              status="error"
              message={result.connect_error_message ?? t('common.unknownError')}
            />
          </EmptyBox>
        </>
      );
    },
    [t, connectionInfo]
  );

  const clearConnectionInfo = useCallback(() => {
    setConnectionInfo(undefined);
  }, [setConnectionInfo]);

  return {
    renderTestDatabasesConnectInfo,
    getConnectionInfoLoading,
    getConnectionInfo,
    testConnectionAble: !!instanceNames?.length,
    clearConnectionInfo
  };
};

export default useTestConnection;
