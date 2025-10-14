import { InputRef, SelectProps, Space } from 'antd';
import { BasicButton, BasicModal } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { SelectProjectModalContentStyleWrapper } from './style';
import ProjectSelector from '../../../Nav/SideMenu/ProjectSelector';
import { ProjectSelectorPopupMenuStyleWrapper } from '../../../Nav/SideMenu/ProjectSelector/style';
import { ProjectSelectorModalProps } from './index.type';
import { useRef, useState } from 'react';
import CustomSelectSearchInput from '@actiontech/dms-kit/es/components/CustomSelect/CustomSelectSearchInput';
const ProjectSelectorModal: React.FC<ProjectSelectorModalProps> = ({
  onModalOk,
  open,
  projectSelectorOptions,
  projectSelectorValue,
  setProjectSelectorValue,
  onModalCancel
}) => {
  const { t } = useTranslation();
  const searchInputRef = useRef<InputRef>(null);
  const [searchValue, setSearchValue] = useState('');
  const renderDropdown: SelectProps['dropdownRender'] = (menu) => {
    return (
      <ProjectSelectorPopupMenuStyleWrapper>
        <CustomSelectSearchInput
          value={searchValue}
          onChange={setSearchValue}
          ref={searchInputRef}
        />
        <div className="select-options-group-label">
          {t('dmsProject.detail.projectSelectorDropdownSlot')}
        </div>
        <ProjectSelectorPopupMenuStyleWrapper>
          {menu}
        </ProjectSelectorPopupMenuStyleWrapper>
      </ProjectSelectorPopupMenuStyleWrapper>
    );
  };
  return (
    <BasicModal
      open={open}
      title={t('dmsProject.detail.modalTitle')}
      onCancel={onModalCancel}
      footer={
        <Space>
          <BasicButton onClick={onModalCancel}>
            {t('common.cancel')}
          </BasicButton>
          <BasicButton
            onClick={onModalOk}
            disabled={!projectSelectorValue}
            type="primary"
          >
            {t('common.ok')}
          </BasicButton>
        </Space>
      }
    >
      <SelectProjectModalContentStyleWrapper>
        <span className="modal-tips">{t('dmsProject.detail.modalTips')}</span>
        <ProjectSelector
          value={projectSelectorValue}
          onChange={setProjectSelectorValue}
          options={projectSelectorOptions}
          dropdownRender={renderDropdown}
          placement="bottomLeft"
          builtinPlacements={undefined}
          searchValue={searchValue}
          onSearch={setSearchValue}
          searchInputRef={searchInputRef}
        />
      </SelectProjectModalContentStyleWrapper>
    </BasicModal>
  );
};
export default ProjectSelectorModal;
