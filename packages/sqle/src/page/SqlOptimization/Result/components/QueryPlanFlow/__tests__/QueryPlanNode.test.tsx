import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import QueryPlanNode from '../QueryPlanNode';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { mockReactFlow } from '@actiontech/shared/lib/testUtil/mockModule/mockReactFlow';
import { fireEvent, screen, act } from '@testing-library/react';
import { ExecutionPlanType } from '../../../index.type';
import type { Node, NodeProps } from '@xyflow/react';
import { QueryPlanNodeData } from '../index.type';

describe('QueryPlanNode', () => {
  const mockNodeData = {
    detail: {
      operator: 'Table Scan',
      summary: ['Scanning users table', 'Filter: id > 100'],
      children: []
    },
    level: 0,
    hasChildren: false,
    isRootNode: true,
    nodeIndex: 1
  };

  const mockNodeProps = {
    data: mockNodeData,
    isConnectable: true,
    id: 'test-node'
  } as unknown as NodeProps<Node<QueryPlanNodeData>>;

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

  it('should render root node with basic data', () => {
    const { baseElement } = superRender(<QueryPlanNode {...mockNodeProps} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with original plan type', () => {
    const propsWithPlanType = {
      ...mockNodeProps,
      data: {
        ...mockNodeData,
        planType: ExecutionPlanType.ORIGINAL
      }
    };
    const { baseElement } = superRender(
      <QueryPlanNode {...propsWithPlanType} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with optimized plan type', () => {
    const propsWithPlanType = {
      ...mockNodeProps,
      data: {
        ...mockNodeData,
        planType: ExecutionPlanType.OPTIMIZED
      }
    };
    const { baseElement } = superRender(
      <QueryPlanNode {...propsWithPlanType} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should toggle expand/collapse when clicked', async () => {
    superRender(<QueryPlanNode {...mockNodeProps} />);

    const operatorRow = screen.getByText('Table Scan').closest('.operator-row');

    expect(screen.getByText(/Scanning users table/)).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(operatorRow!);
      jest.advanceTimersByTime(100);
    });

    expect(screen.queryByText(/Scanning users table/)).not.toBeInTheDocument();

    // Click to expand again
    await act(async () => {
      fireEvent.click(operatorRow!);
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByText(/Scanning users table/)).toBeInTheDocument();
  });

  it('should render without nodeIndex', () => {
    const propsWithoutIndex = {
      ...mockNodeProps,
      data: {
        ...mockNodeData,
        nodeIndex: undefined
      }
    };
    const { baseElement } = superRender(
      <QueryPlanNode {...propsWithoutIndex} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with multiline summary data', () => {
    const multilineData = {
      ...mockNodeData,
      detail: {
        operator: 'Complex Join',
        summary: [
          'First line of operation',
          'Second line with details',
          'Third line with more info'
        ],
        children: []
      }
    };
    const propsWithMultilineData = {
      ...mockNodeProps,
      data: multilineData
    };
    const { baseElement } = superRender(
      <QueryPlanNode {...propsWithMultilineData} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
