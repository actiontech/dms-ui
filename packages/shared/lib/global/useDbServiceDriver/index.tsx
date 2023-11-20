import React, { useCallback } from 'react';
import { useRequest } from 'ahooks';
import dms from '../../api/base/service/dms';
import { ResponseCode } from '../../enum';
import { useDispatch } from 'react-redux';
import { updateDriverMeta } from '../../../../base/src/store/database';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../base/src/store';
import DatabaseTypeLogo from '../../components/DatabaseTypeLogo';
import { Select } from 'antd5';

const useDbServiceDriver = () => {
  const dispatch = useDispatch();
  const driverMeta = useSelector(
    (state: IReduxState) => state.database.driverMeta
  );
  const [driverNameList, setDriverNameList] = React.useState<string[]>([]);

  const { loading, run: updateDriverList } = useRequest(
    () => dms.ListDBServiceDriverOption(),
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

  const dbDriverOptions = driverNameList.map((item) => ({
    value: item,
    text: item,
    label: <DatabaseTypeLogo dbType={item} logoUrl={getLogoUrlByDbType(item)} />
  }));

  const generateDriverSelectOptions = React.useCallback(() => {
    return driverMeta.map((v) => {
      return (
        <Select.Option key={v.db_type} value={v.db_type}>
          <DatabaseTypeLogo
            dbType={v.db_type ?? ''}
            logoUrl={v.logo_path ?? ''}
          />
        </Select.Option>
      );
    });
  }, [driverMeta]);

  return {
    driverNameList,
    loading,
    driverMeta,
    dbDriverOptions,
    updateDriverList,
    getLogoUrlByDbType,
    generateDriverSelectOptions
  };
};
export default useDbServiceDriver;
