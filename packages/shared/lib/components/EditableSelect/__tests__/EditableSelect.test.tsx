import { fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '../../../testUtil/superRender';
import EditableSelect from '../EditableSelect';
import { EditableSelectOption } from '../index.type';
import {
  getBySelector,
  getAllBySelector,
  queryBySelector
} from '../../../testUtil/customQuery';

describe('EditableSelect', () => {
  const mockOptions: EditableSelectOption[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ];

  const mockOnChange = jest.fn();
  const mockOnAdd = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const customRender = (props = {}) => {
    return superRender(
      <EditableSelect
        options={mockOptions}
        onChange={mockOnChange}
        onAdd={mockOnAdd}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        {...props}
      />
    );
  };

  it('should render select with options', async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(baseElement).toMatchSnapshot();
  });

  it('should render without options', async () => {
    const { baseElement } = customRender({ options: [] });
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with loading status', async () => {
    customRender({ loading: true });
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(getBySelector('.ant-spin')).toBeInTheDocument();
  });

  it('should render with selected value', async () => {
    customRender({ value: '1' });
    expect(getBySelector('.editable-select-trigger')?.textContent).toContain(
      'Option 1'
    );
  });

  it('should call onChange when select option', async () => {
    customRender();
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    const firstOption = getAllBySelector('.ant-dropdown-menu-item')[0];
    fireEvent.click(firstOption);
    await act(async () => jest.advanceTimersByTime(0));

    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('should show add mode when click add button', async () => {
    customRender();
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    const addButton = getAllBySelector('.ant-dropdown-menu-item')[2];
    fireEvent.click(addButton);
    await act(async () => jest.advanceTimersByTime(0));

    expect(getBySelector('.add-mode')).toBeInTheDocument();
  });

  it('should call onAdd when add new option', async () => {
    customRender();
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    const addButton = getAllBySelector('.ant-dropdown-menu-item')[2];
    fireEvent.click(addButton);
    await act(async () => jest.advanceTimersByTime(0));

    const input = getBySelector('.add-mode input');
    fireEvent.change(input!, { target: { value: 'New Option' } });
    await act(async () => jest.advanceTimersByTime(0));

    const saveButton = getBySelector(
      '.add-mode .button-group button:last-child'
    );
    fireEvent.click(saveButton);
    await act(async () => jest.advanceTimersByTime(0));

    expect(mockOnAdd).toHaveBeenCalledWith('New Option');
  });

  it('should disable add button when input is empty', async () => {
    customRender();
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    const addButton = getAllBySelector('.ant-dropdown-menu-item')[2];
    fireEvent.click(addButton);
    await act(async () => jest.advanceTimersByTime(0));

    expect(
      getBySelector('.add-mode .button-group button:last-child')
    ).toBeDisabled();
  });

  it('should show edit mode when click edit button', async () => {
    customRender();
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    const editButton = getAllBySelector('.edit-button')[0];
    fireEvent.click(editButton);
    await act(async () => jest.advanceTimersByTime(0));

    expect(getBySelector('.edit-mode')).toBeInTheDocument();
  });

  it('should call onUpdate when edit option', async () => {
    customRender();
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    const editButton = getAllBySelector('.edit-button')[0];
    fireEvent.click(editButton);
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.change(getBySelector('.edit-mode input'), {
      target: { value: 'Updated Option' }
    });
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(
      getBySelector('.edit-mode .button-group button:last-child')
    );
    await act(async () => jest.advanceTimersByTime(0));

    expect(mockOnUpdate).toHaveBeenCalledWith({
      value: '1',
      label: 'Updated Option'
    });
  });

  it('should disable edit button when input is empty', async () => {
    customRender();
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    const editButton = getAllBySelector('.edit-button')[0];
    fireEvent.click(editButton);
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.change(getBySelector('.edit-mode input'), {
      target: { value: '' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      getBySelector('.edit-mode .button-group button:last-child')
    ).toBeDisabled();
  });

  it('should cancel edit when click cancel button', async () => {
    customRender();
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    const editButton = getAllBySelector('.edit-button')[0];
    fireEvent.click(editButton);
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(
      getBySelector('.edit-mode .button-group button:first-child')
    );
    await act(async () => jest.advanceTimersByTime(0));

    expect(queryBySelector('.edit-mode')).not.toBeInTheDocument();
  });

  it('should call onDelete when confirm delete', async () => {
    customRender();
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    const deleteButton = getAllBySelector('.delete-button')[0];
    fireEvent.click(deleteButton);
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('确认要删除么?')).toBeInTheDocument();

    const confirmButton = getBySelector('.ant-btn-primary.ant-btn-sm');
    fireEvent.click(confirmButton);
    await act(async () => jest.advanceTimersByTime(0));

    expect(mockOnDelete).toHaveBeenCalledWith(mockOptions[0]);
  });

  it('render error message when confirm delete failed', async () => {
    const errorMessage = '当前数据不可删除';
    customRender({
      errorMessage
    });
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    const deleteButton = getAllBySelector('.delete-button')[0];
    fireEvent.click(deleteButton);
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('确认要删除么?')).toBeInTheDocument();

    const confirmButton = getBySelector('.ant-btn-primary.ant-btn-sm');
    fireEvent.click(confirmButton);
    await act(async () => jest.advanceTimersByTime(0));

    expect(mockOnDelete).toHaveBeenCalledWith(mockOptions[0]);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should not show actions when disabled', async () => {
    customRender({
      disabled: true
    });

    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(queryBySelector('.ant-dropdown')).not.toBeInTheDocument();
  });

  it('should not show add button when addable is false', async () => {
    customRender({
      addable: false
    });

    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(getAllBySelector('.ant-dropdown-menu-item').length).toBe(
      mockOptions.length
    );
  });

  it('should not show edit button when updatable is false', async () => {
    customRender({
      updatable: false
    });

    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(queryBySelector('.edit-button')).not.toBeInTheDocument();
  });

  it('should not show delete button when deletable is false', async () => {
    customRender({
      deletable: false
    });

    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(queryBySelector('.delete-button')).not.toBeInTheDocument();
  });

  it('should reset state when dropdown closed', async () => {
    customRender();
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    const addButton = getAllBySelector('.ant-dropdown-menu-item')[2];
    fireEvent.click(addButton);
    await act(async () => jest.advanceTimersByTime(0));

    const firstOption = getAllBySelector('.ant-dropdown-menu-item')[0];
    fireEvent.click(firstOption);
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(queryBySelector('.add-mode')).not.toBeInTheDocument();
  });

  it('should show custom placeholder', async () => {
    customRender({
      placeholder: 'Custom Placeholder'
    });

    expect(getBySelector('.placeholder')?.textContent).toBe(
      'Custom Placeholder'
    );
  });

  it('should show custom add button text', async () => {
    customRender({
      addButtonText: 'Custom Add'
    });

    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    const addButton = getAllBySelector('.ant-dropdown-menu-item')[2];
    expect(addButton.textContent).toContain('Custom Add');
  });

  it('should show custom deletion confirm title', async () => {
    customRender({
      deletionConfirmTitle: 'Custom Delete Confirm'
    });

    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));

    const deleteButton = getAllBySelector('.delete-button')[0];
    fireEvent.click(deleteButton);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('Custom Delete Confirm')).toBeInTheDocument();
  });
});
