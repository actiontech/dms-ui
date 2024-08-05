import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { Popover } from 'antd';

import BasicButton from '../../BasicButton';
import { CatchTableColumnValueType, ColumnsSettingProps } from '../index.type';
import useTableSettings from '../hooks/useTableSettings';
import { ColumnsSettingDropdownStyleWrapper } from './style';

import { eventEmitter } from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';

import { cloneDeep } from 'lodash';
import type { DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import ColumnsItems, { typeFixed } from './ColumnsItems';
import { DownOutlined, UpOutlined, SettingOutlined } from '@actiontech/icons';
import { ColumnsSettingStyleWrapper } from './style';

/**
 * todo:
   - 列全部隐藏
   - 重置列的位置
 */
const ColumnsSetting = <
  T extends Record<string, any>,
  F = Record<string, any>,
  OtherColumnKeys extends string = ''
>(
  props: ColumnsSettingProps
) => {
  const { tableName, username } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { localColumns } = useTableSettings<T, F, OtherColumnKeys>(
    tableName,
    username
  );

  const switchChangeHandle = (dataIndex: keyof T, checked: boolean) => {
    const columnsInfo = {
      ...cloneDeep(localColumns),
      [dataIndex]: {
        ...localColumns[dataIndex],
        show: checked
      }
    } as CatchTableColumnValueType<T>;

    eventEmitter.emit<[CatchTableColumnValueType<T>, string, string]>(
      EmitterKey.UPDATE_LOCAL_COLUMNS,
      columnsInfo,
      tableName,
      username
    );
  };

  const updateColumnSorter = (
    keysData: Array<keyof T | OtherColumnKeys>,
    sorterSource: CatchTableColumnValueType<T>
  ) => {
    const cloneLocalData = cloneDeep(sorterSource);
    keysData.forEach((key, index) => {
      cloneLocalData[key] = {
        ...cloneLocalData[key],
        order: index + 1
      };
    });
    return cloneLocalData;
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1
      }
    })
  );
  const [localColumnsKeys, setLocalColumnsKeys] = useState<Array<string>>([]);

  const getFixedData = (dataSource: any) => {
    const left: (CatchTableColumnValueType<T>[keyof T] & {
      dataIndex: string;
    })[] = [];
    const right: (CatchTableColumnValueType<T>[keyof T] & {
      dataIndex: string;
    })[] = [];
    const notFixed: (CatchTableColumnValueType<T>[keyof T] & {
      dataIndex: string;
    })[] = [];

    if (dataSource) {
      Object.keys(dataSource).forEach((dataIndex) => {
        const column = dataSource[dataIndex]!;

        if (column?.fixed === 'left') {
          left.push({ ...column, dataIndex });
        } else if (column?.fixed === 'right') {
          right.push({ ...column, dataIndex });
        } else {
          notFixed.push({ ...column, dataIndex });
        }
      });
    }

    const leftData = left
      .sort((prev, current) => prev.order - current.order)
      .map((item) => item.dataIndex);
    const noFixedData = notFixed
      .sort((prev, current) => prev.order - current.order)
      .map((item) => item.dataIndex);
    const rightData = right
      .sort((prev, current) => prev.order - current.order)
      .map((item) => item.dataIndex);

    return {
      fixedColumns: { left, right, notFixed },
      fixedColumnsKeys: leftData.concat(...noFixedData, ...rightData)
    };
  };

  const { fixedColumns, fixedColumnsKeys } = useMemo(() => {
    return getFixedData(localColumns);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localColumns]);

  useEffect(() => {
    setLocalColumnsKeys(fixedColumnsKeys);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedColumns]);

  const renderSettingDropdown = () => {
    const genItem = (
      type: typeFixed,
      columns: (CatchTableColumnValueType<T>[keyof T] & {
        dataIndex: string;
      })[]
    ) => {
      return columns.map((v) => {
        return (
          <ColumnsItems
            type={type}
            key={v.dataIndex}
            data={v}
            onShowChange={(event) =>
              switchChangeHandle(v.dataIndex, event.target.checked)
            }
            onFixedClick={updateFixedData}
          />
        );
      });
    };

    return (
      <ColumnsSettingDropdownStyleWrapper>
        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
          onDragMove={onDragMove}
        >
          <SortableContext
            // rowKey array
            items={localColumnsKeys}
            strategy={verticalListSortingStrategy}
          >
            <div
              className="actiontech-table-setting-fixed-left"
              hidden={!fixedColumns.left.length}
            >
              <div className="actiontech-table-setting-fixed-title">
                {t('common.actiontechTable.setting.fixedLeft')}
              </div>
              {genItem('left', fixedColumns.left)}
            </div>
            <div
              className="actiontech-table-setting-not-fixed"
              hidden={!fixedColumns.notFixed.length}
            >
              <div className="actiontech-table-setting-fixed-title">
                {t('common.actiontechTable.setting.noFixed')}
              </div>
              {genItem('no-fixed', fixedColumns.notFixed)}
            </div>
            <div
              className="actiontech-table-setting-fixed-right"
              hidden={!fixedColumns.right.length}
            >
              <div className="actiontech-table-setting-fixed-title">
                {t('common.actiontechTable.setting.fixedRight')}
              </div>
              {genItem('right', fixedColumns.right)}
            </div>
          </SortableContext>
        </DndContext>
      </ColumnsSettingDropdownStyleWrapper>
    );
  };

  const updateFixedData = (type: typeFixed, dataIndex: string) => {
    if (!dataIndex) return;
    const fixedVal = ['left', 'right'].includes(type) ? type : undefined;
    const cloneLocalData = {
      ...cloneDeep(localColumns),
      [dataIndex]: {
        ...localColumns[dataIndex],
        fixed: fixedVal
      }
    };
    eventEmitter.emit<[CatchTableColumnValueType<T>, string, string]>(
      EmitterKey.UPDATE_LOCAL_COLUMNS,
      updateColumnSorter(
        getFixedData(cloneLocalData).fixedColumnsKeys,
        cloneLocalData
      ),
      tableName,
      username
    );
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over?.id) {
      // update sort
      const activeIndex = localColumnsKeys.findIndex((id) => id === active.id);
      const overIndex = localColumnsKeys.findIndex((id) => id === over?.id);
      const updateColumnKeysData = arrayMove(
        localColumnsKeys,
        activeIndex,
        overIndex
      );
      setLocalColumnsKeys(updateColumnKeysData);
      // update active fixed
      const activeDataIndex = active.id;
      const overFixedData = localColumns[over.id].fixed;
      const cloneLocalData = {
        ...cloneDeep(localColumns),
        [activeDataIndex]: {
          ...localColumns[activeDataIndex],
          fixed: overFixedData
        }
      };
      eventEmitter.emit<[CatchTableColumnValueType<T>, string, string]>(
        EmitterKey.UPDATE_LOCAL_COLUMNS,
        updateColumnSorter(updateColumnKeysData, cloneLocalData),
        tableName,
        username
      );
    }
  };

  const onDragMove = ({ activatorEvent }: DragMoveEvent) => {
    activatorEvent.preventDefault();
    activatorEvent.stopPropagation();
  };

  return (
    <Popover
      open={open}
      arrow={false}
      trigger={['click']}
      onOpenChange={setOpen}
      placement="bottomRight"
      content={renderSettingDropdown()}
      overlayClassName="actiontech-setting-button-overlay-namespace"
      overlayInnerStyle={{
        padding: 0
      }}
    >
      <BasicButton
        size="small"
        className="actiontech-table-setting-namespace"
        style={{ padding: '0 6px 0 8px' }}
      >
        <ColumnsSettingStyleWrapper size={5} align="center">
          <SettingOutlined
            width={13}
            height={11}
            className="custom-icon custom-icon-setting"
          />
          {t('common.actiontechTable.setting.buttonText')}
          {open ? (
            <UpOutlined
              color="currentColor"
              className="custom-icon custom-icon-arrow-up"
              width={14}
              height={14}
            />
          ) : (
            <DownOutlined
              color="currentColor"
              className="custom-icon custom-icon-arrow-down"
              width={14}
              height={14}
            />
          )}
        </ColumnsSettingStyleWrapper>
      </BasicButton>
    </Popover>
  );
};

export default ColumnsSetting;
