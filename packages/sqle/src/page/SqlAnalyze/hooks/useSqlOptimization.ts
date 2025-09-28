import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useRequest } from 'ahooks';
import { SqleApi } from '@actiontech/shared/lib/api';
import { ISQLOptimizeV2Params } from '@actiontech/shared/lib/api/sqle/service/sql_optimization/index.d';
import { ResponseCode } from '@actiontech/dms-kit';
import { ModalName } from '../../../data/ModalName';
import {
  updateSqlAnalyzeModalStatus,
  initSqlAnalyzeModalStatus,
  updateResultDrawerData
} from '../../../store/sqlAnalyze';
import { useDispatch } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { usePermission } from '@actiontech/shared/lib/features';
import { PERMISSIONS } from '@actiontech/shared/lib/features/usePermission/permissions';
import useInstance from '../../../hooks/useInstance';

const useSqlOptimization = () => {
  const { projectName } = useCurrentProject();
  const dispatch = useDispatch();
  const { checkPagePermission } = usePermission();
  const {
    getInstanceDbType,
    updateInstanceList,
    loading: updateInstanceListloading
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
    runAsync: createSqlOptimiationSync
  } = useRequest(
    () =>
      SqleApi.SqlOptimizationService.SQLOptimizeV2({
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
      createSqlOptimiationSync();
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
      checkPagePermission(PERMISSIONS.PAGES.SQLE.SQL_OPTIMIZATION) &&
      !updateInstanceListloading
    );
  }, [
    optimizationCreationParams.instance_name,
    checkPagePermission,
    updateInstanceListloading
  ]);

  useEffect(() => {
    updateInstanceList({
      project_name: projectName
    });
  }, [projectName, updateInstanceList]);

  return {
    optimizationRecordId,
    createSqlOptimizationLoading,
    createSqlOptimiationSync,
    onCreateSqlOptimizationOrview,
    setOptimizationCreationParams,
    allowSqlOptimization
  };
};

export default useSqlOptimization;
