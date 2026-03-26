import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import ProbabilityDisplay from '../ProbabilityDisplay';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('ProbabilityDisplay', () => {
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render with resolved status and positive improvement rate', () => {
    const { baseElement } = superRender(
      <ProbabilityDisplay
        analysis={{
          improvement_rate: 0.15,
          state: 'success'
        }}
        optimizationDetailStatus={OptimizationSQLDetailStatusEnum.finish}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render "Best" when improvement rate is zero', () => {
    const { baseElement } = superRender(
      <ProbabilityDisplay
        analysis={{
          improvement_rate: 0,
          state: 'success'
        }}
        optimizationDetailStatus={OptimizationSQLDetailStatusEnum.finish}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render "Best" when improvement rate is negative', () => {
    const { baseElement } = superRender(
      <ProbabilityDisplay
        analysis={{
          improvement_rate: -0.05,
          state: 'success'
        }}
        optimizationDetailStatus={OptimizationSQLDetailStatusEnum.finish}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render "NULL" when result status is not resolved', () => {
    const { baseElement } = superRender(
      <ProbabilityDisplay
        analysis={{
          improvement_rate: 0.15,
          state: 'success'
        }}
        optimizationDetailStatus={OptimizationSQLDetailStatusEnum.failed}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render "NULL" when analysis state is failed', () => {
    const { baseElement } = superRender(
      <ProbabilityDisplay
        analysis={{
          improvement_rate: 0.15,
          state: 'failed'
        }}
        optimizationDetailStatus={OptimizationSQLDetailStatusEnum.finish}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with undefined analysis', () => {
    const { baseElement } = superRender(
      <ProbabilityDisplay
        analysis={undefined}
        optimizationDetailStatus={OptimizationSQLDetailStatusEnum.finish}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with undefined improvement_rate', () => {
    const { baseElement } = superRender(
      <ProbabilityDisplay
        analysis={{
          improvement_rate: undefined,
          state: 'success'
        }}
        optimizationDetailStatus={OptimizationSQLDetailStatusEnum.finish}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with high improvement rate', () => {
    const { baseElement } = superRender(
      <ProbabilityDisplay
        analysis={{
          improvement_rate: 0.856789,
          state: 'success'
        }}
        optimizationDetailStatus={OptimizationSQLDetailStatusEnum.finish}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
