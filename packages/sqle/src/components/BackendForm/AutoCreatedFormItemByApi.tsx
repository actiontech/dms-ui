import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';

import { BackendFormProps } from '.';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import { BasicInput, BasicSwitch } from '@actiontech/shared';

const AutoCreatedFormItemByApi = (props: BackendFormProps) => {
  const { t } = useTranslation();

  const { paramsKey = 'params', isFullLine } = props;

  const formItemLayoutVal = useMemo(() => {
    if (isFullLine) {
      return formItemLayout.fullLine;
    }
    return formItemLayout.spaceBetween;
  }, [isFullLine]);

  /**
    ep-扫描任务:
    采集周期（分钟，仅对 mysql.slow_log 有效）
    启动任务时拉取慢日志时间范围(单位:小时,最大31天)
    采集来源。0：mysql-slow.log 文件；1：mysql.slow_log 表
  */
  const turnLabelData = (text: string) => {
    if (!text) {
      return {
        label: '',
        labelTip: ''
      };
    }
    const matchBracketEng = text.match(/([^)]*?)\((.*?)\)/);
    if (matchBracketEng && matchBracketEng.length > 1) {
      return {
        label: matchBracketEng[1],
        labelTip: matchBracketEng[2] ?? ''
      };
    }
    const matchBracketCh = text.match(/(.*?)（(.*?)）/);
    if (matchBracketCh && matchBracketCh.length > 1) {
      return {
        label: matchBracketCh[1],
        labelTip: matchBracketCh[2] ?? ''
      };
    }
    const hasPeriodLetter = text.includes('。') ? text.split('。') : text;
    if (Array.isArray(hasPeriodLetter) && hasPeriodLetter.length > 1) {
      return {
        label: hasPeriodLetter[0],
        labelTip: hasPeriodLetter[1] ?? ''
      };
    }
    return {
      label: text,
      labelTip: ''
    };
  };

  const formItemData = useMemo(() => {
    return props.params.map((item) => {
      const { label, labelTip } = turnLabelData(item.desc ?? '');
      return {
        ...item,
        label,
        labelTip
      };
    });
  }, [props.params]);

  return (
    <>
      {formItemData.map((item) => {
        const { labelTip, label } = item;
        if (item.type === 'bool') {
          return (
            <FormItemLabel
              key={item.key}
              className={classNames({
                'has-label-tip': !!labelTip
              })}
              label={
                <div className="label-cont-custom">
                  <div>{label}</div>
                  <div hidden={!labelTip} className="tip-content-box">
                    {labelTip}
                  </div>
                </div>
              }
              {...formItemLayoutVal}
              name={[paramsKey, item.key ?? '']}
              valuePropName="checked"
            >
              <BasicSwitch disabled={props.disabled} />
            </FormItemLabel>
          );
        }
        if (item.type === 'int') {
          return (
            <FormItemLabel
              key={item.key}
              className={classNames({
                'has-label-tip': !!labelTip
              })}
              label={
                <div className="label-cont-custom">
                  <div>{label}</div>
                  <div hidden={!labelTip} className="tip-content-box">
                    {labelTip}
                  </div>
                </div>
              }
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
            key={item.key}
            className={classNames({
              'has-label-tip': !!labelTip
            })}
            label={
              <div className="label-cont-custom">
                <div>{label}</div>
                <div hidden={!labelTip} className="tip-content-box">
                  {labelTip}
                </div>
              </div>
            }
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
