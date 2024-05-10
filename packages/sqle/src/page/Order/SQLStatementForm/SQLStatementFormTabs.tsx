import { Empty } from 'antd';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import {
  SQLStatementFormTabsProps,
  SQLStatementFormTabsRefType
} from './index';
import { BasicSegmented, EmptyBox } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import SQLStatementForm from './SQLStatementForm';

const SQLStatementFormTabs: React.ForwardRefRenderFunction<
  SQLStatementFormTabsRefType,
  SQLStatementFormTabsProps
> = (
  {
    SQLStatementInfo,
    tabsChangeHandle: onChange,
    autoNavigateToLastTab = true,
    ...props
  },
  ref
) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(SQLStatementInfo[0]?.key ?? '');

  const activeIndex = useMemo(() => {
    return SQLStatementInfo.findIndex((v) => v.key === activeKey);
  }, [activeKey, SQLStatementInfo]);

  const tabsChangeHandle = useCallback(
    (tab: string) => {
      onChange?.(tab);
      setActiveKey(tab);
    },
    [onChange]
  );

  useImperativeHandle(
    ref,
    () => ({ activeKey, activeIndex, tabsChangeHandle }),
    [activeIndex, activeKey, tabsChangeHandle]
  );

  useEffect(() => {
    if (autoNavigateToLastTab) {
      setActiveKey(
        (v) => SQLStatementInfo[SQLStatementInfo.length - 1]?.key ?? v ?? ''
      );
    }
  }, [SQLStatementInfo, autoNavigateToLastTab]);

  return (
    <>
      <EmptyBox
        if={SQLStatementInfo.length > 0}
        defaultNode={
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t('order.createOrder.addDataSourceTips')}
          ></Empty>
        }
      >
        <BasicSegmented
          block
          value={activeKey}
          onChange={(v) => tabsChangeHandle(v as string)}
          options={SQLStatementInfo.map((v) => ({
            label: v.instanceSchemaName
              ? `${v.instanceName}-${v.instanceSchemaName}`
              : v.instanceName,
            key: v.key,
            value: v.key
          }))}
          style={{ marginBottom: 16 }}
        />

        {SQLStatementInfo.map((v) => (
          <div key={v.key} hidden={v.key !== activeKey}>
            <SQLStatementForm
              fieldName={v.key}
              sqlStatement={v.sql}
              {...props}
            />
          </div>
        ))}
      </EmptyBox>
    </>
  );
};

export default forwardRef(SQLStatementFormTabs);
