import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import {
  MockSelectItemOptionsStyleWrapper,
  ProjectSelectorLabelStyleWrapper
} from './style';
import { IBindProject } from './index.type';
import { FlagFilled, LockOutlined } from '@actiontech/icons';

const MockSelectItemOptions: React.FC<{
  list: IBindProject[];
  closeSelectDropdown: () => void;
}> = ({ list, closeSelectDropdown }) => {
  const navigate = useNavigate();
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
