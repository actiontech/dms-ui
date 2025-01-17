import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useCallback, useState } from 'react';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import passwordSecurityPolicy from '@actiontech/shared/lib/api/provision/service/password_secury_policy/index';
import { IPasswordSecurityPolicy } from '@actiontech/shared/lib/api/provision/service/common';
import { t } from '~/locale';

export const NORMAL_POLICY_VALUE = 'NORMAL';

export const normalPolicy = {
  value: NORMAL_POLICY_VALUE,
  label: t('databaseAccount.create.normalPolicy')
};

const useSecurityPolicy = () => {
  const { projectID } = useCurrentProject();

  const [securityPolicyList, setSecurityPolicyList] = useState<
    IPasswordSecurityPolicy[]
  >([]);

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
          setSecurityPolicyList(res.data.data ?? []);
        }
      })
      .catch(() => {
        setSecurityPolicyList([]);
      })
      .finally(() => {
        setFalse();
      });
  }, [setFalse, setTrue, projectID]);

  const securityPolicyOptions = useCallback(
    (includeNormalPolicy = true) => {
      const options =
        securityPolicyList?.map((policy) => {
          return {
            value: policy.uid,
            label: policy.name
          };
        }) ?? [];
      if (includeNormalPolicy) {
        return [normalPolicy, ...options];
      }
      return options;
    },
    [securityPolicyList]
  );

  return {
    loading,
    securityPolicyOptions,
    securityPolicyList,
    updateSecurityPolicyList
  };
};

export default useSecurityPolicy;
