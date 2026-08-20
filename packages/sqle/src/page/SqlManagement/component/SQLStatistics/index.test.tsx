import { cleanup, screen } from '@testing-library/react';
import SQLStatistics, { ISQLStatisticsProps } from '.';
import { superRender } from '../../../../testUtils/customRender';

describe('page/SqlManagement/SQLStatistics', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (data: ISQLStatisticsProps) => {
    return superRender(<SQLStatistics {...data} />);
  };

  const staticsData = {
    loading: false,
    errorMessage: undefined,
    data: { SQLTotalNum: 0, problemSQlNum: 0, optimizedSQLNum: 0 }
  };

  it('render when still loading', () => {
    const { baseElement } = customRender({
      ...staticsData,
      loading: true
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render unset placeholder when data is null', () => {
    const { baseElement } = customRender({
      ...staticsData,
      data: {
        SQLTotalNum: null,
        problemSQlNum: null,
        optimizedSQLNum: null
      }
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('—').length).toBe(3);
  });

  it('render statics data', () => {
    const { baseElement } = customRender({
      ...staticsData
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('0').length).toBe(3);
    expect(screen.getByText('SQL总数'));
  });
});
