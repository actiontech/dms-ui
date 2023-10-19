import classNames from 'classnames';
import { CustomIconProps } from '../index.type';
import { CommonIconStyleWrapper } from '../style';

export const IconLevelError: React.FC<CustomIconProps> = ({
  className = '',
  width = 18,
  height = 19
}) => {
  return (
    <CommonIconStyleWrapper
      role="img"
      className={classNames(className, 'custom-icon custom-icon-level-error')}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 18 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 17C4.85775 17 1.5 13.6423 1.5 9.5C1.5 5.35775 4.85775 2 9 2C13.1423 2 16.5 5.35775 16.5 9.5C16.5 13.6423 13.1423 17 9 17ZM9 8.4395L6.879 6.31775L5.81775 7.379L7.9395 9.5L5.81775 11.621L6.879 12.6823L9 10.5605L11.121 12.6823L12.1823 11.621L10.0605 9.5L12.1823 7.379L11.121 6.31775L9 8.4395Z"
          fill="#F66074"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};
export const IconLevelNormal: React.FC<CustomIconProps> = ({
  className = '',
  width = 18,
  height = 19
}) => {
  return (
    <CommonIconStyleWrapper
      role="img"
      className={classNames(className, 'custom-icon custom-icon-level-normal')}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 18 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 17H3C2.80109 17 2.61032 16.921 2.46967 16.7803C2.32902 16.6397 2.25 16.4489 2.25 16.25V2.75C2.25 2.55109 2.32902 2.36032 2.46967 2.21967C2.61032 2.07902 2.80109 2 3 2H15C15.1989 2 15.3897 2.07902 15.5303 2.21967C15.671 2.36032 15.75 2.55109 15.75 2.75V16.25C15.75 16.4489 15.671 16.6397 15.5303 16.7803C15.3897 16.921 15.1989 17 15 17ZM6 5.75V7.25H12V5.75H6ZM6 8.75V10.25H12V8.75H6ZM6 11.75V13.25H9.75V11.75H6Z"
          fill="#7D8CA8"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconLevelWarn: React.FC<CustomIconProps> = ({
  className = '',
  width = 18,
  height = 19
}) => {
  return (
    <CommonIconStyleWrapper
      role="img"
      className={classNames(className, 'custom-icon custom-icon-level-warn')}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 18 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.64875 2.75013L16.7934 15.1252C17.0005 15.4839 16.8776 15.9426 16.5189 16.1496C16.4049 16.2155 16.2756 16.2502 16.1439 16.2502H1.85449C1.44027 16.2502 1.10449 15.9144 1.10449 15.5002C1.10449 15.3685 1.13914 15.2392 1.20497 15.1252L8.34967 2.75013C8.55682 2.3914 9.01545 2.2685 9.37417 2.47561C9.48825 2.54143 9.5829 2.63611 9.64875 2.75013ZM8.24917 12.5002V14.0002H9.74917V12.5002H8.24917ZM8.24917 7.25013V11.0002H9.74917V7.25013H8.24917Z"
          fill="#EBAD1C"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconLevelNotice: React.FC<CustomIconProps> = ({
  className = '',
  width = 18,
  height = 19
}) => {
  return (
    <CommonIconStyleWrapper
      role="img"
      className={classNames(className, 'custom-icon custom-icon-level-notice')}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 18 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.9513 2.37573L16.125 6.54946V12.452L11.9513 16.6257H6.04873L1.875 12.452V6.54946L6.04873 2.37573H11.9513ZM8.24948 11.7501V13.2501H9.74948V11.7501H8.24948ZM8.24948 5.75018V10.2501H9.74948V5.75018H8.24948Z"
          fill="#6094FC"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};
