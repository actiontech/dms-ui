import { BasicButton, BasicInput } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { FocusEvent, useEffect, useState } from 'react';
import { useBoolean } from 'ahooks';
import { TaskResultDescribeStyleWrapper } from './style';
import { EditFilled } from '@actiontech/icons';

const ResultDescribe: React.FC<{
  value: string;
  onSubmit: (v: string) => void;
}> = ({ value, onSubmit }) => {
  const { t } = useTranslation();

  const [show, { setTrue, setFalse }] = useBoolean();

  const [inputValue, setInputValue] = useState<string>(value);

  const onInputBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value !== value) {
      onSubmit(e.target.value);
    }
    setFalse();
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <TaskResultDescribeStyleWrapper>
      <EditFilled />
      <BasicInput
        className="result-describe-input"
        onBlur={onInputBlur}
        value={inputValue}
        placeholder={t('execWorkflow.audit.table.addDescribe')}
        onFocus={setTrue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      {show ? <BasicButton size="small">{t('common.ok')}</BasicButton> : null}
    </TaskResultDescribeStyleWrapper>
  );
};

export default ResultDescribe;
