import { useCallback, useMemo, useState } from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import baseOperationRecord from '@actiontech/shared/lib/api/base/service/OperationRecord';
import sqleOperationRecord from '@actiontech/shared/lib/api/sqle/service/OperationRecord';

type OperationTypeName = {
  operation_type_name?: string;
  desc?: string;
};

const useOperationTypeName = () => {
  const [operationTypeNameList, setOperationTypeNameList] = useState<
    OperationTypeName[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateOperationTypeNameList = useCallback(() => {
    setTrue();
    Promise.all([
      baseOperationRecord.GetOperationTypeNameList(),
      sqleOperationRecord.GetOperationTypeNameList()
    ])
      .then(([dmsRes, sqleRes]) => {
        const merged = new Map<string, OperationTypeName>();
        const appendList = (list?: OperationTypeName[]) => {
          list?.forEach((item) => {
            if (!item.operation_type_name) {
              return;
            }
            merged.set(item.operation_type_name, item);
          });
        };
        if (dmsRes.data.code === ResponseCode.SUCCESS) {
          appendList(dmsRes.data.data);
        }
        if (sqleRes.data.code === ResponseCode.SUCCESS) {
          appendList(sqleRes.data.data);
        }
        setOperationTypeNameList(Array.from(merged.values()));
      })
      .catch(() => {
        setOperationTypeNameList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const operationTypeNameOptions = useMemo(() => {
    return operationTypeNameList.map((typeName) => ({
      label: typeName.desc ?? typeName.operation_type_name ?? '',
      value: typeName.operation_type_name ?? ''
    }));
  }, [operationTypeNameList]);

  const operationTypeDescMap = useMemo(() => {
    return operationTypeNameList.reduce<Record<string, string>>((acc, item) => {
      if (item.operation_type_name) {
        acc[item.operation_type_name] =
          item.desc ?? item.operation_type_name ?? '';
      }
      return acc;
    }, {});
  }, [operationTypeNameList]);

  return {
    operationTypeNameList,
    loading,
    updateOperationTypeNameList,
    operationTypeNameOptions,
    operationTypeDescMap
  };
};

export default useOperationTypeName;
