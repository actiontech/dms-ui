import { useBoolean } from 'ahooks';
import { Form } from 'antd';
import { BatchImportDataSourceFormValueType } from '../index.type';

const useBatchImportDataSource = () => {
  const [
    importLoading,
    { setTrue: setImportPending, setFalse: setImportDone }
  ] = useBoolean();

  const [resultVisible, { setTrue: showResult, setFalse: hideResult }] =
    useBoolean(false);

  const [form] = Form.useForm<BatchImportDataSourceFormValueType>();

  const resetAndHideResult = () => {
    form.resetFields();
    hideResult();
  };

  return {
    importLoading,
    setImportPending,
    setImportDone,
    resultVisible,
    showResult,
    hideResult,
    form,
    resetAndHideResult
  };
};

export default useBatchImportDataSource;
