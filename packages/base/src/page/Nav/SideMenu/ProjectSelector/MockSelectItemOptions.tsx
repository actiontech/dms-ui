import { useState } from 'react';
import classNames from 'classnames';
import {
  MockSelectItemOptionsStyleWrapper,
  ProjectSelectorLabelStyleWrapper
} from './style';
import { IBindProject } from './index.type';
import { FlagFilled, LockOutlined } from '@actiontech/icons';
import { useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';

const MockSelectItemOptions: React.FC<{
  list: IBindProject[];
  closeSelectDropdown: () => void;
}> = ({ list, closeSelectDropdown }) => {
  const navigate = useTypedNavigate();
  const [activeId, setActiveId] = useState('');
  return (
    <MockSelectItemOptionsStyleWrapper>
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
              navigate(ROUTE_PATHS.SQLE.PROJECT_OVERVIEW.index, {
                params: { projectID: v.project_id ?? '' }
              });
              closeSelectDropdown();
            }}
            key={v.project_id}
            className={classNames(`ant-select-item ant-select-item-option`, {
              [`ant-select-item-option-active`]: activeId === v.project_id
            })}
          >
            <div className={`ant-select-item-option-content`}>
              <ProjectSelectorLabelStyleWrapper>
                {v.archived ? (
                  <LockOutlined width={18} height={18} />
                ) : (
                  <FlagFilled
                    color="currentColor"
                    width={18}
                    height={18}
                    className="project-flag-icon"
                  />
                )}

                <span className="project-selector-label-text">
                  {v.project_name}
                </span>
              </ProjectSelectorLabelStyleWrapper>
            </div>
          </div>
        );
      })}
    </MockSelectItemOptionsStyleWrapper>
  );
};

export default MockSelectItemOptions;
