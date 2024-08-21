import CreateSqlManagementException from './Create';
import UpdateSqlManagementException from './Update';

const SqlManagementExceptionModal = () => {
  return (
    <>
      <UpdateSqlManagementException />
      <CreateSqlManagementException />
    </>
  );
};

export default SqlManagementExceptionModal;
