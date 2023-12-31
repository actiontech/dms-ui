import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { ProjectSelectorLabelStyleWrapper } from './style';
import {
  IconProjectArchived,
  IconProjectFlag
} from '@actiontech/shared/lib/Icon/common';
import { CustomSelectPopupMenuStyleWrapper } from '@actiontech/shared/lib/components/CustomSelect/style';
import { IBindProject } from './index.type';

const MockSelectItemOptions: React.FC<{
  list: IBindProject[];
  closeSelectDropdown: () => void;
}> = ({ list, closeSelectDropdown }) => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState('');
  return (
    <CustomSelectPopupMenuStyleWrapper>
      {list.map((v) => {
        return (
          <div
            onMouseEnter={() => {
              setActiveId(v.project_id ?? '');
            }}
            onMouseLeave={() => {
              setActiveId('');
            }}
            onClick={() => {
              navigate(`/sqle/project/${v.project_id}/overview`);
              closeSelectDropdown();
            }}
            key={v.project_id}
            className={classNames(`ant-select-item ant-select-item-option`, {
              [`ant-select-item-option-active`]: activeId === v.project_id
            })}
          >
            <div className={`ant-select-item-option-content`}>
              <ProjectSelectorLabelStyleWrapper>
                {v.archived ? <IconProjectArchived /> : <IconProjectFlag />}

                <span className="project-selector-label-text">
                  {v.project_name}
                </span>
              </ProjectSelectorLabelStyleWrapper>
            </div>
          </div>
        );
      })}
    </CustomSelectPopupMenuStyleWrapper>
  );
};

export default MockSelectItemOptions;
