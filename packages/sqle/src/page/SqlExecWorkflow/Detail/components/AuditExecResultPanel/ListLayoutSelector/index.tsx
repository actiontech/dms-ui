import { Popover, Space } from 'antd';
import { BasicButton } from '@actiontech/shared';
import { IconArrowDown, IconArrowUp } from '@actiontech/shared/lib/Icon';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { DownloadDropdownStyleWrapper } from '../../../../Common/DownloadRecord/style';
import { TaskResultListLayoutEnum } from '../index.enum';
import {
  IconWorkflowResultLayout,
  IconWorkflowResultListLayout,
  IconWorkflowResultWaterFallLayout
} from '../../../../../../icon/SqlExecWorkflow';

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
          <IconWorkflowResultListLayout className="download-record-item-icon" />
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
          <IconWorkflowResultWaterFallLayout className="download-record-item-icon" />
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
          <IconWorkflowResultLayout />
          {value === TaskResultListLayoutEnum.pagination
            ? t('execWorkflow.detail.paginationDisplay')
            : t('execWorkflow.detail.waterfallDisplay')}
          {open ? <IconArrowUp /> : <IconArrowDown />}
        </Space>
      </BasicButton>
    </Popover>
  );
};

export default ListLayoutSelector;
