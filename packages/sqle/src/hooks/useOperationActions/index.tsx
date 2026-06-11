import { useCallback, useState } from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import baseOperationRecord from '@actiontech/shared/lib/api/base/service/OperationRecord';
import sqleOperationRecord from '@actiontech/shared/lib/api/sqle/service/OperationRecord';

type OperationAction = {
  operation_type?: string;
  operation_action?: string;
  desc?: string;
};

const useOperationActions = () => {
  const [operationActionList, setOperationActionList] = useState<
    OperationAction[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateOperationActions = useCallback(() => {
    setTrue();
    Promise.all([
      baseOperationRecord.GetOperationActionList(),
      sqleOperationRecord.getOperationActionList()
    ])
      .then(([dmsRes, sqleRes]) => {
        const merged = new Map<string, OperationAction>();
        const appendList = (list?: OperationAction[]) => {
          list?.forEach((item) => {
            if (!item.operation_action) {
              return;
            }
            const key = `${item.operation_type ?? ''}:${item.operation_action}`;
            merged.set(key, item);
          });
        };
        if (dmsRes.data.code === ResponseCode.SUCCESS) {
          appendList(dmsRes.data.data);
        }
        if (sqleRes.data.code === ResponseCode.SUCCESS) {
          appendList(sqleRes.data.data);
        }
        setOperationActionList(Array.from(merged.values()));
      })
      .catch(() => {
        setOperationActionList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const operationActionOptions = useCallback(
    (
      operationTypeName?: string | string[],
      operationTypeDescMap: Record<string, string> = {}
    ) => {
      const selectedTypes = Array.isArray(operationTypeName)
        ? operationTypeName
        : operationTypeName
        ? [operationTypeName]
        : [];
      const uniqueByValue = new Map<string, OperationAction>();
      operationActionList.forEach((action) => {
        if (selectedTypes.length > 0) {
          if (!selectedTypes.includes(action.operation_type ?? '')) {
            return;
          }
        }
        const value = action.operation_action ?? '';
        if (!value || uniqueByValue.has(value)) {
          return;
        }
        uniqueByValue.set(value, action);
      });

      const actions = Array.from(uniqueByValue.values());
      const labelCount = actions.reduce<Record<string, number>>(
        (acc, action) => {
          const label = action.desc ?? action.operation_action ?? '';
          acc[label] = (acc[label] ?? 0) + 1;
          return acc;
        },
        {}
      );

      return actions.map((action) => {
        const baseLabel = action.desc ?? action.operation_action ?? '';
        const typeDesc =
          operationTypeDescMap[action.operation_type ?? ''] ??
          action.operation_type ??
          '';
        const shouldAppendType =
          selectedTypes.length === 0 || (labelCount[baseLabel] ?? 0) > 1;
        const label =
          shouldAppendType && typeDesc
            ? `${baseLabel} (${typeDesc})`
            : baseLabel;
        return {
          label,
          value: action.operation_action ?? ''
        };
      });
    },
    [operationActionList]
  );

  return {
    operationActionList,
    loading,
    updateOperationActions,
    operationActionOptions
  };
};

export default useOperationActions;
