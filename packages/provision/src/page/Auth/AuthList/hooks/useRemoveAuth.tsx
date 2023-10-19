import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IListAuthorization } from '@actiontech/shared/lib/api/provision/service/common';
import { message } from 'antd';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '~/data/common';

const useRemoveAuth = (refreshList: () => void) => {
  const removeLoading = useRef(false);
  const { t } = useTranslation();

  const removeAuth = async (authInfo: IListAuthorization) => {
    if (removeLoading.current) {
      return;
    }
    removeLoading.current = true;
    const hide = message.loading(t('auth.deleteAuth.loading'), 0);
    try {
      const val = await auth.AuthDelAuthorization({
        authorization_uid: authInfo.uid ?? ''
      });
      if (val.data.code === ResponseCode.SUCCESS) {
        message.success(t('auth.deleteAuth.success'));
        refreshList();
      }
    } finally {
      hide();
      removeLoading.current = false;
    }
  };

  return {
    removeAuth
  };
};

export default useRemoveAuth;
