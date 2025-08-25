import { act, fireEvent, renderHook } from '@testing-library/react';
import {
  ReadOnlyConfigColumnsType,
  renderReadOnlyModeConfig,
  useConfigRender
} from '../useConfigRender';
import { superRender } from '../../../../testUtil/superRender';
import { getBySelector } from '../../../../testUtil/customQuery';

describe('test useConfigRender', () => {
  const data = { column1: 'value1', column2: 'value2' };
  const columns: ReadOnlyConfigColumnsType<typeof data> = [
    { dataIndex: 'column1', render: (value: string) => `${value}-test` },
    { dataIndex: 'column2' }
  ];
  describe('renderReadOnlyModeConfig', () => {
    it('should render read-only mode configuration correctly', () => {
      expect(
        renderReadOnlyModeConfig({ data, columns, modifyFlag: false })
      ).toMatchSnapshot();
    });

    it('should not render read-only mode configuration when modifyFlag is true', () => {
      expect(
        renderReadOnlyModeConfig({
          data,
          columns,
          modifyFlag: true
        })
      ).toBeFalsy();
    });

    it('should hide columns based on hidden property in column configuration', () => {
      expect(
        renderReadOnlyModeConfig({
          data,
          columns: columns.map((v) => ({ ...v, hidden: true })),
          modifyFlag: false
        })
      ).toBeFalsy();
    });
  });

  describe('useConfigRender', () => {
    it('should control extra buttons visibility based on extraButtonsVisible state', async () => {
      const { result } = renderHook(() =>
        useConfigRender({
          switchFieldLabel: '开关',
          switchFieldName: 'enabled'
        })
      );
      expect(result.current.extraButtonsVisible).toBeFalsy();
      expect(result.current.modifyFlag).toBeFalsy();

      await act(async () => {
        result.current.startModify();
      });
      expect(result.current.modifyFlag).toBeTruthy();

      const { unmount } = superRender(
        result.current.renderConfigForm({
          data,
          columns,
          configExtraButtons: <>configExtraButtons</>,
          configSwitchNode: <>configSwitchNode</>,
          configField: <>configField</>
        })
      );

      await act(async () => {
        fireEvent.mouseEnter(getBySelector('.switch-field-wrapper'));
      });

      expect(result.current.extraButtonsVisible).toBeFalsy();

      await act(async () => {
        result.current.modifyFinish();
      });

      expect(result.current.modifyFlag).toBeFalsy();
      unmount();

      superRender(
        result.current.renderConfigForm({
          data,
          columns,
          configExtraButtons: <>configExtraButtons</>,
          configSwitchNode: <>configSwitchNode</>,
          configField: <>configField</>
        })
      );

      await act(async () => {
        fireEvent.mouseEnter(getBySelector('.switch-field-wrapper'));
      });

      expect(result.current.extraButtonsVisible).toBeTruthy();

      await act(async () => {
        fireEvent.mouseLeave(getBySelector('.switch-field-wrapper'));
      });

      expect(result.current.extraButtonsVisible).toBeFalsy();
    });

    it('should submit form data and call onSubmit function when form is submitted', async () => {
      jest.useFakeTimers();
      const mockSubmit = jest.fn();

      const { result } = renderHook(() =>
        useConfigRender({
          switchFieldLabel: '开关',
          switchFieldName: 'enabled'
        })
      );

      await act(async () => {
        result.current.startModify();
      });

      const { getByTestId } = superRender(
        result.current.renderConfigForm({
          data,
          columns,
          configExtraButtons: <>configExtraButtons</>,
          configSwitchNode: <>configSwitchNode</>,
          configField: <>configField</>,
          submitButtonField: (
            <button type="submit" data-testid="submit-field">
              submit
            </button>
          ),
          onSubmit: mockSubmit
        })
      );

      fireEvent.click(getByTestId('submit-field'));
      await act(async () => jest.advanceTimersByTime(0));
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });

    it('should apply correct layout to form fields', async () => {
      const { result } = renderHook(() =>
        useConfigRender({
          switchFieldLabel: '开关',
          switchFieldName: 'enabled'
        })
      );

      await act(async () => {
        result.current.startModify();
      });

      const { container } = superRender(
        result.current.renderConfigForm({
          data,
          columns,
          configExtraButtons: <>configExtraButtons</>,
          configSwitchNode: <>configSwitchNode</>,
          configField: <>configField</>,
          submitButtonField: (
            <button type="submit" data-testid="submit-field">
              submit
            </button>
          )
        })
      );
      expect(container).toMatchSnapshot();
    });
  });
});
