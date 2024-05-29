import { Empty } from 'antd';
import SqlStatementFormItem from './SqlStatementFormItem';
import { useControllableValue } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { BasicSegmented, EmptyBox } from '@actiontech/shared';
import { SAME_SQL_MODE_DEFAULT_FIELD_KEY } from './SqlStatementFormItem/index.data';
import { SqlStatementFormControllerProps } from './index.type';

const SqlStatementFormController: React.FC<SqlStatementFormControllerProps> = ({
  activeKey: key,
  onChange: changeHandle,
  defaultActiveKey: defaultKey,
  isSupportFileModeExecuteSqlRecord,
  ...props
}) => {
  // #if [ee]
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useControllableValue<string>(
    typeof key !== 'undefined' && changeHandle
      ? {
          value: key,
          onChange: changeHandle,
          defaultValue: defaultKey
        }
      : { onChange: changeHandle, defaultValue: defaultKey }
  );

  const renderEE = () => {
    if (props.isSameSqlForAll) {
      return (
        <SqlStatementFormItem
          fieldPrefixPath={SAME_SQL_MODE_DEFAULT_FIELD_KEY}
          isSupportFileModeExecuteSql={
            !!isSupportFileModeExecuteSqlRecord?.[
              SAME_SQL_MODE_DEFAULT_FIELD_KEY
            ]
          }
          {...props}
        />
      );
    }

    return (
      <EmptyBox
        if={props.databaseInfo?.length > 0}
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
          options={props.databaseInfo?.map((v) => ({
            label: v.schemaName
              ? `${v.instanceName}-${v.schemaName}`
              : v.instanceName,
            key: v.key,
            value: v.key
          }))}
          style={{ marginBottom: 16 }}
        />

        {props.databaseInfo?.map((v) => {
          return (
            <div key={v.key} hidden={v.key !== activeKey}>
              <SqlStatementFormItem
                fieldPrefixPath={v.key}
                isSupportFileModeExecuteSql={
                  !!isSupportFileModeExecuteSqlRecord?.[v.key]
                }
                {...props}
              />
            </div>
          );
        })}
      </EmptyBox>
    );
  };
  // #elif [ce]
  const renderCE = () => {
    return (
      <SqlStatementFormItem
        fieldPrefixPath={SAME_SQL_MODE_DEFAULT_FIELD_KEY}
        isSupportFileModeExecuteSql={
          !!isSupportFileModeExecuteSqlRecord?.[SAME_SQL_MODE_DEFAULT_FIELD_KEY]
        }
        {...props}
      />
    );
  };
  // #endif

  return (
    <>
      {/* #if [ee] */}
      {renderEE()}
      {/* #elif [ce] */}
      {renderCE()}
      {/* #endif */}
    </>
  );
};

export default SqlStatementFormController;
