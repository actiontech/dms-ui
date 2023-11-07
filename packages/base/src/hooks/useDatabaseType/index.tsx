import React from 'react';
import { useBoolean } from 'ahooks';
import { DatabaseTypeLogo } from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { IDatabaseDriverOption } from '@actiontech/shared/lib/api/base/service/common';
import { Select } from 'antd5';
import { useCurrentProject } from '@actiontech/shared/lib/global';

const useDatabaseType = () => {
  //todo: 暂时不移除这里的重复代码，需要另开issue测试一下sqle的影响面
  const [driverNameList, setDriverNameList] = React.useState<string[]>([]);
  const [driverMeta, setDriverMeta] = React.useState<IDatabaseDriverOption[]>(
    []
  );
  const [loading, { setTrue, setFalse }] = useBoolean();

  const { projectID } = useCurrentProject();

  const updateDriverNameList = React.useCallback(() => {
    setTrue();
    dms
      .ListDBServiceDriverOption({
        project_uid: projectID
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setDriverMeta(res.data.data ?? []);
          setDriverNameList(res.data.data?.map((v) => v.db_type ?? '') ?? []);
        } else {
          setDriverNameList([]);
          setDriverMeta([]);
        }
      })
      .catch(() => {
        setDriverMeta([]);
        setDriverNameList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue, projectID]);

  const generateDriverSelectOptions = React.useCallback(() => {
    return driverMeta.map((v) => {
      return (
        <Select.Option key={v.db_type} value={v.db_type}>
          {/* todo: logoUrl={v.logo_path} 由于后端接口问题，先使用sqle的图标 */}
          <DatabaseTypeLogo
            dbType={v.db_type ?? ''}
            logoUrl={''}
            // logoUrl={v.logo_path ?? ''}
          />
        </Select.Option>
      );
    });
  }, [driverMeta]);

  return {
    driverNameList,
    loading,
    updateDriverNameList,
    generateDriverSelectOptions,
    driverMeta
  };
};
export default useDatabaseType;
