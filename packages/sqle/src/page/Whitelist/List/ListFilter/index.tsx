import { useCallback } from 'react';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import CustomInput from '@actiontech/shared/lib/components/CustomInput';
import { FilterContainerStyleWrapper } from '@actiontech/shared/lib/components/ActiontechTable/components/style';
import { CustomFilterRangePickerStyleWrapper } from '@actiontech/shared/lib/components/ActiontechTable/components/style';
import dayjs from 'dayjs';
import { RangePickerProps } from 'antd/es/date-picker';
import { useDbServiceDriver } from '@actiontech/shared/lib/global';
import {
  AuditWhitelistListFilterTypeOptions,
  AuditWhitelistRuleScopeFilterOptions,
  AuditWhitelistSqlSourceContentOptions
} from '../../index.data';
import useAuditTaskSelectOptions from '../../../../components/RuleExceptionMatchConditions/hooks/useAuditTaskSelectOptions';
import { AuditWhitelistListFilterValues } from '../buildAuditWhitelistListParams';
import { useDebounceFn } from 'ahooks';
import { getAuditWhitelistV1FilterTypeEnum } from '@actiontech/shared/lib/api/sqle/service/audit_whitelist/index.enum';

type AuditWhitelistListFilterProps = {
  projectName: string;
  filters: AuditWhitelistListFilterValues;
  onFiltersChange: (filters: AuditWhitelistListFilterValues) => void;
  disabled?: boolean;
};

const AuditWhitelistListFilter: React.FC<AuditWhitelistListFilterProps> = ({
  projectName,
  filters,
  onFiltersChange,
  disabled
}) => {
  const { t } = useTranslation();
  const { dbDriverOptions, loading: dbTypeLoading } = useDbServiceDriver();
  const {
    auditTaskTypeOptions,
    getAuditTaskIdOptions,
    auditTaskTypeLoading,
    auditTaskIdLoading
  } = useAuditTaskSelectOptions(projectName);

  const updateFilters = useCallback(
    (partial: Partial<AuditWhitelistListFilterValues>) => {
      onFiltersChange({ ...filters, ...partial });
    },
    [filters, onFiltersChange]
  );

  const { run: debouncedUpdateCreatedBy } = useDebounceFn(
    (value: string) => {
      updateFilters({ filter_created_by: value || undefined });
    },
    { wait: 300 }
  );

  const onCreatedAtChange: RangePickerProps['onChange'] = (values) => {
    updateFilters({
      filter_created_at_from: values?.[0]?.format('YYYY-MM-DDTHH:mm:ssZ'),
      filter_created_at_to: values?.[1]?.format('YYYY-MM-DDTHH:mm:ssZ')
    });
  };

  const isDbTypeDimension =
    filters.filter_type === getAuditWhitelistV1FilterTypeEnum.db_type;
  const isSqlSourceDimension =
    filters.filter_type === getAuditWhitelistV1FilterTypeEnum.sql_source;

  return (
    <FilterContainerStyleWrapper
      size={12}
      align="center"
      wrap
      className="full-width-element"
      style={{
        borderBottom: 'none',
        padding: 0,
        backgroundColor: 'transparent'
      }}
    >
      <Space size={8} align="center">
        <CustomSelect
          prefix={t('ruleException.table.matchMode')}
          suffixIcon={null}
          bordered={false}
          allowClear
          disabled={disabled}
          options={AuditWhitelistListFilterTypeOptions}
          value={filters.filter_type}
          onChange={(value) => {
            updateFilters({
              filter_type: value as string | undefined,
              filter_db_type_value: undefined,
              filter_sql_source_value: undefined
            });
          }}
        />
        {isDbTypeDimension ? (
          <CustomSelect
            prefix={t('ruleException.matchType.db_type')}
            suffixIcon={null}
            bordered={false}
            allowClear
            disabled={disabled}
            loading={dbTypeLoading}
            options={dbDriverOptions}
            value={filters.filter_db_type_value}
            onChange={(value) => {
              updateFilters({
                filter_db_type_value: value as string | undefined
              });
            }}
          />
        ) : null}
        {isSqlSourceDimension ? (
          <CustomSelect
            prefix={t('ruleException.filter.sqlSource')}
            suffixIcon={null}
            bordered={false}
            allowClear
            disabled={disabled}
            options={AuditWhitelistSqlSourceContentOptions}
            value={filters.filter_sql_source_value}
            onChange={(value) => {
              updateFilters({
                filter_sql_source_value:
                  value as AuditWhitelistListFilterValues['filter_sql_source_value']
              });
            }}
          />
        ) : null}
      </Space>

      <Space size={8} align="center">
        <CustomSelect
          prefix={t('ruleException.table.ruleScope')}
          suffixIcon={null}
          bordered={false}
          allowClear
          disabled={disabled}
          options={AuditWhitelistRuleScopeFilterOptions}
          value={filters.filter_rule_scope_mode}
          onChange={(value) => {
            updateFilters({
              filter_rule_scope_mode: value as
                | AuditWhitelistListFilterValues['filter_rule_scope_mode']
                | undefined
            });
          }}
        />
        <CustomInput
          prefix={t('ruleException.filter.ruleName')}
          disabled={disabled}
          onCustomPressEnter={(value) => {
            updateFilters({ filter_rule_name: value || undefined });
          }}
        />
      </Space>

      <Space size={8} align="center">
        <CustomSelect
          prefix={t('ruleException.filter.auditTaskType')}
          suffixIcon={null}
          bordered={false}
          allowClear
          disabled={disabled}
          loading={auditTaskTypeLoading}
          options={auditTaskTypeOptions}
          value={filters.filter_audit_task_type}
          onChange={(value) => {
            updateFilters({
              filter_audit_task_type: value as string | undefined,
              filter_audit_task_id: undefined
            });
          }}
        />
        <CustomSelect
          prefix={t('ruleException.filter.auditTask')}
          suffixIcon={null}
          bordered={false}
          allowClear
          showSearch
          disabled={disabled}
          loading={auditTaskIdLoading}
          options={getAuditTaskIdOptions(filters.filter_audit_task_type)}
          value={filters.filter_audit_task_id}
          onChange={(value) => {
            updateFilters({
              filter_audit_task_id: value as string | undefined
            });
          }}
        />
      </Space>

      <CustomInput
        prefix={t('ruleException.filter.createdBy')}
        disabled={disabled}
        onCustomPressEnter={(value) => {
          updateFilters({ filter_created_by: value || undefined });
        }}
        onChange={(event) => {
          debouncedUpdateCreatedBy(event.target.value);
        }}
      />

      <CustomFilterRangePickerStyleWrapper
        size="small"
        style={{ minWidth: 320 }}
        disabled={disabled}
        disabledDate={(current) => !!current && current > dayjs().endOf('day')}
        onChange={onCreatedAtChange}
        allowClear
        placeholder={[
          t(
            'common.actiontechTable.filterContainer.rangePickerPlaceholderStart'
          ),
          t('common.actiontechTable.filterContainer.rangePickerPlaceholderEnd')
        ]}
        prefix={
          <span className="custom-range-picker-filter-label">
            {t('ruleException.filter.createdAt')}
          </span>
        }
      />
    </FilterContainerStyleWrapper>
  );
};

export default AuditWhitelistListFilter;
