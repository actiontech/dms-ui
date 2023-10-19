import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IListDataPermissionTemplate } from '@actiontech/shared/lib/api/provision/service/common';
import { message } from 'antd';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '~/data/common';

const useRemoveTemplate = (refreshList: () => void) => {
  const removeLoading = useRef(false);
  const { t } = useTranslation();

  const removeTemplate = async (template: IListDataPermissionTemplate) => {
    if (removeLoading.current) {
      return;
    }
    removeLoading.current = true;
    const hide = message.loading(
      t('auth.removeTemplate.deleting', { name: template.name }),
      0
    );
    try {
      const val = await auth.AuthDelDataPermissionTemplate({
        data_permission_template_uid: template.uid ?? ''
      });
      if (val.data.code === ResponseCode.SUCCESS) {
        message.success(
          t('auth.removeTemplate.deleteSuccessTips', { name: template.name })
        );
        refreshList();
      }
    } finally {
      hide();
      removeLoading.current = false;
    }
  };

  return {
    removeTemplate
  };
};

export default useRemoveTemplate;
