import { Form } from 'antd';
import { VersionFormType } from '../index.type';
import { useBoolean } from 'ahooks';

const useVersionFormState = () => {
  const [form] = Form.useForm<VersionFormType>();

  const [submitting, { setTrue: submitPending, setFalse: submitDone }] =
    useBoolean();

  const [
    submitSuccessStatus,
    { setTrue: successfulSubmit, setFalse: backToForm }
  ] = useBoolean(false);

  return {
    form,
    submitting,
    submitPending,
    submitDone,
    submitSuccessStatus,
    successfulSubmit,
    backToForm
  };
};

export default useVersionFormState;
