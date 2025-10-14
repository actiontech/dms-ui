import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { superRender } from '../../../testUtil/superRender';
import { ConfigItemProps } from '../ConfigItem.types';
import ConfigItem from '../ConfigItem';
import { getBySelector } from '../../../testUtil/customQuery';

describe('lib/ConfigItem', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: ConfigItemProps) => {
    return superRender(<ConfigItem {...params} />);
  };

  it('only render input no desc', () => {
    const { baseElement } = customRender({
      label: 'label',
      descNode: ''
    });
    expect(baseElement).toMatchSnapshot();

    const { baseElement: baseElement1 } = customRender({
      label: 'label',
      fieldVisible: false
    });
    expect(baseElement1.querySelector('.ant-row')).toBeInTheDocument();
    expect(
      baseElement1.querySelector('.config-item-filed-edit-button')
    ).not.toBeInTheDocument();
  });

  it('only render desc no button', async () => {
    const { baseElement } = customRender({
      label: 'label',
      descNode: 'descNode',
      needEditButton: false
    });

    const configItemWrapper = getBySelector(
      '.ant-row,.ant-row-space-between.ant-row-middle',
      baseElement
    );
    expect(configItemWrapper).toBeInTheDocument();
    expect(
      baseElement.querySelector('.config-item-filed-edit-button')
    ).toHaveAttribute('hidden');
    expect(baseElement.textContent).toContain('descNode');

    await act(async () => {
      fireEvent.mouseEnter(configItemWrapper);
      await jest.advanceTimersByTime(300);
    });
    expect(
      baseElement.querySelector('.config-item-filed-edit-button')
    ).toHaveAttribute('hidden');

    await act(async () => {
      fireEvent.mouseLeave(configItemWrapper);
      await jest.advanceTimersByTime(300);
    });
    expect(
      baseElement.querySelector('.config-item-filed-edit-button')
    ).toHaveAttribute('hidden');
  });

  it('render button when mouse move', async () => {
    const { baseElement } = customRender({
      label: 'label',
      descNode: 'descNode'
    });
    const configItemWrapper = getBySelector(
      '.ant-row,.ant-row-space-between.ant-row-middle',
      baseElement
    );
    expect(
      baseElement.querySelector('.config-item-filed-edit-button')
    ).toHaveAttribute('hidden');

    await act(async () => {
      fireEvent.mouseEnter(configItemWrapper);
      await jest.advanceTimersByTime(300);
    });
    expect(
      baseElement.querySelector('.config-item-filed-edit-button')
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.mouseLeave(configItemWrapper);
      await jest.advanceTimersByTime(300);
    });
    expect(
      baseElement.querySelector('.config-item-filed-edit-button')
    ).toHaveAttribute('hidden');
  });

  it('render show field', async () => {
    const showFieldFn = jest.fn();
    const { baseElement } = customRender({
      label: 'label',
      descNode: 'descNode',
      showField: showFieldFn
    });
    const configItemWrapper = getBySelector(
      '.ant-row,.ant-row-space-between.ant-row-middle',
      baseElement
    );
    await act(async () => {
      fireEvent.mouseEnter(configItemWrapper);
      await jest.advanceTimersByTime(300);
    });
    const btnEle = getBySelector('.config-item-filed-edit-button', baseElement);
    expect(btnEle).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(btnEle);
      await jest.advanceTimersByTime(300);
    });
    expect(showFieldFn).toHaveBeenCalledTimes(1);
  });

  it('should execute "hideField" when clicking outside', () => {
    const hideField = jest.fn();

    superRender(
      <>
        <span>outside</span>
        <ConfigItem label="label" hideField={hideField} />
      </>
    );

    fireEvent.mouseDown(screen.getByText('outside'));
    expect(hideField).not.toHaveBeenCalled();

    cleanup();
    superRender(
      <>
        <span>outside</span>
        <ConfigItem label="label" hideField={hideField} fieldVisible />
      </>
    );
    fireEvent.mouseDown(screen.getByText('outside'));
    expect(hideField).toHaveBeenCalledTimes(1);

    cleanup();
    superRender(
      <>
        <div className="config-item-filed">
          <span>outside</span>
        </div>
        <ConfigItem label="label" hideField={hideField} fieldVisible />
      </>
    );
    fireEvent.mouseDown(screen.getByText('outside'));
    expect(hideField).toHaveBeenCalledTimes(1);
  });
});
