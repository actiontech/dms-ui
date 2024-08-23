import CreateSqlManagementException from './Create';
import UpdateSqlManagementException from './Update';
import { useEffect } from 'react';
import { ModalName } from '../../../data/ModalName';
import { initSqlManagementExceptModalStatus } from '../../../store/sqlManagementException';
import { useDispatch } from 'react-redux';

const SqlManagementExceptionModal = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const modalStatus = {
      [ModalName.Create_Sql_Management_Exception]: false,
      [ModalName.Update_Sql_Management_Exception]: false
    };
    dispatch(initSqlManagementExceptModalStatus({ modalStatus }));
  }, [dispatch]);

  return (
    <>
      <UpdateSqlManagementException />
      <CreateSqlManagementException />
    </>
  );
};

export default SqlManagementExceptionModal;
