import classNames from 'classnames';
import {
  CommonIconStyleWrapper,
  CustomIconProps
} from '@actiontech/shared/lib/Icon';

export const IconRuleTitle = () => {
  return (
    <CommonIconStyleWrapper className="custom-icon">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="file-list-2-fill">
          <path
            id="Vector"
            d="M26.6667 29.3332H5.33333C4.97971 29.3332 4.64057 29.1927 4.39052 28.9426C4.14048 28.6926 4 28.3535 4 27.9998V3.99984C4 3.64622 4.14048 3.30708 4.39052 3.05703C4.64057 2.80698 4.97971 2.6665 5.33333 2.6665H26.6667C27.0203 2.6665 27.3594 2.80698 27.6095 3.05703C27.8595 3.30708 28 3.64622 28 3.99984V27.9998C28 28.3535 27.8595 28.6926 27.6095 28.9426C27.3594 29.1927 27.0203 29.3332 26.6667 29.3332ZM10.6667 9.33317V11.9998H21.3333V9.33317H10.6667ZM10.6667 14.6665V17.3332H21.3333V14.6665H10.6667ZM10.6667 19.9998V22.6665H17.3333V19.9998H10.6667Z"
            fill="#C3C6CD"
          />
        </g>
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconRuleItem = () => {
  return (
    <CommonIconStyleWrapper className="custom-icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="file-list-2-fill">
          <path
            id="Vector"
            d="M13.3333 14.6668H2.66667C2.48986 14.6668 2.32029 14.5966 2.19526 14.4716C2.07024 14.3465 2 14.177 2 14.0002V2.00016C2 1.82335 2.07024 1.65378 2.19526 1.52876C2.32029 1.40373 2.48986 1.3335 2.66667 1.3335H13.3333C13.5101 1.3335 13.6797 1.40373 13.8047 1.52876C13.9298 1.65378 14 1.82335 14 2.00016V14.0002C14 14.177 13.9298 14.3465 13.8047 14.4716C13.6797 14.5966 13.5101 14.6668 13.3333 14.6668ZM5.33333 4.66683V6.00016H10.6667V4.66683H5.33333ZM5.33333 7.3335V8.66683H10.6667V7.3335H5.33333ZM5.33333 10.0002V11.3335H8.66667V10.0002H5.33333Z"
            fill="#C3C6CD"
          />
        </g>
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconProjectFlag = ({
  className = '',
  color,
  width = 18,
  height = 18,
  ...props
}: CustomIconProps) => {
  return (
    <CommonIconStyleWrapper
      className={classNames(className, 'project-flag-icon')}
      {...props}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.25 2.25H9.2865C9.42575 2.25007 9.56222 2.28891 9.68064 2.36216C9.79907 2.43542 9.89476 2.54019 9.957 2.66475L10.5 3.75H15C15.1989 3.75 15.3897 3.82902 15.5303 3.96967C15.671 4.11032 15.75 4.30109 15.75 4.5V12.75C15.75 12.9489 15.671 13.1397 15.5303 13.2803C15.3897 13.421 15.1989 13.5 15 13.5H10.2135C10.0743 13.4999 9.93778 13.4611 9.81936 13.3878C9.70093 13.3146 9.60524 13.2098 9.543 13.0853L9 12H3.75V16.5H2.25V2.25Z"
          fill={color ? 'none' : 'currentColor'}
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconDatabaseType = ({
  className = '',
  color,
  width = 16,
  height = 16,
  ...props
}: CustomIconProps) => {
  return (
    <CommonIconStyleWrapper
      className={classNames(className, 'database-type-icon')}
      {...props}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="database-fill">
          <path
            id="Vector"
            d="M7.33331 4.66667V2.66667C7.33331 2.48986 7.40355 2.32029 7.52858 2.19526C7.6536 2.07024 7.82317 2 7.99998 2H14C14.1768 2 14.3464 2.07024 14.4714 2.19526C14.5964 2.32029 14.6666 2.48986 14.6666 2.66667V13.3333C14.6666 13.5101 14.5964 13.6797 14.4714 13.8047C14.3464 13.9298 14.1768 14 14 14H1.99998C1.82317 14 1.6536 13.9298 1.52858 13.8047C1.40355 13.6797 1.33331 13.5101 1.33331 13.3333V5.33333C1.33331 5.15652 1.40355 4.98695 1.52858 4.86193C1.6536 4.7369 1.82317 4.66667 1.99998 4.66667H7.33331ZM3.33331 10.6667V12H6.66665V10.6667H3.33331ZM9.33331 10.6667V12H12.6666V10.6667H9.33331ZM9.33331 8.66667V10H12.6666V8.66667H9.33331ZM9.33331 6.66667V8H12.6666V6.66667H9.33331ZM3.33331 8.66667V10H6.66665V8.66667H3.33331Z"
            fill={color ? 'none' : 'currentColor'}
          />
        </g>
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconDisabledRule = ({
  width = 10,
  height = 10
}: CustomIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="Vector"
        d="M1.5 1.5L8.5 8.5M1.5 8.5L8.5 1.5"
        stroke="#F66074"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const IconEnabledRule = ({
  width = 10,
  height = 10
}: CustomIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="Vector"
        d="M5.01945 0.5L5.00768 9.5M0.5 5H9.5"
        stroke="#1CB889"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const IconCloneRule = ({
  className = '',
  width = 16,
  height = 16,
  ...props
}: CustomIconProps) => {
  return (
    <CommonIconStyleWrapper
      className={classNames(className, 'clone-rule-icon')}
      {...props}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="checkbox-multiple-blank-fill">
          <path
            id="Vector"
            d="M4.66659 4.66683V2.00016C4.66659 1.82335 4.73682 1.65378 4.86185 1.52876C4.98687 1.40373 5.15644 1.3335 5.33325 1.3335H13.9999C14.1767 1.3335 14.3463 1.40373 14.4713 1.52876C14.5963 1.65378 14.6666 1.82335 14.6666 2.00016V10.6668C14.6666 10.8436 14.5963 11.0132 14.4713 11.1382C14.3463 11.2633 14.1767 11.3335 13.9999 11.3335H11.3333V13.9955C11.3333 14.3662 11.0339 14.6668 10.6619 14.6668H2.00459C1.9164 14.6669 1.82906 14.6496 1.74757 14.6159C1.66608 14.5822 1.59204 14.5328 1.52969 14.4704C1.46733 14.408 1.41788 14.334 1.38418 14.2525C1.35047 14.171 1.33316 14.0837 1.33325 13.9955L1.33525 5.33816C1.33525 4.9675 1.63459 4.66683 2.00659 4.66683H4.66659ZM5.99992 4.66683H10.6619C11.0326 4.66683 11.3333 4.96616 11.3333 5.33816V10.0002H13.3333V2.66683H5.99992V4.66683Z"
            fill="#C3C6CD"
          />
        </g>
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconExportRule = ({
  className = '',
  width = 16,
  height = 16,
  ...props
}: CustomIconProps) => {
  return (
    <CommonIconStyleWrapper
      className={classNames(className, 'export-rule-icon')}
      {...props}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="logout-box-fill">
          <path
            id="Vector"
            d="M3.33341 1.3335H12.6667C13.0349 1.3335 13.3334 1.63198 13.3334 2.00016V14.0002C13.3334 14.3684 13.0349 14.6668 12.6667 14.6668H3.33341C2.96523 14.6668 2.66675 14.3684 2.66675 14.0002V2.00016C2.66675 1.63198 2.96523 1.3335 3.33341 1.3335ZM6.00008 7.3335V5.3335L2.66675 8.00016L6.00008 10.6668V8.66683H10.0001V7.3335H6.00008Z"
            fill="#C3C6CD"
          />
        </g>
      </svg>
    </CommonIconStyleWrapper>
  );
};
