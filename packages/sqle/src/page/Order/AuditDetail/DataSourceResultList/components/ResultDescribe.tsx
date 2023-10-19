import { DataSourceResultDescribeStyleWrapper } from '../../style';
import { IconCommonEdit } from '@actiontech/shared/lib/Icon';
import { BasicButton, BasicInput } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { FocusEvent, useEffect, useState } from 'react';
import { useBoolean } from 'ahooks';

const ResultDescribe: React.FC<{
  value: string;
  onSubmit: (v: string) => void;
}> = ({ value, onSubmit }) => {
  const { t } = useTranslation();

  const [show, { setTrue, setFalse }] = useBoolean();

  const [inputValue, setInputValue] = useState<string>(value);

  const onInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    onSubmit(e.target.value);
    setFalse();
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <DataSourceResultDescribeStyleWrapper>
      <IconCommonEdit />
      <BasicInput
        className="result-describe-input"
        onBlur={onInputBlur}
        value={inputValue}
        placeholder={t('audit.table.addDescribe')}
        onFocus={setTrue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      {show ? <BasicButton size="small">{t('common.ok')}</BasicButton> : null}
    </DataSourceResultDescribeStyleWrapper>
  );
};

export default ResultDescribe;
