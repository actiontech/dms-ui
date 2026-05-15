import { useDispatch } from 'react-redux';
import {
  updateSqlManagementExceptModalStatus,
  updateSelectSqlManagementException
} from '../../../store/sqlManagementException';
import { ModalName } from '../../../data/ModalName';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { useCallback } from 'react';

const useSqlManagementExceptionRedux = () => {
  const dispatch = useDispatch();

  const openCreateSqlManagementExceptionModal = useCallback(() => {
    dispatch(
      updateSqlManagementExceptModalStatus({
        modalName: ModalName.Create_Sql_Management_Exception,
        status: true
      })
    );
  }, [dispatch]);

  const updateSelectSqlManagementExceptionRecord = useCallback(
    (record?: IBlacklistResV1) => {
      dispatch(
        updateSelectSqlManagementException({
          selectRow: record ?? null
        })
      );
    },
    [dispatch]
  );

  return {
    openCreateSqlManagementExceptionModal,
    updateSelectSqlManagementExceptionRecord,
    dispatch
  };
};

export default useSqlManagementExceptionRedux;
