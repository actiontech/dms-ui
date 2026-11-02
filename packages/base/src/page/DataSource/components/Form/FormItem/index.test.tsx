import { baseSuperRender } from '../../../../../testUtils/superRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';

import { Form, Select } from 'antd';
import { BackendFormItemParams } from '@actiontech/shared';
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

const REDIS_USER_TIP = '仅 Redis 6+ ACL 需要；Redis 5.x 请留空';

describe('page/DataSource/DatabaseFormItem', () => {
  const mockSetFieldsForm = jest.fn();
  const mockSetFields = jest.fn();
  const databaseTypeChangeFn = jest.fn();
  const generateDriverSelectOptionsFn = jest
    .fn()
    .mockReturnValue([
      <Select.Option value="mysql">mysql</Select.Option>,
      <Select.Option value="mysql">ob</Select.Option>
    ]);

  const customRender = (
    isUpdate = false,
    currentAsyncParams = [] as BackendFormItemParams[]
  ) => {
    const mockedForm = {
      setFieldsValue: mockSetFieldsForm,
      setFields: mockSetFields
    };
    (Form.useForm as jest.Mock).mockReturnValue([mockedForm]);
    return baseSuperRender(
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

  it('add mode password is required', async () => {
    const { baseElement } = customRender(false);
    const passwordInput = getBySelector('#password', baseElement);
    const passwordFormItem = passwordInput.closest('.ant-form-item');
    expect(passwordInput).toHaveAttribute('aria-required', 'true');
    expect(passwordFormItem).toHaveClass('has-required-style');
    expect(
      passwordFormItem?.querySelector('label.ant-form-item-required')
    ).not.toBeNull();
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

  describe('Redis user field SPEC-UI', () => {
    const actualUseForm = jest.requireActual('antd').Form.useForm;

    const renderWithInitial = (initialValues: Record<string, unknown>) => {
      (Form.useForm as jest.Mock).mockImplementation(actualUseForm);
      const Wrapper = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} initialValues={initialValues}>
            <DatabaseFormItem
              form={form}
              isUpdate={false}
              databaseTypeChange={databaseTypeChangeFn}
              generateDriverSelectOptions={generateDriverSelectOptionsFn}
              updateDriverListLoading={false}
              currentAsyncParams={[]}
              isExternalInstance={false}
            />
          </Form>
        );
      };
      return baseSuperRender(<Wrapper />);
    };

    it('SPEC-UI-01 Redis standalone user not required', async () => {
      const { baseElement } = renderWithInitial({
        type: 'Redis',
        connectionMode: 'standalone'
      });
      await act(async () => jest.advanceTimersByTime(0));
      const userInput = getBySelector('#user', baseElement);
      const userFormItem = userInput.closest('.ant-form-item');
      expect(userInput).not.toHaveAttribute('aria-required', 'true');
      expect(userFormItem).not.toHaveClass('has-required-style');
      expect(userFormItem).toHaveClass('has-label-tip');
    });

    it('SPEC-UI-02 Redis shows ACL tip', async () => {
      renderWithInitial({
        type: 'Redis',
        connectionMode: 'standalone'
      });
      await act(async () => jest.advanceTimersByTime(0));
      expect(screen.getByText(REDIS_USER_TIP)).toBeInTheDocument();
    });

    it('SPEC-UI-03 non-Redis user required without ACL tip', async () => {
      const { baseElement } = renderWithInitial({ type: 'MySQL' });
      await act(async () => jest.advanceTimersByTime(0));
      const userInput = getBySelector('#user', baseElement);
      const userFormItem = userInput.closest('.ant-form-item');
      expect(userInput).toHaveAttribute('aria-required', 'true');
      expect(userFormItem).toHaveClass('has-required-style');
      expect(screen.queryByText(REDIS_USER_TIP)).not.toBeInTheDocument();
    });

    it('SPEC-UI-04 Redis cluster user not required', async () => {
      const { baseElement } = renderWithInitial({
        type: 'Redis',
        connectionMode: 'cluster'
      });
      await act(async () => jest.advanceTimersByTime(0));
      const userInput = getBySelector('#user', baseElement);
      const userFormItem = userInput.closest('.ant-form-item');
      expect(userInput).not.toHaveAttribute('aria-required', 'true');
      expect(userFormItem).not.toHaveClass('has-required-style');
      expect(screen.getByText(REDIS_USER_TIP)).toBeInTheDocument();
    });

    it('SPEC-UI-05 switch type clears Redis tip / restores required', async () => {
      (Form.useForm as jest.Mock).mockImplementation(actualUseForm);
      let formRef: ReturnType<typeof Form.useForm>[0] | undefined;
      const Wrapper = () => {
        const [form] = Form.useForm();
        formRef = form;
        return (
          <Form form={form} initialValues={{ type: 'MySQL' }}>
            <DatabaseFormItem
              form={form}
              isUpdate={false}
              databaseTypeChange={databaseTypeChangeFn}
              generateDriverSelectOptions={generateDriverSelectOptionsFn}
              updateDriverListLoading={false}
              currentAsyncParams={[]}
              isExternalInstance={false}
            />
          </Form>
        );
      };
      const { baseElement } = baseSuperRender(<Wrapper />);
      await act(async () => jest.advanceTimersByTime(0));
      expect(screen.queryByText(REDIS_USER_TIP)).not.toBeInTheDocument();

      await act(async () => {
        formRef?.setFieldsValue({
          type: 'Redis',
          connectionMode: 'standalone'
        });
      });
      await act(async () => jest.advanceTimersByTime(0));
      expect(screen.getByText(REDIS_USER_TIP)).toBeInTheDocument();
      expect(getBySelector('#user', baseElement)).not.toHaveAttribute(
        'aria-required',
        'true'
      );

      await act(async () => {
        formRef?.setFieldsValue({ type: 'MySQL' });
      });
      await act(async () => jest.advanceTimersByTime(0));
      expect(screen.queryByText(REDIS_USER_TIP)).not.toBeInTheDocument();
      expect(getBySelector('#user', baseElement)).toHaveAttribute(
        'aria-required',
        'true'
      );
    });

    it('SPEC-UI-06 Redis mode switch keeps user optional and tip', async () => {
      (Form.useForm as jest.Mock).mockImplementation(actualUseForm);
      let formRef: ReturnType<typeof Form.useForm>[0] | undefined;
      const Wrapper = () => {
        const [form] = Form.useForm();
        formRef = form;
        return (
          <Form
            form={form}
            initialValues={{ type: 'Redis', connectionMode: 'standalone' }}
          >
            <DatabaseFormItem
              form={form}
              isUpdate={false}
              databaseTypeChange={databaseTypeChangeFn}
              generateDriverSelectOptions={generateDriverSelectOptionsFn}
              updateDriverListLoading={false}
              currentAsyncParams={[]}
              isExternalInstance={false}
            />
          </Form>
        );
      };
      const { baseElement } = baseSuperRender(<Wrapper />);
      await act(async () => jest.advanceTimersByTime(0));
      expect(screen.getByText(REDIS_USER_TIP)).toBeInTheDocument();

      await act(async () => {
        formRef?.setFieldsValue({ connectionMode: 'cluster' });
      });
      await act(async () => jest.advanceTimersByTime(0));
      expect(getBySelector('#user', baseElement)).not.toHaveAttribute(
        'aria-required',
        'true'
      );
      expect(screen.getByText(REDIS_USER_TIP)).toBeInTheDocument();

      await act(async () => {
        formRef?.setFieldsValue({ connectionMode: 'standalone' });
      });
      await act(async () => jest.advanceTimersByTime(0));
      expect(getBySelector('#user', baseElement)).not.toHaveAttribute(
        'aria-required',
        'true'
      );
      expect(screen.getByText(REDIS_USER_TIP)).toBeInTheDocument();
    });
  });
});
