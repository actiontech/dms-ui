import { useTranslation } from 'react-i18next';
import { BasicTag } from '@actiontech/shared';
import { Space } from 'antd';
import { useMemo, useState } from 'react';
import { FlagFilled } from '@actiontech/icons';
import { useCurrentProject } from '@actiontech/shared/lib/features';

export interface ProjectTagListProps {
  projectList?: string[];
  maxDisplayCount?: number;
  highlightCurrentProject?: boolean;
}

const ProjectTagList: React.FC<ProjectTagListProps> = ({
  projectList = [],
  maxDisplayCount = 3,
  highlightCurrentProject
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const { projectName } = useCurrentProject();

  const displayProjects = useMemo(() => {
    return expanded ? projectList : projectList.slice(0, maxDisplayCount);
  }, [expanded, projectList, maxDisplayCount]);

  if (!Array.isArray(projectList) || projectList.length === 0) {
    return <>-</>;
  }

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const hasMoreProjects = projectList.length > maxDisplayCount;

  return (
    <Space size={[0, 4]} wrap>
      {displayProjects.map((project) => (
        <BasicTag
          style={{ height: 28 }}
          size="small"
          color={
            project === projectName && highlightCurrentProject
              ? 'orange'
              : 'gray'
          }
          key={project}
        >
          <FlagFilled />
          {project}
        </BasicTag>
      ))}

      {hasMoreProjects && !expanded && (
        <BasicTag
          style={{ height: 28, cursor: 'pointer' }}
          size="small"
          color="blue"
          onClick={handleToggleExpand}
        >
          {t('dmsUserCenter.user.userList.columns.projectsCount', {
            count: projectList.length - maxDisplayCount
          })}
        </BasicTag>
      )}

      {expanded && (
        <BasicTag
          style={{ height: 28, cursor: 'pointer' }}
          size="small"
          color="blue"
          onClick={handleToggleExpand}
        >
          {t('common.collapse')}
        </BasicTag>
      )}
    </Space>
  );
};

export default ProjectTagList;
