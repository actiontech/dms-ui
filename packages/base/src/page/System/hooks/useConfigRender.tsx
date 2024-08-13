import { Descriptions, Form, Space } from 'antd';
import { DescriptionsItemProps } from 'antd/lib/descriptions/Item';
import { useBoolean } from 'ahooks';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { isString } from 'lodash';

type RenderReadOnlyElementConfig<T> = {
  data: T;
  columns: ReadOnlyConfigColumnsType<T>;
  modifyFlag: boolean;
};

export type ReadOnlyConfigColumnsType<T> = Array<
  {
    hidden?: boolean;
    dataIndex: keyof Required<T>;
    render?: (val: T[keyof T], record: T) => React.ReactNode;
  } & Omit<DescriptionsItemProps, 'children'>
>;

/**
 * @deprecated
 * 使用 shared 中 renderReadOnlyModeConfig 替换
 */
export function renderReadOnlyModeConfig<T>(
  params: RenderReadOnlyElementConfig<T>
) {
  const { data = {} as T, columns, modifyFlag } = params;
  const hasConfig = columns.some((column) => !column.hidden);

  return (
    !modifyFlag &&
    hasConfig && (
      <Descriptions className="desc-wrapper">
        {columns.map(
          (v, index) =>
            !v.hidden && (
              <Descriptions.Item key={index} label={v.label} span={v.span}>
                {typeof v.render === 'function' ? (
                  v.render(data[v.dataIndex], data)
                ) : (
                  <>{data[v.dataIndex] || '--'}</>
                )}
              </Descriptions.Item>
            )
        )}
      </Descriptions>
    )
  );
}

/**
 * @deprecated
 * 使用 shared 中 useConfigRender 替换
 */
function useConditionalConfig<T>({
  switchFieldName,
  switchFieldLabel
}: {
  switchFieldName: keyof T;
  switchFieldLabel: string | React.ReactNode;
}) {
  const [modifyFlag, { setTrue: startModify, setFalse: modifyFinish }] =
    useBoolean();
  const [
    extraButtonsVisible,
    { setTrue: showExtraButtons, setFalse: hideExtraButtons }
  ] = useBoolean();
  const [form] = Form.useForm<T>();

  const enabled = Form.useWatch(switchFieldName, form);

  function renderConfigForm<K>({
    data,
    columns,
    configExtraButtons,
    configSwitchNode,
    configField,
    submitButtonField,
    submit
  }: {
    data: K;
    columns: ReadOnlyConfigColumnsType<K>;
    configExtraButtons: React.ReactNode;
    configSwitchNode: React.ReactNode;
    configField: React.ReactNode;
    submitButtonField?: React.ReactNode;
    submit?: (val: T) => void;
  }) {
    return (
      <>
        <Form
          {...formItemLayout.spaceBetween}
          labelAlign={'left'}
          colon={false}
          form={form}
          onFinish={submit}
        >
          <div
            className="switch-field-wrapper"
            onMouseEnter={() => {
              if (modifyFlag) return;
              showExtraButtons();
            }}
            onMouseLeave={hideExtraButtons}
          >
            <FormItemLabel
              className={isString(switchFieldLabel) ? '' : 'has-label-tip'}
              label={switchFieldLabel}
            >
              <Space size={12} align="center">
                {configExtraButtons}
                {configSwitchNode}
              </Space>
            </FormItemLabel>
          </div>
          <div hidden={!modifyFlag} className="config-field-wrapper">
            {configField}
            {submitButtonField}
          </div>
        </Form>
        <div hidden={modifyFlag}>
          {renderReadOnlyModeConfig({ data, columns, modifyFlag })}
        </div>
      </>
    );
  }

  return {
    modifyFlag,
    startModify,
    modifyFinish,
    extraButtonsVisible,
    renderConfigForm,
    form,
    enabled
  };
}

export default useConditionalConfig;
