import { Empty } from 'antd';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo
} from 'react';
import {
  SQLStatementFormTabsProps,
  SQLStatementFormTabsRefType
} from './index';
import { BasicSegmented, EmptyBox } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import SQLStatementForm from './SQLStatementForm';
import { useControllableValue } from 'ahooks';

const SQLStatementFormTabs: React.ForwardRefRenderFunction<
  SQLStatementFormTabsRefType,
  SQLStatementFormTabsProps
> = (
  {
    SQLStatementInfo,
    tabsChangeHandle: onChange,
    autoNavigateToLastTab = true,
    activeKey: key,
    defaultActiveKey,
    ...props
  },
  ref
) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useControllableValue<string>(
    typeof key !== 'undefined' && onChange
      ? {
          value: key,
          onChange: onChange,
          defaultValue: defaultActiveKey
        }
      : { onChange: onChange, defaultValue: defaultActiveKey }
  );

  const activeIndex = useMemo(() => {
    return SQLStatementInfo.findIndex((v) => v.key === activeKey);
  }, [activeKey, SQLStatementInfo]);

  const tabsChangeHandle = useCallback(
    (tab: string) => {
      onChange?.(tab);
      setActiveKey(tab);
    },
    [onChange, setActiveKey]
  );

  /**
   * 作茧自缚的 ref 设计
   * 通过 ref 获取 activeKey 或者 index 无法满足 tab 切换后引发重渲染。。
   * 重构需要改掉。
   */
  useImperativeHandle(
    ref,
    () => ({ activeKey, activeIndex, tabsChangeHandle }),
    [activeIndex, activeKey, tabsChangeHandle]
  );

  useEffect(() => {
    if (autoNavigateToLastTab) {
      tabsChangeHandle(
        SQLStatementInfo[SQLStatementInfo.length - 1]?.key ?? ''
      );
    }
  }, [SQLStatementInfo, autoNavigateToLastTab, tabsChangeHandle]);

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
