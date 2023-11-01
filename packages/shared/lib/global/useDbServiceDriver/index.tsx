import React, { useCallback, useEffect } from 'react';
import { useBoolean } from 'ahooks';
import useCurrentProject from '../useCurrentProject';
import dms from '../../api/base/service/dms';
import { ResponseCode } from '../../enum';
import { IDatabaseDriverOption } from '../../api/base/service/common';

const useDbServiceDriver = () => {
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

  const getLogoUrlByDbType = useCallback(
    (dbType: string) => {
      if (!dbType) return '';

      return (
        driverMeta.find((driver) => dbType === driver?.db_type)?.logo_path ?? ''
      );
    },
    [driverMeta]
  );

  useEffect(() => {
    if (projectID) {
      updateDriverNameList();
    }
  }, [projectID, updateDriverNameList]);

  return {
    driverNameList,
    loading,
    updateDriverNameList,
    driverMeta,
    getLogoUrlByDbType
  };
};
export default useDbServiceDriver;
