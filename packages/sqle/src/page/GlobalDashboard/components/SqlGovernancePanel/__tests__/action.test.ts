import { sqlGovernancePanelTableActions } from '../action';
import { GlobalSqlManageTaskItemV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('GlobalDashboard/SqlGovernancePanel/action', () => {
  const pendingRecord = {
    status: GlobalSqlManageTaskItemV2StatusEnum.unhandled
  };
  const solvedRecord = { status: GlobalSqlManageTaskItemV2StatusEnum.solved };

  it('should call optimize callback and enable optimize permission', () => {
    const onOptimize = jest.fn();
    const onDetail = jest.fn();
    const actions = sqlGovernancePanelTableActions(onOptimize, onDetail);
    const event = { stopPropagation: jest.fn() };
    const optimizeBtn = actions.buttons?.[0];

    optimizeBtn?.buttonProps?.(pendingRecord as any).onClick?.(event as any);

    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    expect(onOptimize).toHaveBeenCalledWith(pendingRecord);
    expect(optimizeBtn?.permissions?.(pendingRecord as any)).toBe(true);
  });

  it('should call detail callback and enable detail permission', () => {
    const onOptimize = jest.fn();
    const onDetail = jest.fn();
    const actions = sqlGovernancePanelTableActions(onOptimize, onDetail);
    const event = { stopPropagation: jest.fn() };
    const detailBtn = actions.buttons?.[1];

    detailBtn?.buttonProps?.(solvedRecord as any).onClick?.(event as any);

    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    expect(onDetail).toHaveBeenCalledWith(solvedRecord);
    expect(detailBtn?.permissions?.(solvedRecord as any)).toBe(true);
  });
});
