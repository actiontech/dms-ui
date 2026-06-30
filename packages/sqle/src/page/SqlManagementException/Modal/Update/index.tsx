import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { IReduxState } from '../../../../store';
import {
  updateSqlManagementExceptModalStatus,
  updateSelectSqlManagementException
} from '../../../../store/sqlManagementException';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import SqlManagementExceptionFormDrawer from '../../Common/FormDrawer';

const UpdateSqlManagementException = () => {
  const visible = useSelector<IReduxState, boolean>(
    (state) =>
      !!state.sqlManagementException.modalStatus[
        ModalName.Update_Sql_Management_Exception
      ]
  );

  const record = useSelector<IReduxState, IBlacklistResV1 | null>(
    (state) => state.sqlManagementException.selectSqlManagementExceptionRecord
  );

  const dispatch = useDispatch();

  const closeModal = useCallback(() => {
    dispatch(
      updateSqlManagementExceptModalStatus({
        modalName: ModalName.Update_Sql_Management_Exception,
        status: false
      })
    );
    dispatch(updateSelectSqlManagementException({ selectRow: null }));
  }, [dispatch]);

  return (
    <SqlManagementExceptionFormDrawer
      mode="update"
      open={visible}
      record={record}
      onClose={closeModal}
    />
  );
};

export default UpdateSqlManagementException;
