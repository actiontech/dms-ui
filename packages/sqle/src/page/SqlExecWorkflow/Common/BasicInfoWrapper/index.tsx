import classNames from 'classnames';
import { BasicInfoStyleWrapper } from './style';
import { BasicInfoWrapperProps } from './index.type';
import { EmptyBox, BasicTag, TypedLink } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { execWorkflowStatusDictionary } from '../../../../hooks/useStaticStatus/index.data';
import { Space } from 'antd';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const BasicInfoWrapper: React.FC<BasicInfoWrapperProps> = ({
  title,
  desc,
  className,
  status,
  gap = 12,
  sqlVersion
}) => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  return (
    <BasicInfoStyleWrapper
      className={classNames(className)}
      gap={gap}
      status={status}
    >
      <EmptyBox if={!!status}>
        <div className="workflow-base-info-status">
          <svg
            width="74"
            height="55"
            viewBox="0 0 74 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="icon-workflow-status-wrapper"
          >
            <g filter="url(#filter0_d_1360_13602)">
              <path
                d="M69 0H5V31.6481C5 33.2482 5.95359 34.6944 7.42432 35.3247L33.8487 46.6494C35.861 47.5119 38.139 47.5119 40.1514 46.6494L66.5757 35.3247C68.0464 34.6944 69 33.2482 69 31.6481V0Z"
                fill="currentColor"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_1360_13602"
                x="0"
                y="-3"
                width="74"
                height="57.2961"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="2" />
                <feGaussianBlur stdDeviation="2.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.454902 0 0 0 0 0.32549 0 0 0 0 0.854902 0 0 0 0.4 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_2935_18512"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2935_18512"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
          <span className="workflow-base-info-status-text">
            {status && t(execWorkflowStatusDictionary[status])}
          </span>
        </div>
      </EmptyBox>

      <Space className="workflow-base-info-title">
        {title}
        <EmptyBox
          if={!!sqlVersion?.sql_version_id && !!sqlVersion?.sql_version_name}
        >
          <TypedLink
            to={ROUTE_PATHS.SQLE.VERSION_MANAGEMENT.detail}
            params={{
              projectID,
              versionId: sqlVersion?.sql_version_id?.toString() ?? ''
            }}
          >
            <BasicTag color="orange" size="large">
              {t('execWorkflow.list.version')}：{sqlVersion?.sql_version_name}
            </BasicTag>
          </TypedLink>
        </EmptyBox>
      </Space>
      <div className="workflow-base-info-desc">{desc ?? '-'}</div>
    </BasicInfoStyleWrapper>
  );
};

export default BasicInfoWrapper;
