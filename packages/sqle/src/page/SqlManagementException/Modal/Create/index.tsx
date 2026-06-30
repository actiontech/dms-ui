import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { IReduxState } from '../../../../store';
import {
  updateSqlManagementExceptModalStatus,
  initSqlManagementExceptModalStatus,
  updateSelectSqlManagementException
} from '../../../../store/sqlManagementException';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import SqlManagementExceptionFormDrawer from '../../Common/FormDrawer';

const CreateSqlManagementException: React.FC<{
  onCreated?: () => void;
}> = ({ onCreated }) => {
  const visible = useSelector<IReduxState, boolean>(
    (state) =>
      !!state.sqlManagementException.modalStatus[
        ModalName.Create_Sql_Management_Exception
      ]
  );

  const record = useSelector<IReduxState, IBlacklistResV1 | null>(
    (state) => state.sqlManagementException.selectSqlManagementExceptionRecord
  );

  const dispatch = useDispatch();

  const closeModal = useCallback(() => {
    dispatch(
      updateSqlManagementExceptModalStatus({
        modalName: ModalName.Create_Sql_Management_Exception,
        status: false
      })
    );
    dispatch(updateSelectSqlManagementException({ selectRow: null }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      initSqlManagementExceptModalStatus({
        modalStatus: {
          [ModalName.Create_Sql_Management_Exception]: false
        }
      })
    );
  }, [dispatch]);

  return (
    <SqlManagementExceptionFormDrawer
      mode="create"
      open={visible}
      record={record}
      onClose={closeModal}
      onSuccess={onCreated}
    />
  );
};

export default CreateSqlManagementException;
