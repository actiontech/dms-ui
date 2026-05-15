import { ResponseCode } from '@actiontech/dms-kit';
import { DmsApi } from '@actiontech/shared/lib/api';
import { ListGlobalDBServicesTipsFunctionSupportEnum } from '@actiontech/shared/lib/api/base/service/DBService/index.enum';
import { useRequest } from 'ahooks';
import { useState } from 'react';

const useDataMasking = () => {
  const [maskingModalVisible, setMaskingModalVisible] = useState(false);

  const { data: supportedMaskingDbTypesData } = useRequest(() =>
    DmsApi.DBServiceService.ListGlobalDBServicesTips({
      function_support: ListGlobalDBServicesTipsFunctionSupportEnum.data_masking
    }).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        return res.data?.data?.db_type ?? [];
      } else {
        return [];
      }
    })
  );

  return {
    setMaskingModalVisible,
    maskingModalVisible,
    supportedMaskingDbTypesData
  };
};

export default useDataMasking;
