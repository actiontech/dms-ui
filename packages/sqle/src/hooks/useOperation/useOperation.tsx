import { useCallback, useState } from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import { Select } from 'antd';
import operation from '@actiontech/shared/lib/api/sqle/service/operation';
import { IOperationResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

const useOperation = () => {
  const [operationList, setOperationList] = useState<IOperationResV1[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateOperationList = useCallback(() => {
    setTrue();
    operation
      .GetOperationsV1()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setOperationList(res.data?.data ?? []);
        } else {
          setOperationList([]);
        }
      })
      .catch(() => {
        setOperationList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateOperationSelectOption = useCallback(() => {
    return operationList.map((item) => {
      return (
        <Select.Option key={item.op_code} value={item.op_code ?? ''}>
          {item.op_desc}
        </Select.Option>
      );
    });
  }, [operationList]);

  return {
    operationList,
    loading,
    updateOperationList,
    generateOperationSelectOption
  };
};

export default useOperation;
