import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { useRequest } from 'ahooks';
import OptimizationService from '@actiontech/shared/lib/api/sqle/service/sql_optimization';
import { ISQLOptimizeV2Params } from '@actiontech/shared/lib/api/sqle/service/sql_optimization/index.d';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ModalName } from '../../../data/ModalName';
import {
  updateSqlAnalyzeModalStatus,
  initSqlAnalyzeModalStatus,
  updateResultDrawerData
} from '../../../store/sqlAnalyze';
import { useDispatch } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import useInstance from '../../../hooks/useInstance';

const useSqlOptimization = () => {
  const { projectName } = useCurrentProject();
  const dispatch = useDispatch();
  const { isSqlOptimizationSupported } = useCurrentUser();
  const {
    getInstanceDbType,
    updateInstanceList,
    loading: updateInstanceListLoading
  } = useInstance();
  const [optimizationCreationParams, setOptimizationCreationParams] = useState<
    Pick<ISQLOptimizeV2Params, 'instance_name' | 'schema_name' | 'sql_content'>
  >({});

  const openOptimizationResultDrawer = (id: string) => {
    dispatch(
      updateSqlAnalyzeModalStatus({
        modalName: ModalName.Sql_Optimization_Result_Drawer,
        status: true
      })
    );
    dispatch(
      updateResultDrawerData({
        resultDrawerData: { optimizationId: id }
      })
    );
  };

  const {
    data: optimizationRecordId,
    loading: createSqlOptimizationLoading,
    runAsync: createSqlOptimizationSync
  } = useRequest(
    () =>
      OptimizationService.SQLOptimizeV2({
        optimization_name: `UI${dayjs().format('YYYYMMDDhhmmssSSS')}`,
        project_name: projectName,
        instance_name: optimizationCreationParams.instance_name,
        schema_name: optimizationCreationParams.schema_name,
        sql_content: optimizationCreationParams.sql_content,
        db_type: getInstanceDbType(
          optimizationCreationParams.instance_name ?? ''
        )
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data?.sql_optimization_record_id;
        }
      }),
    {
      manual: true,
      onSuccess: (res) => {
        if (!!res) {
          openOptimizationResultDrawer(res);
        }
      }
    }
  );

  const onCreateSqlOptimizationOrview = () => {
    if (!optimizationRecordId) {
      createSqlOptimizationSync();
    } else {
      openOptimizationResultDrawer(optimizationRecordId ?? '');
    }
  };

  useEffect(() => {
    dispatch(
      initSqlAnalyzeModalStatus({
        modalStatus: {
          [ModalName.Sql_Optimization_Result_Drawer]: false
        }
      })
    );
  }, [dispatch]);

  const allowSqlOptimization = useMemo(() => {
    return (
      !!optimizationCreationParams.instance_name &&
      isSqlOptimizationSupported &&
      !updateInstanceListLoading
    );
  }, [
    optimizationCreationParams.instance_name,
    isSqlOptimizationSupported,
    updateInstanceListLoading
  ]);

  useEffect(() => {
    updateInstanceList({
      project_name: projectName
    });
  }, [projectName, updateInstanceList]);

  return {
    optimizationRecordId,
    createSqlOptimizationLoading,
    createSqlOptimizationSync,
    onCreateSqlOptimizationOrview,
    setOptimizationCreationParams,
    allowSqlOptimization
  };
};

export default useSqlOptimization;
