import { InputRef, SelectProps } from 'antd5';
import { useTranslation } from 'react-i18next';
import { IconRightArrowSelectSuffix } from '@actiontech/shared/lib/Icon';
import {
  ProjectSelectorPopupMenuStyleWrapper,
  ProjectSelectorStyleWrapper
} from './style';
import { BasicButton, EmptyBox } from '@actiontech/shared';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconProjectArchived,
  IconProjectFlag
} from '@actiontech/shared/lib/Icon/common';
import CustomSelectSearchInput from '@actiontech/shared/lib/components/CustomSelect/CustomSelectSearchInput';
import { CustomSelectPopupMenuStyleWrapper } from '@actiontech/shared/lib/components/CustomSelect/style';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';
import MockSelectItemOptions from './MockSelectItemOptions';
import { ProjectSelectorProps } from './index.type';

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  value,
  isArchived,
  onChange,
  options,
  bindProjects,
  ...props
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef<InputRef>(null);
  const [searchValue, setSearchValue] = useState('');

  const renderDropdown: SelectProps['dropdownRender'] = (menu) => {
    const filterBindProjects = (bindProjects ?? []).filter((v) =>
      v.project_name
        ?.toLocaleLowerCase()
        .includes(searchValue.toLocaleLowerCase())
    );
    return (
      <>
        <ProjectSelectorPopupMenuStyleWrapper>
          <CustomSelectSearchInput
            value={searchValue}
            onChange={setSearchValue}
            ref={searchInputRef}
          />
          <div className="select-options-group-label">
            {t('dmsMenu.projectSelector.recentlyOpenedProjects')}
          </div>
          <CustomSelectPopupMenuStyleWrapper>
            {menu}
          </CustomSelectPopupMenuStyleWrapper>

          <EmptyBox if={!!bindProjects}>
            <div className="select-options-group-label">
              {t('dmsMenu.projectSelector.belongProjects')}
            </div>
            {filterBindProjects.length === 0 ? (
              <BasicEmpty emptyCont={t('dmsMenu.projectSelector.emptyDesc')} />
            ) : (
              <MockSelectItemOptions
                closeSelectDropdown={() => {
                  setOpen(false);
                  setSearchValue('');
                }}
                list={filterBindProjects?.slice(0, 3) ?? []}
              />
            )}
          </EmptyBox>

          <div className="show-more-project-wrapper">
            <Link
              to="/project"
              onClick={() => {
                setOpen(false);
                setSearchValue('');
              }}
            >
              <BasicButton type="primary">
                {t('dmsMenu.projectSelector.showMoreProjects')}
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
      prefix={isArchived ? <IconProjectArchived /> : <IconProjectFlag />}
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
      onDropdownVisibleChange={(visible) => {
        setOpen(visible);

        if (!visible) {
          setSearchValue('');
        }
      }}
      options={options}
      suffixIcon={<IconRightArrowSelectSuffix />}
      popupMatchSelectWidth={240}
      bordered={false}
      notFoundContent={
        <BasicEmpty emptyCont={t('dmsMenu.projectSelector.emptyDesc')} />
      }
      searchInputRef={searchInputRef}
      {...props}
    />
  );
};

export default ProjectSelector;
