import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectProps } from 'antd';
import useDatabaseType from '../../../hooks/useDatabaseType';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';

const useRuleFilterForm = (
  getCustomRuleList: (dbType: string) => void,
  activeKey: RuleManagerSegmentedKey
) => {
  const { t } = useTranslation();
  const { updateDriverNameList, driverNameList } = useDatabaseType();
  const [searchRuleName, setSearchRuleName] = useState('');

  const dbTypeOptions: SelectProps['options'] = useMemo(() => {
    return driverNameList.map((v: string) => ({
      label: v,
      value: v
    }));
  }, [driverNameList]);

  const changeDbType = (type: string) => {
    getCustomRuleList(type);
  };

  const DbFilter = () => (
    <CustomSelect
      prefix={t('customRule.filterForm.databaseType')}
      options={dbTypeOptions}
      onChange={changeDbType}
      style={{ width: 200 }}
    />
  );

  useEffect(() => {
    if (activeKey === RuleManagerSegmentedKey.CustomRule) {
      updateDriverNameList();
    }
  }, [activeKey, updateDriverNameList]);

  return {
    searchRuleName,
    DbFilter,
    setSearchRuleName
  };
};

export default useRuleFilterForm;
