import { useDispatch, useSelector } from 'react-redux';
import {
  initSqleManagementModalStatus,
  updateSqleManagement,
  updateSqleManagementModalStatus,
  updateSqlIdList
} from '../../../../../store/sqleManagement';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';
import { IReduxState } from '../../../../../store';

const useTableRedux = (id?: string) => {
  const { open, selectedSqlIdList, selectedSqleManagement } = useSelector(
    (state: IReduxState) => ({
      open: state.sqleManagement.modalStatus[id as string],
      selectedSqlIdList: state.sqleManagement.selectSqlIdList,
      selectedSqleManagement: state.sqleManagement.selectSqleManagement
    })
  );
  const dispatch = useDispatch();

  const initModalStatus = (modalStatus: ModalStatus) => {
    dispatch(initSqleManagementModalStatus({ modalStatus }));
  };

  const setSelectData = (data: ISqlManage | null) => {
    dispatch(updateSqleManagement(data));
  };

  const updateModalStatus = (modalName: string, status: boolean) => {
    dispatch(updateSqleManagementModalStatus({ modalName, status }));
  };

  const updateIdList = (data: ISqlManage[] | null) => {
    dispatch(updateSqlIdList(data));
  };

  return {
    open,
    selectedSqlIdList,
    selectedSqleManagement,
    initModalStatus,
    setSelectData,
    updateModalStatus,
    updateIdList
  };
};

export default useTableRedux;
