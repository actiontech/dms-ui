import { cleanup, renderHook } from '@testing-library/react-hooks';
import { useGetLevelData } from './useGetLevelData';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { sqleLightTheme } from '../../../theme/light';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('useGetLevelData', () => {
  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  test('should get level data normal by level props', async () => {
    const { result } = renderHook(() =>
      useGetLevelData(
        WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn
      )
    );
    expect(result.current.currentLevelData).toStrictEqual({
      color: sqleLightTheme.workflowTemplate.progress.warning,
      percent: 75
    });
    expect(result.current.levelText).toBe('告警(Warning)');
  });

  test('should get default level data by undefined props', async () => {
    const { result } = renderHook(() => useGetLevelData(undefined));
    expect(result.current.currentLevelData).toStrictEqual({
      color: sqleLightTheme.workflowTemplate.progress.remainColor,
      percent: 0
    });
    expect(result.current.levelText).toBe('');
  });
});
