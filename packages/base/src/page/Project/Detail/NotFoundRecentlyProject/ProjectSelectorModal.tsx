import { SelectProps, Space } from 'antd5';
import { BasicButton, BasicModal } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { SelectProjectModalContentStyleWrapper } from './style';
import ProjectSelector from '../../../Nav/SideMenu/ProjectSelector';
import { ProjectSelectorPopupMenuStyleWrapper } from '../../../Nav/SideMenu/ProjectSelector/style';
import { ProjectSelectorModalProps } from './index.type';

const ProjectSelectorModal: React.FC<ProjectSelectorModalProps> = ({
  onModalOk,
  open,
  projectSelectorOptions,
  projectSelectorValue,
  setProjectSelectorValue,
  onModalCancel
}) => {
  const { t } = useTranslation();

  const renderDropdown: SelectProps['dropdownRender'] = (menu) => {
    return (
      <>
        <ProjectSelectorPopupMenuStyleWrapper>
          {menu}
        </ProjectSelectorPopupMenuStyleWrapper>
      </>
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
        <span>{t('dmsProject.detail.modalTips')}</span>
        <ProjectSelector
          value={projectSelectorValue}
          onChange={setProjectSelectorValue}
          options={projectSelectorOptions}
          dropdownSlot={
            <div className="select-options-group-label">
              {t('dmsProject.detail.projectSelectorDropdownSlot')}
            </div>
          }
          dropdownRender={renderDropdown}
          placement="bottomLeft"
          builtinPlacements={undefined}
        />
      </SelectProjectModalContentStyleWrapper>
    </BasicModal>
  );
};

export default ProjectSelectorModal;
