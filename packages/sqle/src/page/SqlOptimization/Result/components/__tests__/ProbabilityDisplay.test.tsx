import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import ProbabilityDisplay from '../ProbabilityDisplay';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { OptimizationResultStatus } from '../../index.type';

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
        resultStatus={OptimizationResultStatus.RESOLVED}
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
        resultStatus={OptimizationResultStatus.RESOLVED}
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
        resultStatus={OptimizationResultStatus.RESOLVED}
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
        resultStatus={OptimizationResultStatus.FAILED}
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
        resultStatus={OptimizationResultStatus.RESOLVED}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with undefined analysis', () => {
    const { baseElement } = superRender(
      <ProbabilityDisplay
        analysis={undefined}
        resultStatus={OptimizationResultStatus.RESOLVED}
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
        resultStatus={OptimizationResultStatus.RESOLVED}
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
        resultStatus={OptimizationResultStatus.RESOLVED}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
