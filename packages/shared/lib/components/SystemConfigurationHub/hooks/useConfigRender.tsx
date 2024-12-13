import { Descriptions, Form, Space } from 'antd';
import { DescriptionsItemProps } from 'antd/lib/descriptions/Item';
import { useBoolean } from 'ahooks';
import { isString } from 'lodash';
import { formItemLayout } from '../../FormCom/style';
import { FormItemLabel } from '../../FormCom';
import {
  SystemConfigFormStyleWrapper,
  SystemConfigReadonlyModeStyleWrapper
} from '../style';
import classNames from 'classnames';

export type RenderReadOnlyElementConfig<T extends Record<string, any>> = {
  data: T;
  columns: ReadOnlyConfigColumnsType<T>;
  modifyFlag: boolean;
};

export type ReadOnlyConfigColumnsType<T extends Record<string, any>> = Array<
  {
    [K in keyof Required<T>]: {
      hidden?: boolean;
      dataIndex: K;
      render?: (val: T[K], record: T) => React.ReactNode;
    } & Omit<DescriptionsItemProps, 'children'>;
  }[keyof Required<T>]
>;

export function renderReadOnlyModeConfig<T extends Record<string, any>>(
  params: RenderReadOnlyElementConfig<T>
) {
  const { data = {} as T, columns, modifyFlag } = params;
  const hasConfig = columns.some((column) => !column.hidden);

  return (
    !modifyFlag &&
    hasConfig && (
      <SystemConfigReadonlyModeStyleWrapper className="system-config-view-wrapper">
        {columns.map(
          (v, index) =>
            !v.hidden && (
              <Descriptions.Item key={index} label={v.label} span={v.span ?? 3}>
                {typeof v.render === 'function' ? (
                  v.render(data[v.dataIndex], data)
                ) : (
                  <>{data[v.dataIndex] || '--'}</>
                )}
              </Descriptions.Item>
            )
        )}
      </SystemConfigReadonlyModeStyleWrapper>
    )
  );
}

export function useConfigRender<T extends Record<string, any>>({
  switchFieldName,
  switchFieldLabel
}: {
  switchFieldName: keyof T;
  switchFieldLabel: string | React.ReactNode;
}) {
  const [modifyFlag, { setTrue: startModify, setFalse: modifyFinish }] =
    useBoolean(false);
  const [
    extraButtonsVisible,
    { setTrue: showExtraButtons, setFalse: hideExtraButtons }
  ] = useBoolean();
  const [form] = Form.useForm<T>();

  const enabled = Form.useWatch(switchFieldName, form) as boolean;

  function renderConfigForm<K extends Record<string, any>>({
    data,
    columns,
    configExtraButtons,
    configSwitchNode,
    configField,
    submitButtonField,
    onSubmit
  }: {
    data: K;
    columns: ReadOnlyConfigColumnsType<K>;
    configExtraButtons: React.ReactNode;
    configSwitchNode: React.ReactNode;
    configField: React.ReactNode;
    submitButtonField?: React.ReactNode;
    onSubmit?: (values: T) => void;
  }) {
    return (
      <SystemConfigFormStyleWrapper>
        <Form
          {...formItemLayout.spaceBetween}
          labelAlign={'left'}
          colon={false}
          form={form}
          onFinish={onSubmit}
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
              className={classNames({
                'has-label-tip': !isString(switchFieldLabel)
              })}
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
        {renderReadOnlyModeConfig({ data, columns, modifyFlag })}
      </SystemConfigFormStyleWrapper>
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
