import { useBoolean } from 'ahooks';
import { useCallback, useState } from 'react';

import { Select } from 'antd5';
import { BasicTag } from '@actiontech/shared';
import sql_audit_record from '@actiontech/shared/lib/api/sqle/service/sql_audit_record';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const useSQLAuditRecordTag = () => {
  const [auditRecordTags, setSQLAuditRecordTags] = useState<string[]>([]);
  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateSQLAuditRecordTag = useCallback(
    (projectName: string) => {
      setTrue();
      sql_audit_record
        .GetSQLAuditRecordTagTipsV1({ project_name: projectName })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            setSQLAuditRecordTags(res.data?.data ?? []);
          } else {
            setSQLAuditRecordTags([]);
          }
        })
        .catch(() => {
          setSQLAuditRecordTags([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );

  const generateSQLAuditRecordSelectOptions = useCallback(() => {
    return auditRecordTags.map((v) => {
      return (
        <Select.Option key={v} value={v ?? ''}>
          <BasicTag color="geekblue">{v}</BasicTag>
        </Select.Option>
      );
    });
  }, [auditRecordTags]);

  return {
    loading,
    updateSQLAuditRecordTag,
    auditRecordTags,
    generateSQLAuditRecordSelectOptions
  };
};

export default useSQLAuditRecordTag;
