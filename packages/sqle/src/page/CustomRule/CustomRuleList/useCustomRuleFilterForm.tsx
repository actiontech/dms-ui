import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectProps } from 'antd';
import useDatabaseType from '../../../hooks/useDatabaseType';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';

const useRuleFilterForm = (
  getCustomRuleList: (dbType: string, ruleName: string) => void
) => {
  const { t } = useTranslation();
  const { updateDriverNameList, driverNameList } = useDatabaseType();
  const [dbType, setDbType] = useState('');
  const [ruleName, setRuleName] = useState('');

  const dbTypeOptions: SelectProps['options'] = useMemo(() => {
    return driverNameList.map((v: string) => ({
      label: v,
      value: v
    }));
  }, [driverNameList]);

  const changeDbType = (type: string) => {
    setDbType(type);
    getCustomRuleList(type, ruleName);
  };
  const ruleNameSearch = (name: string) => {
    setRuleName(name);
    getCustomRuleList(dbType, name);
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
    updateDriverNameList();
  }, [updateDriverNameList]);

  return {
    DbFilter,
    ruleNameSearch
  };
};

export default useRuleFilterForm;
