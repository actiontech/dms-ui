import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputRef, SelectProps } from 'antd';
import {
  BasicButton,
  BasicEmpty,
  EmptyBox,
  TypedLink
} from '@actiontech/shared';
import CustomSelectSearchInput from '@actiontech/shared/lib/components/CustomSelect/CustomSelectSearchInput';
import {
  ProjectSelectorPopupMenuStyleWrapper,
  ProjectSelectorStyleWrapper
} from './style';
import { CustomSelectPopupMenuStyleWrapper } from '@actiontech/shared/lib/components/CustomSelect/style';
import MockSelectItemOptions from './MockSelectItemOptions';
import { ProjectSelectorProps } from './index.type';
import { fuzzySearchAndSortByWeight } from '@actiontech/shared/lib/utils/Tool';
import { ArrowRightOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

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
    const filterBindProjects = fuzzySearchAndSortByWeight(
      searchValue,
      bindProjects ?? [],
      'project_name'
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
                  `ant-select-item-option-active`
                );
              }
            }}
            onMouseLeave={() => {
              // 当移出menu范围时，移除所有‘ant-select-item-option-active’，避免出现同时有2个hover类的option
              const activeSelectItem = document.querySelectorAll(
                `.ant-select-item.ant-select-item-option.ant-select-item-option-active`
              )[0];
              setLastActiveMenuItem(activeSelectItem);
              activeSelectItem?.classList.remove(
                `ant-select-item-option-active`
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
                list={filterBindProjects ?? []}
              />
            )}
          </EmptyBox>

          <div className="show-more-project-wrapper">
            <TypedLink
              to={ROUTE_PATHS.BASE.PROJECT.index}
              onClick={() => {
                setOpen(false);
                setSearchValue('');
              }}
            >
              <BasicButton type="primary">
                {t('dmsMenu.projectSelector.showMoreProjects')}
              </BasicButton>
            </TypedLink>
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
      suffixIcon={
        <ArrowRightOutlined className="custom-icon-right-arrow-select-suffix" />
      }
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
