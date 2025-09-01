import { Popover, Space } from 'antd';
import { BasicButton } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { DownloadDropdownStyleWrapper } from '../../../../Common/DownloadRecord/style';
import { TaskResultListLayoutEnum } from '../index.enum';
import {
  SquareCardFilled,
  DownOutlined,
  UpOutlined,
  ListLayoutFilled,
  ListLayoutOutlined
} from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/dms-kit';
const ListLayoutSelector: React.FC<{
  onChange: (v: TaskResultListLayoutEnum) => void;
  value: TaskResultListLayoutEnum;
}> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const renderDownloadDropdown = () => {
    return (
      <DownloadDropdownStyleWrapper>
        <div
          className="download-record-item"
          onClick={() => {
            if (value !== TaskResultListLayoutEnum.pagination) {
              onChange(TaskResultListLayoutEnum.pagination);
            }
            setOpen(false);
          }}
        >
          <ListLayoutFilled className="download-record-item-icon" />
          {t('execWorkflow.detail.paginationDisplay')}
        </div>

        <div
          className="download-record-item"
          onClick={() => {
            if (value !== TaskResultListLayoutEnum.scroll) {
              onChange(TaskResultListLayoutEnum.scroll);
            }
            setOpen(false);
          }}
        >
          <SquareCardFilled className="download-record-item-icon" />
          {t('execWorkflow.detail.waterfallDisplay')}
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
          <CommonIconStyleWrapper>
            <ListLayoutOutlined width={14} height={14} />
          </CommonIconStyleWrapper>
          {value === TaskResultListLayoutEnum.pagination
            ? t('execWorkflow.detail.paginationDisplay')
            : t('execWorkflow.detail.waterfallDisplay')}
          <CommonIconStyleWrapper>
            {open ? (
              <UpOutlined color="currentColor" />
            ) : (
              <DownOutlined color="currentColor" />
            )}
          </CommonIconStyleWrapper>
        </Space>
      </BasicButton>
    </Popover>
  );
};
export default ListLayoutSelector;
