import { act } from '@testing-library/react';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { FilterCustomProps } from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import instanceAuditPlan from '../../../../testUtils/mockApi/instanceAuditPlan';
import { mockAuditPlanSQLMeta } from '../../../../testUtils/mockApi/instanceAuditPlan/data';
import useLazyFilterTips from './useLazyFilterTips';

const projectName = 'default';
const instanceAuditPlanId = '1';
const auditPlanId = '121343';
const lazyFilterNames = ['rule_name', 'schema_name', 'db_user'];

describe('useLazyFilterTips', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should load every lazy filter with a scalar filter name only once', async () => {
    const getFilterTipsSpy = instanceAuditPlan.getInstanceAuditPlanFilterTips();
    const updateFilterButtonMeta = jest.fn();
    const { result } = renderHooksWithTheme(() =>
      useLazyFilterTips({
        projectName,
        instanceAuditPlanId,
        auditPlanId
      })
    );

    act(() => {
      result.current.buildFilterMetaFromList(
        mockAuditPlanSQLMeta.filter_meta_list ?? [],
        updateFilterButtonMeta
      );
    });

    for (const filterName of lazyFilterNames) {
      await act(async () => {
        const selectProps =
          result.current.dynamicTableFilterMeta?.tableFilterCustomProps?.get(
            filterName
          ) as FilterCustomProps<'select'>;
        selectProps.onDropdownVisibleChange?.(true);
        jest.advanceTimersByTime(3000);
        await Promise.resolve();
      });

      expect(getFilterTipsSpy).toHaveBeenLastCalledWith({
        project_name: projectName,
        instance_audit_plan_id: instanceAuditPlanId,
        audit_plan_id: auditPlanId,
        filter_name: filterName
      });
      expect(
        (
          result.current.dynamicTableFilterMeta?.tableFilterCustomProps?.get(
            filterName
          ) as FilterCustomProps<'select'>
        ).options
      ).not.toHaveLength(0);
    }

    act(() => {
      const ruleSelectProps =
        result.current.dynamicTableFilterMeta?.tableFilterCustomProps?.get(
          'rule_name'
        ) as FilterCustomProps<'select'>;
      ruleSelectProps.onDropdownVisibleChange?.(true);
    });

    expect(getFilterTipsSpy).toHaveBeenCalledTimes(lazyFilterNames.length);
  });
});
