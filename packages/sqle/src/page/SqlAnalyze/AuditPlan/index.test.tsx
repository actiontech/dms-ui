import { act, fireEvent } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import AuditPlanSqlAnalyze from '.';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond
} from '../../../testUtils/mockRequest';
import { AuditPlanSqlAnalyzeData } from '../__testData__';
import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ignoreComponentAutoCreatedListNoKey } from '@actiontech/shared/lib/testUtil/common';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useParams: jest.fn()
  };
});

const projectName = 'default';

describe('SqlAnalyze/AuditPlan', () => {
  ignoreComponentAutoCreatedListNoKey();

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    useParamsMock.mockReturnValue({
      reportId: 'reportId1',
      sqlNum: '123',
      projectName,
      auditPlanName: 'api_test_1'
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetAnalyzeData = () => {
    const spy = jest.spyOn(audit_plan, 'getAuditPlantAnalysisDataV2');
    spy.mockImplementation(() => resolveThreeSecond(AuditPlanSqlAnalyzeData));
    return spy;
  };

  test('should get analyze data from origin', async () => {
    const spy = mockGetAnalyzeData();
    const { container, baseElement } = renderWithReduxAndTheme(
      <AuditPlanSqlAnalyze />,
      undefined,
      {
        user: {
          bindProjects: [
            {
              project_id: '',
              project_name: projectName
            }
          ]
        } as any
      }
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      project_name: projectName,
      audit_plan_report_id: 'reportId1',
      number: '123',
      audit_plan_name: 'api_test_1'
    });
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3500));

    fireEvent.click(getAllBySelector('.ant-segmented-item', baseElement)[1]);
    fireEvent.click(getAllBySelector('.ant-segmented-item', baseElement)[2]);
    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();
  });

  test('should render error result of type "info" when response code is 8001', async () => {
    const spy = mockGetAnalyzeData();
    spy.mockImplementation(() =>
      resolveErrorThreeSecond(AuditPlanSqlAnalyzeData, {
        otherData: {
          code: 8001
        }
      })
    );
    const { container } = renderWithReduxAndTheme(
      <AuditPlanSqlAnalyze />,
      undefined,
      {
        user: {
          bindProjects: [
            {
              project_id: '',
              project_name: projectName
            }
          ]
        } as any
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  test('should render error result of type "error" when response code is not 8001', async () => {
    const spy = mockGetAnalyzeData();
    spy.mockImplementation(() =>
      resolveErrorThreeSecond(AuditPlanSqlAnalyzeData, {
        otherData: {
          code: 8000
        }
      })
    );
    const { container } = renderWithReduxAndTheme(
      <AuditPlanSqlAnalyze />,
      undefined,
      {
        user: {
          bindProjects: [
            {
              project_id: '',
              project_name: projectName
            }
          ]
        } as any
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });
});
