import React, { useMemo } from 'react';
import { Checkbox, Space, Typography } from 'antd';
import { IListOpPermission } from '@actiontech/shared/lib/api/base/service/common';
import { groupBy } from 'lodash';
import { OpPermissionCheckboxGroupStyleWrapper } from '../style';

export interface IOpPermissionCheckboxGroupProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  opPermissionList: IListOpPermission[];
}

const OpPermissionCheckboxGroup: React.FC<IOpPermissionCheckboxGroupProps> = ({
  value = [],
  onChange,
  opPermissionList
}) => {
  const groupedPermissions = useMemo(() => {
    return groupBy(opPermissionList, (permission) => permission.module);
  }, [opPermissionList]);

  const handleGroupChange = (
    groupPermissions: IListOpPermission[],
    checkedValues: string[]
  ) => {
    const groupUids = groupPermissions.map((p) => p.op_permission?.uid || '');
    const otherValues = value.filter((v) => !groupUids.includes(v));
    const newValue = [...otherValues, ...checkedValues];
    onChange?.(newValue);
  };

  const renderPermissionGroup = (
    moduleName: string,
    permissions: IListOpPermission[],
    isLast: boolean
  ) => {
    if (permissions.length === 0) return null;

    const groupPermissionUids = permissions.map(
      (p) => p.op_permission?.uid || ''
    );
    const groupCheckedValues = value.filter((v) =>
      groupPermissionUids.includes(v)
    );

    return (
      <OpPermissionCheckboxGroupStyleWrapper
        key={moduleName}
        direction="vertical"
        size={4}
        isLast={isLast}
      >
        <Typography.Text type="secondary">{moduleName}</Typography.Text>
        <div>
          <Checkbox.Group
            value={groupCheckedValues}
            onChange={(checkedValues) =>
              handleGroupChange(permissions, checkedValues as string[])
            }
          >
            {permissions.map((permission) => (
              <Checkbox
                key={permission.op_permission?.uid}
                value={permission.op_permission?.uid}
              >
                {permission.op_permission?.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
      </OpPermissionCheckboxGroupStyleWrapper>
    );
  };

  return (
    <Space direction="vertical" size={8}>
      {Object.keys(groupedPermissions).map((moduleName, index) =>
        renderPermissionGroup(
          moduleName,
          groupedPermissions[moduleName],
          index === Object.keys(groupedPermissions).length - 1
        )
      )}
    </Space>
  );
};

export default OpPermissionCheckboxGroup;
