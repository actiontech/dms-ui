import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import SqlOptimizationCard from '../SqlOptimizationCard';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('SqlOptimizationCard', () => {
  const mockChildren = <div>Test Content</div>;
  const mockExtra = <button>Extra Button</button>;

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render with normal content', () => {
    const { baseElement } = superRender(
      <SqlOptimizationCard title="Test Title" extra={mockExtra}>
        {mockChildren}
      </SqlOptimizationCard>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with custom className', () => {
    const { baseElement } = superRender(
      <SqlOptimizationCard
        title="Test Title"
        className="custom-class"
        extra={mockExtra}
      >
        {mockChildren}
      </SqlOptimizationCard>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render empty state when isEmpty is true', () => {
    const { baseElement } = superRender(
      <SqlOptimizationCard title="Test Title" isEmpty={true} extra={mockExtra}>
        {mockChildren}
      </SqlOptimizationCard>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render optimizing state when optimizationStatus is optimizing', () => {
    const { baseElement } = superRender(
      <SqlOptimizationCard
        title="Test Title"
        optimizationStatus={OptimizationSQLDetailStatusEnum.optimizing}
        extra={mockExtra}
      >
        {mockChildren}
      </SqlOptimizationCard>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render error state when errorMessage is provided', () => {
    const { baseElement } = superRender(
      <SqlOptimizationCard
        title="Test Title"
        errorMessage="Something went wrong"
        extra={mockExtra}
      >
        {mockChildren}
      </SqlOptimizationCard>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render error state when both isEmpty and errorMessage are provided', () => {
    const { baseElement } = superRender(
      <SqlOptimizationCard
        title="Test Title"
        isEmpty={true}
        errorMessage="Error occurred"
        extra={mockExtra}
      >
        {mockChildren}
      </SqlOptimizationCard>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should not render extra when errorMessage is provided', () => {
    const { baseElement } = superRender(
      <SqlOptimizationCard
        title="Test Title"
        errorMessage="Error"
        extra={mockExtra}
      >
        {mockChildren}
      </SqlOptimizationCard>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render without extra prop', () => {
    const { baseElement } = superRender(
      <SqlOptimizationCard title="Test Title">
        {mockChildren}
      </SqlOptimizationCard>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
