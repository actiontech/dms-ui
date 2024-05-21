import { BasicToolTips } from '@actiontech/shared';
import { IconFailed, IconSucceeded } from '@actiontech/shared/lib/Icon/common';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { TestConnectResultStyleWrapper } from '@actiontech/shared/lib/components/TestDatabaseConnectButton/style';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
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
      databaseInfo?.map((v) => v?.instanceName)?.filter((v: string) => !!v)
        .length === 0,
    [databaseInfo]
  );

  const testDatabaseConnect = useCallback(async () => {
    const instances =
      (databaseInfo ?? [])
        .map((v) => ({
          name: v?.instanceName
        }))
        ?.filter((v: { name: string }) => !!v.name) ?? [];

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
        <TestConnectResultStyleWrapper
          success={!!result.is_instance_connectable}
        >
          {!!result.is_instance_connectable && (
            <TestConnectResultStyleWrapper success>
              <IconSucceeded />
              {t('common.testDatabaseConnectButton.testSuccess')}
            </TestConnectResultStyleWrapper>
          )}
          {!result.is_instance_connectable && (
            <BasicToolTips title={result.connect_error_message}>
              <TestConnectResultStyleWrapper success={false}>
                <IconFailed />
                {t('common.testDatabaseConnectButton.testFailed')}
              </TestConnectResultStyleWrapper>
            </BasicToolTips>
          )}
        </TestConnectResultStyleWrapper>
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
