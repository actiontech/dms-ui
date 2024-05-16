import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useCallback, useState } from 'react';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import passwordSecurityPolicy from '@actiontech/shared/lib/api/provision/service/password_secury_policy/index';
import { IPasswordSecurityPolicy } from '@actiontech/shared/lib/api/provision/service/common';
import { t } from '~/locale';

export const normalPolicyValue = 'NORMAL';

export const normalPolicy = {
  value: normalPolicyValue,
  label: t('databaseAccount.create.normalPolicy')
};

const useSecurityPolicy = () => {
  const { projectID } = useCurrentProject();

  const [policyList, setPolicyList] = useState<IPasswordSecurityPolicy[]>([]);

  const [loading, { setTrue, setFalse }] = useBoolean();

  const updateSecurityPolicyList = useCallback(() => {
    setTrue();
    passwordSecurityPolicy
      .AuthListPasswordSecurityPolicys({
        project_uid: projectID,
        page_size: 9999,
        page_index: 1
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setPolicyList(res.data.data ?? []);
        }
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue, projectID]);

  const policyOptions = useCallback(
    (normal = true) => {
      const options =
        policyList?.map((policy) => {
          return {
            value: policy.uid,
            label: policy.name
          };
        }) ?? [];
      if (normal) {
        return [normalPolicy, ...options];
      }
      return options;
    },
    [policyList]
  );

  return {
    loading,
    policyOptions,
    policyList,
    updateSecurityPolicyList
  };
};

export default useSecurityPolicy;
