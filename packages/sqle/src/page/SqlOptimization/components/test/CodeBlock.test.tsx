import CodeBlock from '../CodeBlock';
import { cleanup, fireEvent, act } from '@testing-library/react';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/SqlOptimization/CodeBlock', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (code = '1123123') => {
    return sqleSuperRender(<CodeBlock code={code} />);
  };

  it('render snap shot', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render copy code', async () => {
    const execCommandFn = jest.fn();
    document.execCommand = execCommandFn;
    const { baseElement } = customRender();
    expect(getBySelector('.anticon-copy')).toBeInTheDocument();
    fireEvent.click(getBySelector('.anticon-copy'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(baseElement).toMatchSnapshot();
    execCommandFn.mockRestore();
  });
});
