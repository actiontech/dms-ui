import { Empty } from 'antd';
import SqlStatementFormItem from '../SqlStatementFormItem';
import { SqlStatementFormItemProps } from '../SqlStatementFormItem/index.type';
import { useControllableValue } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { BasicSegmented, EmptyBox } from '@actiontech/shared';
import { SAME_SQL_MODE_DEFAULT_FIELD_KEY } from '../SqlStatementFormItem/index.data';

type SqlStatementFormControllerProps = Omit<
  SqlStatementFormItemProps,
  'fieldPrefixPath'
> & {
  activeKey?: string;
  onChange?: (activeKey: string) => void;
  defaultActiveKey?: string;
  isSameSqlForAll: boolean;
  databaseInfo: Array<{
    key: string;
    instanceName: string | undefined;
    schemaName: string | undefined;
  }>;
};

const SqlStatementFormController: React.FC<SqlStatementFormControllerProps> = ({
  isSameSqlForAll,
  databaseInfo,
  ...props
}) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useControllableValue<string>(
    typeof props.activeKey !== 'undefined' && props.onChange
      ? {
          value: props.activeKey,
          onChange: props.onChange,
          defaultValue: props.defaultActiveKey
        }
      : { onChange: props.onChange, defaultValue: props.defaultActiveKey }
  );

  const render = () => {
    if (isSameSqlForAll) {
      return (
        <SqlStatementFormItem
          fieldPrefixPath={SAME_SQL_MODE_DEFAULT_FIELD_KEY}
          {...props}
        />
      );
    }
    return (
      <EmptyBox
        if={databaseInfo?.length > 0}
        defaultNode={
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={t('execWorkflow.create.form.sqlInfo.addInstanceTips')}
          />
        }
      >
        <BasicSegmented
          block
          value={activeKey}
          onChange={(v) => {
            setActiveKey(v as string);
          }}
          options={databaseInfo?.map((v) => ({
            label: v.schemaName
              ? `${v.instanceName}-${v.schemaName}`
              : v.instanceName,
            key: v.key,
            value: v.key
          }))}
          style={{ marginBottom: 16 }}
        />

        {databaseInfo?.map((v) => {
          return (
            <div key={v.key} hidden={v.key !== activeKey}>
              <SqlStatementFormItem fieldPrefixPath={v.key} {...props} />
            </div>
          );
        })}
      </EmptyBox>
    );
  };

  return render();
};

export default SqlStatementFormController;
