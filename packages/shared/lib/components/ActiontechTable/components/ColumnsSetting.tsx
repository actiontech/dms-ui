import {
  IconArrowDown,
  IconArrowUp,
  IconDraggable,
  IconSetting
} from '../../../Icon';
import BasicButton from '../../BasicButton';
import { useTranslation } from 'react-i18next';
import { Space, Popover, Switch, Typography } from 'antd5';
import { CatchTableColumnValueType, ColumnsSettingProps } from '../index.type';
import { useMemo, useState } from 'react';
import useTableSettings from '../hooks/useTableSettings';
import { getColumnsLabel } from '../utils';
import { eventEmitter } from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { ColumnsSettingDropdownStyleWrapper } from './style';

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

  const fixedColumns = useMemo(() => {
    const left: (CatchTableColumnValueType<T>[keyof T] & {
      dataIndex: string;
    })[] = [];
    const right: (CatchTableColumnValueType<T>[keyof T] & {
      dataIndex: string;
    })[] = [];
    const notFixed: (CatchTableColumnValueType<T>[keyof T] & {
      dataIndex: string;
    })[] = [];

    if (localColumns) {
      Object.keys(localColumns).forEach((dataIndex) => {
        const column = localColumns[dataIndex]!;

        if (column?.fixed === 'left') {
          left.push({ ...column, dataIndex });
        } else if (column?.fixed === 'right') {
          right.push({ ...column, dataIndex });
        } else {
          notFixed.push({ ...column, dataIndex });
        }
      });
    }

    return {
      left,
      right,
      notFixed
    };
  }, [localColumns]);

  const renderSettingDropdown = () => {
    const genItem = (
      columns: (CatchTableColumnValueType<T>[keyof T] & {
        dataIndex: string;
      })[]
    ) => {
      return columns.map((v) => {
        return (
          <div key={v.dataIndex} className="columns-setting-item-wrapper">
            <div className="columns-setting-item">
              <IconDraggable />
              <Typography.Paragraph
                ellipsis={{ tooltip: getColumnsLabel(v.title) }}
                className="columns-setting-item-label margin-bottom-0"
              >
                {getColumnsLabel(v.title)}
              </Typography.Paragraph>
            </div>

            <Switch
              size="small"
              checked={v?.show}
              onChange={(checked) => switchChangeHandle(v.dataIndex, checked)}
            />
          </div>
        );
      });
    };
    return (
      <ColumnsSettingDropdownStyleWrapper>
        <div className="actiontech-table-setting-fixed-left">
          <div className="actiontech-table-setting-fixed-title">
            {t('common.actiontechTable.setting.fixedLeft')}
          </div>
          {genItem(fixedColumns.left)}
        </div>
        <div className="actiontech-table-setting-not-fixed">
          {genItem(fixedColumns.notFixed)}
        </div>
        <div className="actiontech-table-setting-fixed-right">
          <div className="actiontech-table-setting-fixed-title">
            {t('common.actiontechTable.setting.fixedRight')}
          </div>
          {genItem(fixedColumns.right)}
        </div>
      </ColumnsSettingDropdownStyleWrapper>
    );
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
        <Space size={5} align="center">
          <IconSetting />
          {t('common.actiontechTable.setting.buttonText')}
          {open ? <IconArrowUp /> : <IconArrowDown />}
        </Space>
      </BasicButton>
    </Popover>
  );
};

export default ColumnsSetting;
