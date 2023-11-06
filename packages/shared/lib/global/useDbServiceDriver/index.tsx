import React, { useCallback } from 'react';
import { useRequest } from 'ahooks';
import dms from '../../api/base/service/dms';
import { ResponseCode } from '../../enum';
import { useDispatch } from 'react-redux';
import { updateDriverMeta } from '../../../../base/src/store/database';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../base/src/store';

const useDbServiceDriver = () => {
  const dispatch = useDispatch();
  const driverMeta = useSelector(
    (state: IReduxState) => state.database.driverMeta
  );
  const [driverNameList, setDriverNameList] = React.useState<string[]>([]);

  const { loading, run: getDriverMeta } = useRequest(
    (projectId: string) =>
      dms.ListDBServiceDriverOption({ project_uid: projectId }),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          dispatch(updateDriverMeta(res.data.data ?? []));
          setDriverNameList(res.data.data?.map((v) => v.db_type ?? '') ?? []);
        } else {
          dispatch(updateDriverMeta([]));
          setDriverNameList([]);
        }
      },
      onError: () => {
        dispatch(updateDriverMeta([]));
        setDriverNameList([]);
      }
    }
  );

  const getLogoUrlByDbType = useCallback(
    (dbType: string) => {
      if (!dbType) return '';

      return (
        driverMeta.find((driver) => dbType === driver?.db_type)?.logo_path ?? ''
      );
    },
    [driverMeta]
  );

  return {
    driverNameList,
    loading,
    driverMeta,
    getDriverMeta,
    getLogoUrlByDbType
  };
};
export default useDbServiceDriver;
