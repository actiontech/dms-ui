import { FormItem } from './index';
import { useMemo } from 'react';

const useRuleParams = (params: FormItem[]) => {
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
    return params.map((item) => {
      const { label, labelTip } = turnLabelData(item.desc ?? '');
      return {
        ...item,
        label,
        labelTip
      };
    });
  }, [params]);

  return { formItemData };
};

export default useRuleParams;
