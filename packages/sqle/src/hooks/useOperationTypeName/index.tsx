import { useState, useCallback, useMemo } from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import { Select } from 'antd5';
import { IOperationTypeNameList } from '@actiontech/shared/lib/api/sqle/service/common';
import OperationRecord from '@actiontech/shared/lib/api/sqle/service/OperationRecord';

const useOperationTypeName = () => {
  const [operationTypeNameList, setOperationTypeNameList] = useState<
    IOperationTypeNameList[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateOperationTypeNameList = useCallback(() => {
    setTrue();
    OperationRecord.GetOperationTypeNameList()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setOperationTypeNameList(res.data?.data ?? []);
        } else {
          setOperationTypeNameList([]);
        }
      })
      .catch(() => {
        setOperationTypeNameList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateOperationTypeNameSelectOption = useCallback(() => {
    return operationTypeNameList.map((type) => {
      return (
        <Select.Option
          key={type.operation_type_name}
          value={type.operation_type_name ?? ''}
        >
          {type.desc}
        </Select.Option>
      );
    });
  }, [operationTypeNameList]);

  const operationTypeNameOptions = useMemo(() => {
    return operationTypeNameList.map((i) => {
      return {
        label: i.desc,
        value: i.operation_type_name
      };
    });
  }, [operationTypeNameList]);

  return {
    operationTypeNameList,
    loading,
    updateOperationTypeNameList,
    generateOperationTypeNameSelectOption,
    operationTypeNameOptions
  };
};

export default useOperationTypeName;
