import { IUserBindProject } from '@actiontech/shared/lib/api/base/service/common';
import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';
import { ProjectSelectorLabelStyleWrapper } from './style';
import { IconProjectFlag } from '@actiontech/shared/lib/Icon/common';
import { CustomSelectPopupMenuStyleWrapper } from '@actiontech/shared/lib/components/CustomSelect/style';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import classNames from 'classnames';

const MockSelectItemOptions: React.FC<{
  list: IUserBindProject[];
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
            className={classNames(
              `${ANTD_PREFIX_STR}-select-item ${ANTD_PREFIX_STR}-select-item-option`,
              {
                [`${ANTD_PREFIX_STR}-select-item-option-active`]:
                  activeId === v.project_id
              }
            )}
          >
            <div className={`${ANTD_PREFIX_STR}-select-item-option-content`}>
              <ProjectSelectorLabelStyleWrapper>
                <IconProjectFlag />

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
