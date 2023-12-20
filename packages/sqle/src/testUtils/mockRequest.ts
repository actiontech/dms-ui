import { AxiosResponse } from 'axios';
import ruleTemplate from '@actiontech/shared/lib/api/sqle/service/rule_template';
import configuration from '@actiontech/shared/lib/api/sqle/service/configuration';
import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import { driverMeta } from '../hooks/useDatabaseType/index.test.data';

export const successData = (data: any, otherData?: any) => {
  return {
    code: 0,
    message: '',
    data,
    ...otherData
  };
};

export const failedData = (data?: any, otherData?: any) => {
  return {
    code: 100,
    message: 'error',
    data,
    ...otherData
  };
};

export const resolveImmediately = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return Promise.resolve({
    status,
    headers,
    config,
    statusText,
    data: successData(data)
  });
};

export const rejectImmediately = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return Promise.reject({
    status,
    headers,
    config,
    statusText,
    data: failedData(data)
  });
};

export const resolveThreeSecond = (
  data: any,
  {
    status = 200,
    headers = {},
    config = {},
    statusText = '',
    otherData = {}
  } = {}
) => {
  return new Promise<AxiosResponse<any>>((res) => {
    setTimeout(() => {
      res({
        status,
        headers,
        config,
        statusText,
        data: successData(data, otherData)
      });
    }, 3000);
  });
};

export const resolveErrorThreeSecond = (
  data: any,
  {
    status = 200,
    headers = {},
    config = {},
    statusText = '',
    otherData = {}
  } = {}
) => {
  return new Promise<AxiosResponse<any>>((res) => {
    setTimeout(() => {
      res({
        status,
        headers,
        config,
        statusText,
        data: failedData(data, otherData)
      });
    }, 3000);
  });
};

export const rejectThreeSecond = (
  data: any,
  { status = 200, headers = {}, config = {}, statusText = '' } = {}
) => {
  return new Promise<AxiosResponse<any>>((_, rej) => {
    setTimeout(() => {
      rej({
        status,
        headers,
        config,
        statusText,
        data: failedData(data)
      });
    }, 3000);
  });
};

export const mockDriver = () => {
  const spy = jest.spyOn(configuration, 'getDriversV2');
  spy.mockImplementation(() => resolveThreeSecond(driverMeta));
  return spy;
};

export const AuditPlanTypesData = [
  { type: 'default', desc: '自定义', instance_type: '' },
  { type: 'mysql_slow_log', desc: '慢日志', instance_type: 'MySQL' },
  { type: 'mysql_mybatis', desc: 'Mybatis 扫描', instance_type: 'MySQL' },
  { type: 'mysql_schema_meta', desc: '库表元数据', instance_type: 'MySQL' },
  {
    type: 'ali_rds_mysql_slow_log',
    desc: '阿里RDS MySQL慢日志',
    instance_type: 'MySQL'
  },
  {
    type: 'ali_rds_mysql_audit_log',
    desc: '阿里RDS MySQL审计日志',
    instance_type: 'MySQL'
  },
  { type: 'oracle_top_sql', desc: 'Oracle TOP SQL', instance_type: 'Oracle' },
  { type: 'all_app_extract', desc: '应用程序SQL抓取', instance_type: '' },
  { type: 'tidb_audit_log', desc: 'TiDB审计日志', instance_type: 'TiDB' },
  {
    type: 'ocean_base_for_mysql_mybatis',
    desc: 'Mybatis 扫描',
    instance_type: ''
  },
  { type: 'ocean_base_for_mysql_top_sql', desc: 'Top SQL', instance_type: '' }
];
export const mockUseAuditPlanTypes = () => {
  const spy = jest.spyOn(audit_plan, 'getAuditPlanTypesV1');
  spy.mockImplementation(() => resolveThreeSecond(AuditPlanTypesData));
  return spy;
};

export const mockUseRuleType = () => {
  const spy = jest.spyOn(ruleTemplate, 'getRuleTypeByDBTypeV1');
  spy.mockImplementation(() =>
    resolveThreeSecond([
      {
        rule_count: 0,
        rule_type: 'DML1'
      },
      {
        rule_count: 3,
        rule_type: 'DML2'
      }
    ])
  );

  return spy;
};
