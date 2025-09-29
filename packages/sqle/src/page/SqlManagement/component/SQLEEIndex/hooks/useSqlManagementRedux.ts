import { useDispatch, useSelector } from 'react-redux';
import {
  initSqlManagementModalStatus,
  setSqlManagementSelectData,
  updateSqlManagementModalStatus,
  setSqlManagementBatchSelectData
} from '../../../../../store/sqlManagement';
import { ModalStatus } from '@actiontech/dms-kit/es/types/common.type';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { IReduxState } from '../../../../../store';

const useSqlManagementRedux = (id?: string) => {
  const { open, batchSelectSqlManagement, selectSqlManagement } = useSelector(
    (state: IReduxState) => ({
      open: state.sqlManagement.modalStatus[id as string],
      selectSqlManagement: state.sqlManagement.selectSqlManagement,
      batchSelectSqlManagement: state.sqlManagement.batchSelectSqlManagement
    })
  );
  const dispatch = useDispatch();

  const initModalStatus = (modalStatus: ModalStatus) => {
    dispatch(initSqlManagementModalStatus({ modalStatus }));
  };

  const setSelectData = (data: ISqlManage | null) => {
    dispatch(setSqlManagementSelectData(data));
  };

  const updateModalStatus = (modalName: string, status: boolean) => {
    dispatch(updateSqlManagementModalStatus({ modalName, status }));
  };

  const setBatchSelectData = (data: ISqlManage[] | null) => {
    dispatch(setSqlManagementBatchSelectData(data));
  };

  return {
    open,
    batchSelectSqlManagement,
    selectSqlManagement,
    initModalStatus,
    setSelectData,
    updateModalStatus,
    setBatchSelectData
  };
};

export default useSqlManagementRedux;
