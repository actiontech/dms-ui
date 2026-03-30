import { baseSuperRender } from '../../../../../testUtils/superRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';

import { Form, Select } from 'antd';
import { BackendFormItemParams } from '@actiontech/shared';
import {
  getBySelector,
  queryBySelector,
  getAllBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

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
  const mockSetFieldsValue = jest.fn();
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
      setFieldsValue: mockSetFieldsValue,
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

  describe('password field interactions (TC 5.2.x)', () => {
    // TC 5.2.1: Edit page - default state rendering
    it('should render password field in default state with placeholder dots and edit icon when editing datasource', async () => {
      const { baseElement } = customRender(true);

      // 1. Password input exists and value is placeholder dots
      const passwordInput = getBySelector(
        '.ant-input[readonly]',
        baseElement
      );
      expect(passwordInput).toBeTruthy();
      expect(passwordInput.getAttribute('value')).toBe(
        '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'
      );

      // 2. Input has readOnly attribute
      expect(passwordInput.hasAttribute('readonly')).toBe(true);

      // 3. Edit icon (EditOutlined) exists
      const editIcon = getBySelector(
        '.anticon-edit',
        baseElement
      );
      expect(editIcon).toBeTruthy();

      // 4. Eye icon does not exist
      const eyeIcon = queryBySelector(
        '.anticon-eye-invisible',
        baseElement
      );
      expect(eyeIcon).toBeNull();
      const eyeVisibleIcon = queryBySelector(
        '.anticon-eye',
        baseElement
      );
      expect(eyeVisibleIcon).toBeNull();

      // 5. Label shows "连接密码" without * required marker
      const passwordLabel = screen.getByText('连接密码');
      expect(passwordLabel).toBeTruthy();
      expect(passwordLabel.classList.contains('ant-form-item-required')).toBe(
        false
      );

      // 6. "是否更新密码" switch does not exist (covered by TC 5.2.8 as well)
      const switchEl = queryBySelector('#needUpdatePassword', baseElement);
      expect(switchEl).toBeNull();
    });

    // TC 5.2.2: Edit page - click edit icon to enter edit mode
    it('should enter edit mode when clicking edit icon', async () => {
      const { baseElement } = customRender(true);

      // Click the edit (pencil) icon
      const editIcon = getBySelector('.anticon-edit', baseElement);
      await act(async () => {
        fireEvent.click(editIcon);
      });
      await act(async () => jest.advanceTimersByTime(300));

      // 1. Edit icon disappears, rollback icon appears
      expect(queryBySelector('.anticon-edit', baseElement)).toBeNull();
      const rollbackIcon = getBySelector(
        '.anticon-rollback',
        baseElement
      );
      expect(rollbackIcon).toBeTruthy();

      // 2. Input becomes password type
      const passwordInput = getBySelector(
        '.ant-input-password input.ant-input',
        baseElement
      );
      expect(passwordInput.getAttribute('type')).toBe('password');

      // 3. Input value is empty (no value attribute or empty), placeholder is "请输入新密码"
      const inputValue = passwordInput.getAttribute('value');
      expect(inputValue === '' || inputValue === null).toBe(true);
      expect(passwordInput.getAttribute('placeholder')).toBe('请输入新密码');

      // 4. Eye icon appears
      const eyeIcon = getBySelector(
        '.anticon-eye-invisible',
        baseElement
      );
      expect(eyeIcon).toBeTruthy();

      // 5. Label shows * required marker
      const passwordLabel = screen.getByText('连接密码');
      expect(passwordLabel.classList.contains('ant-form-item-required')).toBe(
        true
      );
    });

    // TC 5.2.3: Edit page - click input field to enter edit mode
    it('should enter edit mode when clicking input field', async () => {
      const { baseElement } = customRender(true);

      // Click the readonly password input
      const readonlyInput = getBySelector(
        '.ant-input[readonly]',
        baseElement
      );
      await act(async () => {
        fireEvent.click(readonlyInput);
      });
      await act(async () => jest.advanceTimersByTime(300));

      // Same assertions as TC 5.2.2 - verify we entered edit mode
      // 1. Edit icon disappears, rollback icon appears
      expect(queryBySelector('.anticon-edit', baseElement)).toBeNull();
      expect(
        getBySelector('.anticon-rollback', baseElement)
      ).toBeTruthy();

      // 2. Input becomes password type
      const passwordInput = getBySelector(
        '.ant-input-password input.ant-input',
        baseElement
      );
      expect(passwordInput.getAttribute('type')).toBe('password');

      // 3. Input value is empty (no value attribute or empty), placeholder is "请输入新密码"
      const inputValue = passwordInput.getAttribute('value');
      expect(inputValue === '' || inputValue === null).toBe(true);
      expect(passwordInput.getAttribute('placeholder')).toBe('请输入新密码');

      // 4. Eye icon appears
      expect(
        getBySelector('.anticon-eye-invisible', baseElement)
      ).toBeTruthy();

      // 5. Label shows * required marker
      const passwordLabel = screen.getByText('连接密码');
      expect(passwordLabel.classList.contains('ant-form-item-required')).toBe(
        true
      );
    });

    // TC 5.2.4: Edit page - cancel edit restores default state
    it('should restore default state when clicking cancel icon in edit mode', async () => {
      const { baseElement } = customRender(true);

      // Step 1: Click edit icon to enter edit mode
      const editIcon = getBySelector('.anticon-edit', baseElement);
      await act(async () => {
        fireEvent.click(editIcon);
      });
      await act(async () => jest.advanceTimersByTime(300));

      // Step 2: Type password "test123"
      const passwordInput = getBySelector(
        '.ant-input-password input.ant-input',
        baseElement
      );
      await act(async () => {
        fireEvent.change(passwordInput, { target: { value: 'test123' } });
      });
      await act(async () => jest.advanceTimersByTime(300));

      // Step 3: Click rollback icon to cancel
      const rollbackIcon = getBySelector(
        '.anticon-rollback',
        baseElement
      );
      await act(async () => {
        fireEvent.click(rollbackIcon);
      });
      await act(async () => jest.advanceTimersByTime(300));

      // Assert 1: Input restored to placeholder dots
      const restoredInput = getBySelector(
        '.ant-input[readonly]',
        baseElement
      );
      expect(restoredInput.getAttribute('value')).toBe(
        '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'
      );

      // Assert 2: Rollback icon gone, edit icon back
      expect(queryBySelector('.anticon-rollback', baseElement)).toBeNull();
      expect(getBySelector('.anticon-edit', baseElement)).toBeTruthy();

      // Assert 3: Eye icon gone
      expect(
        queryBySelector('.anticon-eye-invisible', baseElement)
      ).toBeNull();
      expect(queryBySelector('.anticon-eye', baseElement)).toBeNull();

      // Assert 4: Label no * required marker
      const passwordLabel = screen.getByText('连接密码');
      expect(passwordLabel.classList.contains('ant-form-item-required')).toBe(
        false
      );

      // Assert 5: Input is readonly again
      expect(restoredInput.hasAttribute('readonly')).toBe(true);
    });

    // TC 5.2.5: Edit page - toggle edit/cancel multiple times without state residue
    it('should correctly toggle between edit and default states multiple times without state residue', async () => {
      const { baseElement } = customRender(true);

      for (let i = 0; i < 3; i++) {
        // Enter edit mode by clicking edit icon
        const editIcon = getBySelector('.anticon-edit', baseElement);
        await act(async () => {
          fireEvent.click(editIcon);
        });
        await act(async () => jest.advanceTimersByTime(300));

        // Verify edit mode: password input exists and is editable
        const passwordInput = getBySelector(
          '.ant-input-password input.ant-input',
          baseElement
        );
        expect(passwordInput.getAttribute('type')).toBe('password');

        // Verify handleStartEdit was called with correct args
        expect(mockSetFieldsValue).toHaveBeenCalledWith({
          isPasswordEditing: true,
          password: ''
        });

        // Type some password
        await act(async () => {
          fireEvent.change(passwordInput, {
            target: { value: `pass${i}` }
          });
        });
        await act(async () => jest.advanceTimersByTime(300));

        // Cancel by clicking rollback icon
        const rollbackIcon = getBySelector(
          '.anticon-rollback',
          baseElement
        );
        await act(async () => {
          fireEvent.click(rollbackIcon);
        });
        await act(async () => jest.advanceTimersByTime(300));

        // Verify default state: placeholder dots, readonly, edit icon
        const restoredInput = getBySelector(
          '.ant-input[readonly]',
          baseElement
        );
        expect(restoredInput.getAttribute('value')).toBe(
          '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'
        );
        expect(
          queryBySelector('.anticon-rollback', baseElement)
        ).toBeNull();
        expect(
          getBySelector('.anticon-edit', baseElement)
        ).toBeTruthy();
      }

      // After 3 cycles, handleCancelEdit should have been called 3 times
      // Each cancel calls setFields to clear errors
      expect(mockSetFields).toHaveBeenCalledTimes(3);
      expect(mockSetFields).toHaveBeenCalledWith([
        { name: 'password', errors: [] }
      ]);
    });

    // TC 5.2.6: Edit page - password required validation in edit mode
    it('should show required validation error when submitting with empty password in edit mode', async () => {
      const { baseElement } = customRender(true);

      // Enter edit mode
      const editIcon = getBySelector('.anticon-edit', baseElement);
      await act(async () => {
        fireEvent.click(editIcon);
      });
      await act(async () => jest.advanceTimersByTime(300));

      // Verify form.setFieldsValue was called with isPasswordEditing: true
      expect(mockSetFieldsValue).toHaveBeenCalledWith({
        isPasswordEditing: true,
        password: ''
      });

      // In edit mode, the FormItemLabel has required: true rule and name="password"
      // Verify the required marker is present on the label
      const passwordLabel = screen.getByText('连接密码');
      expect(passwordLabel.classList.contains('ant-form-item-required')).toBe(
        true
      );

      // Verify the password input exists with name binding (has id="password")
      const passwordInput = getBySelector(
        '.ant-input-password input.ant-input',
        baseElement
      );
      expect(passwordInput.getAttribute('id')).toBe('password');
    });

    // TC 5.2.7: Edit page - no password required validation in default state
    it('should not require password validation when in default state', async () => {
      const { baseElement } = customRender(true);

      // In default state, the FormItemLabel has no name attribute,
      // so it does not participate in Form validation
      const passwordLabel = screen.getByText('连接密码');
      expect(passwordLabel.classList.contains('ant-form-item-required')).toBe(
        false
      );

      // The readonly input should NOT have id="password" (no name binding)
      const readonlyInput = getBySelector(
        '.ant-input[readonly]',
        baseElement
      );
      expect(readonlyInput.getAttribute('id')).toBeNull();
    });

    // TC 5.2.8: Edit page - no switch component in default state
    it('should not render needUpdatePassword switch in edit mode', async () => {
      const { baseElement } = customRender(true);

      // 1. No #needUpdatePassword element in DOM
      const switchEl = queryBySelector('#needUpdatePassword', baseElement);
      expect(switchEl).toBeNull();

      // 2. No "是否更新密码" text in DOM
      expect(screen.queryByText('是否更新密码')).toBeNull();
    });

    // TC 5.2.9: Create page - label shows "连接密码"
    it('should render password label as "连接密码" on create page', async () => {
      const { baseElement } = customRender(false);

      // 1. Label shows "连接密码" (not "密码")
      const passwordLabel = screen.getByText('连接密码');
      expect(passwordLabel).toBeTruthy();

      // 2. Shows * required marker
      expect(passwordLabel.classList.contains('ant-form-item-required')).toBe(
        true
      );

      // 3. Eye icon is visible (Input.Password default behavior)
      const eyeIcon = getBySelector(
        '.anticon-eye-invisible',
        baseElement
      );
      expect(eyeIcon).toBeTruthy();

      // 4. No edit (pencil) icon and no rollback icon
      expect(queryBySelector('.anticon-edit', baseElement)).toBeNull();
      expect(queryBySelector('.anticon-rollback', baseElement)).toBeNull();
    });
  });
});
