import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import SqlAnalyze from '../SqlAnalyze';
import { SQLManageSqlAnalyzeData } from '../../__testData__';

describe('SqlAnalyze/Global-SqlAnalyze', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('render snap when data is loading', async () => {
    const { baseElement } = superRender(
      <SqlAnalyze
        loading={true}
        tableMetas={{}}
        sqlExplain={{}}
        performanceStatistics={{}}
        errorMessage={''}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when errorType is error', async () => {
    const { baseElement } = superRender(
      <SqlAnalyze
        loading={false}
        tableMetas={{}}
        sqlExplain={{}}
        performanceStatistics={{}}
        errorMessage={'mock error info'}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when errorType is info', async () => {
    const { baseElement } = superRender(
      <SqlAnalyze
        loading={false}
        tableMetas={{}}
        sqlExplain={{}}
        performanceStatistics={{}}
        errorType={'info'}
        errorMessage={'mock error info'}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when data is empty', async () => {
    const { baseElement } = superRender(
      <SqlAnalyze
        loading={false}
        tableMetas={{}}
        sqlExplain={{}}
        performanceStatistics={{}}
        errorMessage={''}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when have data', async () => {
    const { baseElement } = superRender(
      <SqlAnalyze
        loading={false}
        tableMetas={SQLManageSqlAnalyzeData.table_metas}
        sqlExplain={SQLManageSqlAnalyzeData.sql_explain}
        performanceStatistics={SQLManageSqlAnalyzeData.performance_statistics}
        errorMessage={''}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
