import { useState, useCallback } from 'react';
import DmsService from '@actiontech/shared/lib/api/base/service/dms';

const useVersionInfo = () => {
  const [dmsVersion, setDmsVersion] = useState<string | undefined>('');
  const [provisionVersion, setProvisionVersion] = useState<string | undefined>(
    ''
  );
  const [sqleVersion, setSqleVersion] = useState<string | undefined>('');

  const formatServerVersion = (version?: string): string => {
    if (!version) {
      return '';
    }
    const versionArr = version.replace(/"/g, '').split(' ');
    if (versionArr.length === 1) {
      return versionArr[0];
    }
    return `${versionArr[0]} ${versionArr[1].slice(0, 10)}`;
  };

  const updateVersionInfo = useCallback(() => {
    DmsService.GetBasicInfo().then((res) => {
      const dms = res.data.data?.components?.find(
        (i) => i.name === 'dms'
      )?.version;
      setDmsVersion(formatServerVersion(dms));

      const provision = res.data.data?.components?.find(
        (i) => i.name === 'provision'
      )?.version;
      setProvisionVersion(formatServerVersion(provision));
      const sqle = res.data.data?.components?.find(
        (i) => i.name === 'sqle'
      )?.version;
      setSqleVersion(formatServerVersion(sqle));
    });
  }, []);

  return {
    updateVersionInfo,
    dmsVersion,
    sqleVersion,
    provisionVersion
  };
};

export default useVersionInfo;
