import { cleanup, act, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../../testUtils/customRender';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

import { Form } from 'antd';

import SQLStatementFormTabs from '../SQLStatementFormTabs';
import { SQLStatementInfoType } from '..';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/Order/SQLStatementFormTabs', () => {
  const tabsChangeHandleFn = jest.fn();
  const customRender = (params: SQLStatementInfoType[] = []) => {
    const { result } = renderHooksWithTheme(() => Form.useForm<any>());
    return renderWithTheme(
      <Form>
        <SQLStatementFormTabs
          form={result.current[0]}
          SQLStatementInfo={params}
          tabsChangeHandle={tabsChangeHandleFn}
        />
      </Form>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render when SQLStatementInfo data is empty', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has SQLStatementInfo', async () => {
    const { baseElement } = customRender([
      {
        instanceSchemaName: 'schema name',
        instanceName: 'instance name a',
        key: 'statement 1'
      },
      {
        instanceName: 'instance name b',
        key: 'statement 2'
      }
    ]);
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(getBySelector('div[title="instance name b"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });
});
