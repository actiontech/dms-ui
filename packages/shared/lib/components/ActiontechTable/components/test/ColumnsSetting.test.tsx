import {
  getAllBySelector,
  getBySelector
} from '../../../../testUtil/customQuery';
import { renderWithTheme } from '../../../../testUtil/customRender';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';

import { ColumnsSettingProps } from '../../index.type';
import ColumnsSetting from '../ColumnsSetting';
import { mockUseTableSettings } from './mockHooks/mockUseTableSettings';
import { eventEmitter } from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { mockUseTableSettingsData } from './mockHooks/data';

const tableNameMock = 'demo_list';
const usernameMock = 'current-test';

describe('lib/ActiontechTable-ColumnsSetting', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });
  const customRender = (params: ColumnsSettingProps) => {
    return renderWithTheme(<ColumnsSetting {...params} />);
  };

  describe('render icon setting snap when in diff scene', () => {
    it('render icon setting when default scene', () => {
      const { baseElement } = customRender({
        tableName: tableNameMock,
        username: usernameMock
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render popover cont empty when click icon setting', async () => {
      const { baseElement } = customRender({
        tableName: tableNameMock,
        username: usernameMock
      });
      expect(
        getBySelector('.custom-icon-arrow-down', baseElement)
      ).toBeInTheDocument();
      const btnEle = getBySelector('button.ant-btn');
      await act(async () => {
        fireEvent.click(btnEle);
        await jest.advanceTimersByTime(300);
      });
      expect(
        getBySelector('.custom-icon-arrow-up', baseElement)
      ).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });
  });

  describe('render icon popover ui snap when click icon setting', () => {
    beforeEach(() => {
      mockUseTableSettings();
    });

    it('render popover cont has all column when click icon setting', async () => {
      const { baseElement } = customRender({
        tableName: tableNameMock,
        username: usernameMock
      });

      const btnEle = getBySelector('button.ant-btn');
      await act(async () => {
        fireEvent.click(btnEle);
        await jest.advanceTimersByTime(300);
      });

      expect(screen.getByText('工单号')).toBeInTheDocument();
      expect(screen.getByText('工单描述')).toBeInTheDocument();
      expect(screen.getByText('创建时间')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    it('render snap when click popover cont', async () => {
      const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
      const { baseElement } = customRender({
        tableName: tableNameMock,
        username: usernameMock
      });

      const btnEle = getBySelector('button.ant-btn');
      await act(async () => {
        fireEvent.click(btnEle);
        await jest.advanceTimersByTime(300);
      });

      const checkBox = getAllBySelector('.ant-checkbox-input', baseElement);
      expect(checkBox.length).toBe(3);

      const checkboxInput = checkBox[0];
      expect(checkboxInput.parentNode).toHaveClass('ant-checkbox-checked');
      await act(async () => {
        fireEvent.click(checkboxInput);
        await jest.advanceTimersByTime(300);
      });
      expect(eventEmitSpy).toHaveBeenCalled();
      expect(eventEmitSpy).toHaveBeenCalledWith(
        EmitterKey.UPDATE_LOCAL_COLUMNS,
        {
          ...mockUseTableSettingsData.localColumns,
          workflow_id: {
            ...mockUseTableSettingsData.localColumns.workflow_id,
            show: false
          }
        },
        tableNameMock,
        usernameMock
      );
    });

    it('render snap when click fixed left icon', async () => {
      const eventEmitSpy = jest.spyOn(eventEmitter, 'emit');
      const { baseElement } = customRender({
        tableName: tableNameMock,
        username: usernameMock
      });

      const btnEle = getBySelector('button.ant-btn');
      await act(async () => {
        fireEvent.click(btnEle);
        await jest.advanceTimersByTime(300);
      });

      const notFixedEle = getAllBySelector(
        '.actiontech-table-setting-not-fixed .columns-setting-item-wrapper',
        baseElement
      );
      expect(notFixedEle.length).toBe(1);

      const iconTop = getAllBySelector(
        '.anticon-vertical-align-top',
        notFixedEle[0]
      );
      expect(iconTop.length).toBe(1);
      await act(async () => {
        fireEvent.click(iconTop[0]);
        await jest.advanceTimersByTime(300);
      });
      expect(eventEmitSpy).toHaveBeenCalled();
      expect(eventEmitSpy).toHaveBeenCalledWith(
        EmitterKey.UPDATE_LOCAL_COLUMNS,
        {
          workflow_id: {
            ...mockUseTableSettingsData.localColumns.workflow_id
          },
          create_time: {
            ...mockUseTableSettingsData.localColumns.create_time,
            fixed: 'left',
            order: 2
          },
          desc: {
            ...mockUseTableSettingsData.localColumns.desc,
            order: 3
          }
        },
        tableNameMock,
        usernameMock
      );
    });

    it('render snap when drag column item', async () => {
      const { baseElement } = customRender({
        tableName: tableNameMock,
        username: usernameMock
      });

      const btnEle = getBySelector('button.ant-btn');
      await act(async () => {
        fireEvent.click(btnEle);
        await jest.advanceTimersByTime(300);
      });

      const dragEle = getAllBySelector(
        '.columns-setting-item-wrapper',
        baseElement
      );
      expect(dragEle.length).toBe(3);

      await act(async () => {
        fireEvent.pointerDown(dragEle[2], dragEle[0]);
        await jest.advanceTimersByTime(500);
      });

      await act(async () => {
        fireEvent.pointerMove(dragEle[2], dragEle[0]);
        await jest.advanceTimersByTime(500);
      });

      await act(async () => {
        fireEvent.pointerUp(dragEle[2], dragEle[0]);
        await jest.advanceTimersByTime(500);
      });
    });
  });
});
