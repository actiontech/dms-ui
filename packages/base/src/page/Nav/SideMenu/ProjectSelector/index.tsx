import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { InputRef, SelectProps } from 'antd5';
import { BasicButton, EmptyBox } from '@actiontech/shared';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';
import CustomSelectSearchInput from '@actiontech/shared/lib/components/CustomSelect/CustomSelectSearchInput';
import { IconRightArrowSelectSuffix } from '@actiontech/shared/lib/Icon';
import {
  ProjectSelectorPopupMenuStyleWrapper,
  ProjectSelectorStyleWrapper
} from './style';
import { CustomSelectPopupMenuStyleWrapper } from '@actiontech/shared/lib/components/CustomSelect/style';
import MockSelectItemOptions from './MockSelectItemOptions';
import { ProjectSelectorProps } from './index.type';
import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  value,
  prefix,
  onChange,
  options,
  bindProjects,
  ...props
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef<InputRef>(null);
  const [searchValue, setSearchValue] = useState('');
  const [lastActiveMenuItem, setLastActiveMenuItem] = useState<
    Element | undefined
  >();

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
          <CustomSelectPopupMenuStyleWrapper
            onMouseEnter={() => {
              // 当移入menu范围时，如果原本有hover active的选项，还原active类
              if (lastActiveMenuItem) {
                lastActiveMenuItem?.classList.add(
                  `${ANTD_PREFIX_STR}-select-item-option-active`
                );
              }
            }}
            onMouseLeave={() => {
              // 当移出menu范围时，移除所有‘antd-v5-select-item-option-active’，避免出现同时有2个hover类的option
              const activeSelectItem = document.querySelectorAll(
                `.${ANTD_PREFIX_STR}-select-item.${ANTD_PREFIX_STR}-select-item-option.${ANTD_PREFIX_STR}-select-item-option-active`
              )[0];
              setLastActiveMenuItem(activeSelectItem);
              activeSelectItem?.classList.remove(
                `${ANTD_PREFIX_STR}-select-item-option-active`
              );
            }}
          >
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
      prefix={prefix}
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
