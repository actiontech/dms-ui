import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../../testUtils/customRender';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

import { Form } from 'antd';

import SQLStatementForm from '../SQLStatementForm';
import { SQLStatementFormProps } from '../index';

describe('sqle/Order/SQLStatementForm', () => {
  const customRender = (params: Omit<SQLStatementFormProps, 'form'> = {}) => {
    const { result } = renderHooksWithTheme(() => Form.useForm<any>());
    return renderWithTheme(
      <Form>
        <SQLStatementForm form={result.current[0]} {...params} />
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

  it('render snap', () => {
    const { baseElement } = customRender({
      fieldName: 'sql-demo'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render click hideUpdateMybatisFile & isClearFormWhenChangeSqlType', () => {
    const { baseElement } = customRender({
      fieldName: 'sql-demo',
      isClearFormWhenChangeSqlType: true,
      hideUpdateMybatisFile: true
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render change mode for input sqle code', async () => {
    const { baseElement } = customRender({
      fieldName: 'sql-demo'
    });

    fireEvent.click(screen.getByText('输入SQL语句'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render change mode for upload sqle file', async () => {
    const { baseElement } = customRender({
      fieldName: 'sql-demo'
    });

    fireEvent.click(screen.getByText('上传SQL文件'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });
});
