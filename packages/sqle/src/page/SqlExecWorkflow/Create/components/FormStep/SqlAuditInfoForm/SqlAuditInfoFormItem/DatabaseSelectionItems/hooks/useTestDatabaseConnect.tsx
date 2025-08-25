import { ReminderInformation, EmptyBox } from '@actiontech/dms-kit';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { ResponseCode } from '@actiontech/dms-kit';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useBoolean } from 'ahooks';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DatabaseSelectionItemProps } from '../../../index.type';
import { IBatchCheckInstanceIsConnectableByNameParams } from '@actiontech/shared/lib/api/sqle/service/instance/index.d';
import { DatabaseSelectionFields } from '../index.type';
const useTestDatabaseConnect = ({
  databaseInfo,
  instanceTestConnectResults
}: {
  databaseInfo: Array<DatabaseSelectionFields>;
  instanceTestConnectResults: DatabaseSelectionItemProps['instanceTestConnectResults'];
}) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [testLoading, { setTrue: testStart, setFalse: testFinish }] =
    useBoolean();
  const disabledTestConnect = useMemo(
    () =>
      databaseInfo?.map((v) => v?.instanceName)?.filter((v) => !!v).length ===
      0,
    [databaseInfo]
  );
  const testDatabaseConnect = useCallback(async () => {
    const instances =
      (databaseInfo ?? [])
        .map((v) => ({
          name: v?.instanceName
        }))
        ?.filter((v) => !!v.name) ?? [];
    if (instances.length === 0) {
      return;
    }
    const params: IBatchCheckInstanceIsConnectableByNameParams = {
      instances: instances,
      project_name: projectName
    };
    testStart();
    instance
      .batchCheckInstanceIsConnectableByName(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          instanceTestConnectResults.set(res.data.data ?? []);
        }
      })
      .finally(() => {
        testFinish();
      });
  }, [
    databaseInfo,
    instanceTestConnectResults,
    projectName,
    testFinish,
    testStart
  ]);
  const renderTestDatabasesConnectInfo = useCallback(
    (name: string) => {
      const result = instanceTestConnectResults.value?.find(
        (v) => v.instance_name === name
      );
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
    [instanceTestConnectResults.value, t]
  );
  return {
    testDatabaseConnect,
    testLoading,
    renderTestDatabasesConnectInfo,
    disabledTestConnect
  };
};
export default useTestDatabaseConnect;
