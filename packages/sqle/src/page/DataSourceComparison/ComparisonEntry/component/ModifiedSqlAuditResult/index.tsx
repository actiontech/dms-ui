import { BasicSegmented } from '@actiontech/dms-kit';
import { IDatabaseDiffModifySQL } from '@actiontech/shared/lib/api/sqle/service/common';
import { Space } from 'antd';
import { DatabaseFilled } from '@actiontech/icons';
import useThemeStyleData from '../../../../../hooks/useThemeStyleData';
import { CommonIconStyleWrapper } from '@actiontech/dms-kit';
import { useEffect, useState } from 'react';
import ModifiedSqlContentList from './List';
type Props = {
  instanceName: string;
  instanceType: string;
  dataSource?: IDatabaseDiffModifySQL[];
  auditResultCollapseActiveKeys: string[];
  auditResultCollapseActiveKeysOnChange: (keys: string[]) => void;
};
const ModifiedSqlAuditResult: React.FC<Props> = ({
  dataSource,
  instanceName,
  instanceType,
  auditResultCollapseActiveKeys,
  auditResultCollapseActiveKeysOnChange
}) => {
  const { sharedTheme } = useThemeStyleData();
  const [activeTabKey, setActiveTabKey] = useState('');
  const currentDatabaseDiffModifySqlInfo = dataSource?.find(
    (v) => v.schema_name === activeTabKey
  );
  useEffect(() => {
    setActiveTabKey(dataSource?.[0]?.schema_name ?? '');
  }, [dataSource]);
  return (
    <>
      <BasicSegmented
        block
        onChange={(key) => {
          setActiveTabKey(key.toString());
        }}
        value={activeTabKey}
        options={
          dataSource?.map((item) => ({
            title: `${instanceName}.${item.schema_name}`,
            value: item.schema_name ?? '',
            label: (
              <Space data-testid={item.schema_name} align="center" size={4}>
                <CommonIconStyleWrapper>
                  <DatabaseFilled color={sharedTheme.uiToken.colorPrimary} />
                </CommonIconStyleWrapper>
                {`${instanceName}-${item.schema_name}`}
              </Space>
            )
          })) ?? []
        }
      />

      <ModifiedSqlContentList
        auditResultCollapseActiveKeys={auditResultCollapseActiveKeys}
        auditResultCollapseActiveKeysOnChange={
          auditResultCollapseActiveKeysOnChange
        }
        instanceType={instanceType}
        auditError={currentDatabaseDiffModifySqlInfo?.audit_error}
        dataSource={currentDatabaseDiffModifySqlInfo?.modify_sqls ?? []}
      />
    </>
  );
};
export default ModifiedSqlAuditResult;
