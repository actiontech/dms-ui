import { Popover, Space } from 'antd5';
import { BasicButton } from '@actiontech/shared';
import { IconArrowDown, IconArrowUp } from '@actiontech/shared/lib/Icon';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  IconOrderResultLayout,
  IconOrderResultListLayout,
  IconOrderResultWaterFallLayout
} from '../../../../icon/Order';
import { DownloadDropdownStyleWrapper } from '../style';
import { ListLayoutEnum } from './index.types';

const ListLayoutSelector: React.FC<{
  onChange: (v: ListLayoutEnum) => void;
  value: ListLayoutEnum;
}> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const renderDownloadDropdown = () => {
    return (
      <DownloadDropdownStyleWrapper>
        <div
          className="download-record-item"
          onClick={() => {
            onChange(ListLayoutEnum.pagination);
            setOpen(false);
          }}
        >
          <IconOrderResultListLayout className="download-record-item-icon" />
          {t('order.paginationDisplay')}
        </div>

        <div
          className="download-record-item"
          onClick={() => {
            onChange(ListLayoutEnum.scroll);
            setOpen(false);
          }}
        >
          <IconOrderResultWaterFallLayout className="download-record-item-icon" />
          {t('order.waterfallDisplay')}
        </div>
      </DownloadDropdownStyleWrapper>
    );
  };
  return (
    <Popover
      open={open}
      arrow={false}
      trigger={['click']}
      onOpenChange={setOpen}
      placement="bottomLeft"
      content={renderDownloadDropdown()}
      overlayInnerStyle={{
        padding: 0
      }}
    >
      <BasicButton size="small">
        <Space size={5}>
          <IconOrderResultLayout />
          {value === ListLayoutEnum.pagination
            ? t('order.paginationDisplay')
            : t('order.waterfallDisplay')}
          {open ? <IconArrowUp /> : <IconArrowDown />}
        </Space>
      </BasicButton>
    </Popover>
  );
};

export default ListLayoutSelector;
