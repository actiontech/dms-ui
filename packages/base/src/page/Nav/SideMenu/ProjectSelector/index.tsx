import { SelectProps } from 'antd5';
import { useTranslation } from 'react-i18next';
import { IconRightArrowSelectSuffix } from '@actiontech/shared/lib/Icon';
import {
  ProjectSelectorPopupMenuStyleWrapper,
  ProjectSelectorStyleWrapper
} from './style';
import { BasicButton } from '@actiontech/shared';
import { CustomSelectProps } from '@actiontech/shared/lib/components/CustomSelect';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconProjectFlag } from '@actiontech/shared/lib/Icon/common';
import { LockOutlined } from '@ant-design/icons';

const ProjectSelector: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  ...props
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const renderDropdown: SelectProps['dropdownRender'] = (menu) => {
    return (
      <>
        <ProjectSelectorPopupMenuStyleWrapper>
          {menu}

          <div className="show-more-project-wrapper">
            <Link to="/project" onClick={() => setOpen(false)}>
              <BasicButton type="primary">
                {t('dmsMenu.projectSelector.showMoreProject')}
              </BasicButton>
            </Link>
          </div>
        </ProjectSelectorPopupMenuStyleWrapper>
      </>
    );
  };

  return (
    <ProjectSelectorStyleWrapper
      open={open}
      // prefix={<IconProjectFlag />}
      prefix={<LockOutlined />}
      size="large"
      className="custom-project-selector"
      placement="bottomLeft"
      value={value}
      onChange={onChange}
      builtinPlacements={{
        /**
         * 由于 select placement 不支持 rightTop, 使用 builtinPlacements 自定义 bottomLeft, 将 bottomLeft 的位置对应至 rightTop
         * points: ['tl', 'tr']: 将下拉框的左上角对应至 input 的右上角, 模拟出 rightTop
         * offset: [10, 2]: 将下拉框向 x 轴偏移 10px, y 轴偏移 2px
         */
        bottomLeft: {
          points: ['tl', 'tr'],
          offset: [10, 2]
        }
      }}
      allowClear={false}
      dropdownRender={renderDropdown}
      onDropdownVisibleChange={(visible) => setOpen(visible)}
      options={options}
      suffixIcon={<IconRightArrowSelectSuffix />}
      dropdownSlot={
        <div className="select-options-group-label">
          {t('dmsMenu.projectSelector.recentlyOpenedProjects')}
        </div>
      }
      popupMatchSelectWidth={240}
      bordered={false}
      {...props}
    />
  );
};

export default ProjectSelector;
