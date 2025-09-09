import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import QueryPlanFlow from '../index';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { mockReactFlow } from '@actiontech/shared/lib/testUtil/mockModule/mockReactFlow';
import { ExecutionPlanType } from '../../../index.type';

describe('QueryPlanFlow', () => {
  const mockQueryPlanDesc = [
    {
      operator: 'Table Scan',
      summary: ['Scanning users table', 'Filter: id > 100'],
      children: [
        {
          operator: 'Index Scan',
          summary: ['Using index idx_users_id'],
          children: []
        }
      ]
    }
  ];

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockReactFlow();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render query plan flow', () => {
    const { baseElement } = superRender(
      <QueryPlanFlow
        queryPlanDesc={mockQueryPlanDesc}
        height={500}
        fitViewTrigger={1}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with planType', () => {
    const { baseElement } = superRender(
      <QueryPlanFlow
        queryPlanDesc={mockQueryPlanDesc}
        planType={ExecutionPlanType.ORIGINAL}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with optimized planType', () => {
    const { baseElement } = superRender(
      <QueryPlanFlow
        queryPlanDesc={mockQueryPlanDesc}
        planType={ExecutionPlanType.OPTIMIZED}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render deeply nested query plan', () => {
    const deeplyNested = [
      {
        operator: 'Root',
        summary: ['Root operation'],
        children: [
          {
            operator: 'Level 1',
            summary: ['First level'],
            children: [
              {
                operator: 'Level 2',
                summary: ['Second level'],
                children: [
                  {
                    operator: 'Level 3',
                    summary: ['Third level'],
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
    const { baseElement } = superRender(
      <QueryPlanFlow queryPlanDesc={deeplyNested} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
