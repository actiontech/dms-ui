import { superRender } from '../../../../../testUtils/customRender';
import { act, cleanup, fireEvent } from '@testing-library/react';

import { Form, Select } from 'antd';
import { FormItem } from 'sqle/src/components/BackendForm';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import DatabaseFormItem from '.';

jest.mock('antd', () => {
  const actualAntd = jest.requireActual('antd');
  return {
    ...actualAntd,
    Form: {
      ...actualAntd.Form,
      useForm: jest.fn()
    }
  };
});

describe('page/DataSource/DatabaseFormItem', () => {
  const mockSetFieldsForm = jest.fn();
  const databaseTypeChangeFn = jest.fn();
  const generateDriverSelectOptionsFn = jest
    .fn()
    .mockReturnValue([
      <Select.Option value="mysql">mysql</Select.Option>,
      <Select.Option value="mysql">ob</Select.Option>
    ]);

  const customRender = (
    isUpdate = false,
    currentAsyncParams = [] as FormItem[]
  ) => {
    const mockedForm = {
      setFieldsValue: mockSetFieldsForm
    };
    (Form.useForm as jest.Mock).mockReturnValue([mockedForm]);
    return superRender(
      <Form>
        <DatabaseFormItem
          form={mockedForm as any}
          isUpdate={isUpdate}
          databaseTypeChange={databaseTypeChangeFn}
          generateDriverSelectOptions={generateDriverSelectOptionsFn}
          updateDriverListLoading={false}
          currentAsyncParams={currentAsyncParams}
          isExternalInstance={false}
        />
      </Form>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render form item snap', async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render form item snap when update', async () => {
    const { baseElement } = customRender(true);
    expect(baseElement).toMatchSnapshot();
  });

  it('render async params', async () => {
    const { baseElement } = customRender(false, [
      { desc: 'desc', key: 'c1', type: 'bool' }
    ]);
    expect(baseElement).toMatchSnapshot();
  });

  it('render port validator', async () => {
    const { baseElement } = customRender();

    const portEle = getBySelector('#port', baseElement);

    fireEvent.change(portEle, {
      target: { value: '' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    fireEvent.change(portEle, {
      target: { value: 'admin' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    fireEvent.change(portEle, {
      target: { value: 'admin' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render need pwd', async () => {
    const { baseElement } = customRender(true);

    const needUpdatePassword = getBySelector(
      '#needUpdatePassword',
      baseElement
    );
    fireEvent.change(needUpdatePassword, {
      target: { value: true }
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });
});
