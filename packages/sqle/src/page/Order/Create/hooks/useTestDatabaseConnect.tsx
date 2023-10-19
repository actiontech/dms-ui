import { IInstanceConnectionResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IBatchCheckInstanceIsConnectableByNameParams } from '@actiontech/shared/lib/api/sqle/service/instance/index.d';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBoolean } from 'ahooks';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { IconFailed, IconSucceeded } from '@actiontech/shared/lib/Icon/common';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd5';
import { TestConnectResultStyleWrapper } from '@actiontech/shared/lib/components/TestDatabaseConnectButton/style';
import { BasicToolTips } from '@actiontech/shared';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { DatabaseInfoProps } from '../SQLInfoForm/index.type';

const useTestDatabaseConnect = ({
  projectName,
  form
}: Pick<DatabaseInfoProps, 'projectName' | 'form'>) => {
  const { t } = useTranslation();
  const [testLoading, { setTrue: testStart, setFalse: testFinish }] =
    useBoolean();
  const [testResults, setTestResults] = useState<IInstanceConnectionResV1[]>(
    []
  );

  const databaseInfo = Form.useWatch('dataBaseInfo', form);

  const disabledTestConnect = useMemo(
    () =>
      databaseInfo?.map((v) => v.instanceName)?.filter((v: string) => !!v)
        .length === 0,
    [databaseInfo]
  );

  const testDatabaseConnect = useCallback(async () => {
    testStart();
    const instances =
      databaseInfo
        .map((v) => ({
          name: v.instanceName
        }))
        ?.filter((v: { name: string }) => !!v.name) ?? [];

    const params: IBatchCheckInstanceIsConnectableByNameParams = {
      instances: instances,
      project_name: projectName
    };
    instance
      .batchCheckInstanceIsConnectableByName(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setTestResults(res.data.data ?? []);
        }
      })
      .finally(() => {
        testFinish();
      });
  }, [databaseInfo, projectName, testFinish, testStart]);

  const renderTestDatabasesConnectInfo = useCallback(
    (instanceName: string) => {
      const result = testResults.find((v) => v.instance_name === instanceName);
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
    [t, testResults]
  );

  useEffect(() => {
    const reset = () => {
      setTestResults([]);
    };
    EventEmitter.subscribe(EmitterKey.Reset_Create_Order_Form, reset);
    return () => {
      EventEmitter.unsubscribe(EmitterKey.Reset_Create_Order_Form, reset);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    testDatabaseConnect,
    testLoading,
    renderTestDatabasesConnectInfo,
    disabledTestConnect
  };
};

export default useTestDatabaseConnect;
