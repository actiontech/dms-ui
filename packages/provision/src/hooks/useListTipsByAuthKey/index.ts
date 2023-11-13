import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useRequest } from 'ahooks';
import { ListTipsByAuthorizationKeyKeyEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import { ResponseCode } from '~/data/common';
import { AxiosResponse } from 'axios';
import { IListTipsByAuthorizationKeyReturn } from '@actiontech/shared/lib/api/provision/service/auth/index.d';

const useListTipsByAuthKey = () => {
  const generateSelectOptions = (
    res: AxiosResponse<IListTipsByAuthorizationKeyReturn>
  ) => {
    if (res.data.code === ResponseCode.SUCCESS) {
      return res.data.data?.tips?.map((item) => ({
        value: item,
        label: item
      }));
    }
  };

  const { data: purposeOptions } = useRequest(() =>
    auth
      .ListTipsByAuthorizationKey({
        key: ListTipsByAuthorizationKeyKeyEnum.purpose
      })
      .then(generateSelectOptions)
  );
  const { data: businessOptions } = useRequest(() =>
    auth
      .ListTipsByAuthorizationKey({
        key: ListTipsByAuthorizationKeyKeyEnum.business
      })
      .then(generateSelectOptions)
  );
  const { data: serviceOptions } = useRequest(() =>
    auth
      .ListTipsByAuthorizationKey({
        key: ListTipsByAuthorizationKeyKeyEnum.data_service
      })
      .then(generateSelectOptions)
  );

  return {
    purposeOptions,
    businessOptions,
    serviceOptions
  };
};

export default useListTipsByAuthKey;
