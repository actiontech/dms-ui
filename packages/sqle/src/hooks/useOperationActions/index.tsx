import { useState, useCallback } from 'react';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '../../data/common';
import { Select } from 'antd';
import OperationRecord from '@actiontech/shared/lib/api/sqle/service/OperationRecord';
import { IOperationActionList } from '@actiontech/shared/lib/api/sqle/service/common';

const useOperationActions = () => {
  const [operationActions, setOperationActions] = useState<
    IOperationActionList[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateOperationActions = useCallback(() => {
    setTrue();
    OperationRecord.getOperationActionList()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setOperationActions(res.data?.data ?? []);
        } else {
          setOperationActions([]);
        }
      })
      .catch(() => {
        setOperationActions([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue]);

  const generateOperationActionSelectOption = useCallback(
    (type?: string) => {
      return operationActions.map((content) => {
        if (!type || type === content.operation_type) {
          return (
            <Select.Option
              key={content.operation_action}
              value={content.operation_action ?? ''}
            >
              {content.desc}
            </Select.Option>
          );
        }
        return null;
      });
    },
    [operationActions]
  );

  const operationActionOptions = useCallback(
    (type?: string) => {
      if (type) {
        return operationActions
          .filter((i) => i.operation_type === type)
          .map((content) => {
            return {
              label: content.desc,
              value: content.operation_action
            };
          });
      }
      return operationActions.map((content) => {
        return {
          label: content.desc,
          value: content.operation_action
        };
      });
    },
    [operationActions]
  );

  return {
    operationActions,
    loading,
    updateOperationActions,
    generateOperationActionSelectOption,
    operationActionOptions
  };
};

export default useOperationActions;
