import { Checkbox, CheckboxProps, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { CatchTableColumnValueType } from '../index.type';
import classNames from 'classnames';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined
} from '@ant-design/icons';
import { DragOutlined } from '@actiontech/icons';
import { getColumnsLabel } from '../utils';
import { BasicToolTip } from '../../BasicToolTip';

export type typeFixed = 'left' | 'right' | 'no-fixed';
export interface IColumnsItems<T> {
  type: typeFixed;
  data: CatchTableColumnValueType<T>[keyof T] & {
    dataIndex: string;
  };
  onShowChange: CheckboxProps['onChange'];
  onFixedClick: (type: typeFixed, dataIndex: string) => void;
}

const ColumnsItems = <T extends Record<string, any>>({
  type,
  data,
  onShowChange,
  onFixedClick
}: IColumnsItems<T>) => {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: data['dataIndex']
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {})
  };

  return (
    <div
      key={data.dataIndex}
      className={classNames('columns-setting-item-wrapper', {
        'drag-item-active': isDragging
      })}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <DragOutlined />
      <div className="columns-setting-item">
        <Checkbox checked={data?.show} onChange={onShowChange}>
          <div style={{ width: '90px' }}>
            <Typography.Paragraph
              ellipsis={{ tooltip: getColumnsLabel(data.title) }}
              className="columns-setting-item-label margin-bottom-0"
            >
              {getColumnsLabel(data.title)}
            </Typography.Paragraph>
          </div>
        </Checkbox>
      </div>
      <div className="fixed-options">
        <span hidden={!['left', 'right'].includes(type)}>
          <BasicToolTip title={t('common.actiontechTable.setting.noFixed')}>
            <VerticalAlignMiddleOutlined
              className="fixed-icon"
              onClick={() => onFixedClick('no-fixed', data.dataIndex)}
            />
          </BasicToolTip>
        </span>
        <span hidden={!['right', 'no-fixed'].includes(type)}>
          <BasicToolTip title={t('common.actiontechTable.setting.fixedLeft')}>
            <VerticalAlignTopOutlined
              className="fixed-icon"
              onClick={() => onFixedClick('left', data.dataIndex)}
            />
          </BasicToolTip>
        </span>
        <span hidden={!['left', 'no-fixed'].includes(type)}>
          <BasicToolTip title={t('common.actiontechTable.setting.fixedRight')}>
            <VerticalAlignBottomOutlined
              className="fixed-icon"
              onClick={() => onFixedClick('right', data.dataIndex)}
            />
          </BasicToolTip>
        </span>
      </div>
    </div>
  );
};

export default ColumnsItems;
