import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import {
  CustomLabelContent,
  FormItemLabel
} from '@actiontech/shared/lib/components/CustomForm';

import { BackendFormProps } from '.';
import { formItemLayout } from '@actiontech/shared/lib/components/CustomForm/style';
import { BasicInput, BasicSelect, BasicSwitch } from '@actiontech/shared';
import useRuleParams from './useRuleParams';
import FormPasswordWithPlaceholder from './FormPasswordWithPlaceholder';

const AutoCreatedFormItemByApi = (props: BackendFormProps) => {
  const { t } = useTranslation();

  const { paramsKey = 'params', isFullLine } = props;

  const formItemLayoutVal = useMemo(() => {
    if (isFullLine) {
      return formItemLayout.fullLine;
    }
    return formItemLayout.spaceBetween;
  }, [isFullLine]);

  const { formItemData } = useRuleParams(props.params);

  return (
    <>
      {formItemData.map((item) => {
        const { labelTip, label } = item;
        if (item.type === 'bool') {
          return (
            <FormItemLabel
              hidden={!!item.hidden}
              key={item.key}
              className={classNames({
                'has-label-tip': !!labelTip
              })}
              label={<CustomLabelContent tips={labelTip} title={label} />}
              {...formItemLayoutVal}
              name={[paramsKey, item.key ?? '']}
              valuePropName="checked"
            >
              <BasicSwitch disabled={props.disabled} />
            </FormItemLabel>
          );
        }

        if (item.type === 'password') {
          return (
            <FormItemLabel
              hidden={!!item.hidden}
              key={item.key}
              className={classNames({
                'has-label-tip': !!labelTip
              })}
              label={<CustomLabelContent tips={labelTip} title={label} />}
              {...formItemLayoutVal}
              name={[paramsKey, item.key ?? '']}
            >
              <FormPasswordWithPlaceholder
                enabled={props.formMode === 'update'}
                disabled={props.disabled}
              />
            </FormItemLabel>
          );
        }

        if (item.enums_value && item.enums_value.length > 0) {
          return (
            <FormItemLabel
              hidden={!!item.hidden}
              key={item.key}
              className={classNames({
                'has-label-tip': !!labelTip
              })}
              label={<CustomLabelContent tips={labelTip} title={label} />}
              {...formItemLayoutVal}
              name={[paramsKey, item.key ?? '']}
            >
              <BasicSelect
                options={item.enums_value.map((v) => ({
                  label: v.desc,
                  value: v.value
                }))}
                disabled={props.disabled}
              />
            </FormItemLabel>
          );
        }

        if (item.type === 'int') {
          return (
            <FormItemLabel
              hidden={!!item.hidden}
              key={item.key}
              className={classNames({
                'has-label-tip': !!labelTip
              })}
              label={<CustomLabelContent tips={labelTip} title={label} />}
              {...formItemLayoutVal}
              name={[paramsKey, item.key ?? '']}
              rules={[
                {
                  pattern: /^\d+$/,
                  message: t('ruleTemplate.editModal.ruleValueTypeOnlyNumber')
                }
              ]}
            >
              <BasicInput disabled={props.disabled} />
            </FormItemLabel>
          );
        }

        return (
          <FormItemLabel
            hidden={!!item.hidden}
            key={item.key}
            className={classNames({
              'has-label-tip': !!labelTip
            })}
            label={<CustomLabelContent tips={labelTip} title={label} />}
            {...formItemLayoutVal}
            name={[paramsKey, item.key ?? '']}
          >
            <BasicInput disabled={props.disabled} />
          </FormItemLabel>
        );
      })}
    </>
  );
};

export default AutoCreatedFormItemByApi;
