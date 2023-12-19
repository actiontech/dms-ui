import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../data/ModalName';
import { IReduxState } from '../../../store';
import { ModalStatus } from '@actiontech/shared/lib/types/common.type';
import {
  initUserManagementModalStatus,
  updateSelectRoleData,
  updateSelectUserData,
  updateUserManagementModalStatus,
  updatePermissionRoleId
} from '../../../store/userManagement';
import { IViewRoleReply, IViewUserReply } from '../../../api/common';

const useUserManagementRedux = (modalName?: ModalName) => {
  const dispatch = useDispatch();

  const modalState = useSelector((state: IReduxState) => ({
    visible: state.userManagement.modalStatus[modalName!],
    selectUserData: state.userManagement.selectUserData,
    selectRoleData: state.userManagement.selectRoleData,
    permissionRoleId: state.userManagement.permissionRoleId
  }));

  const initModalStatus = (modalStatus: ModalStatus) => {
    dispatch(initUserManagementModalStatus({ modalStatus }));
  };

  const setModalStatus = (name: ModalName, status: boolean) => {
    dispatch(
      updateUserManagementModalStatus({
        modalName: name,
        status
      })
    );
  };

  const setSelectUserData = (record: IViewUserReply | null) => {
    dispatch(updateSelectUserData(record));
  };

  const setSelectRoleData = (record: IViewRoleReply | null) => {
    dispatch(updateSelectRoleData(record));
  };

  const setPermissionRoleId = (id: string) => {
    dispatch(updatePermissionRoleId(id));
  };

  return {
    ...modalState,
    initModalStatus,
    setModalStatus,
    setSelectUserData,
    setSelectRoleData,
    setPermissionRoleId
  };
};

export default useUserManagementRedux;
