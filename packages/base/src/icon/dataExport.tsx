import { CustomIconProps } from '@actiontech/shared/lib/Icon/index.type';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/Icon/style';
import classnames from 'classnames';

export const IconMinus: React.FC<CustomIconProps> = ({
  className,
  ...props
}) => {
  return (
    <CommonIconStyleWrapper
      role="img"
      className={classnames(className, 'custom-icon custom-icon-minus')}
      {...props}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7.00002 12.8333C3.77827 12.8333 1.16669 10.2217 1.16669 6.99996C1.16669 3.77821 3.77827 1.16663 7.00002 1.16663C10.2218 1.16663 12.8334 3.77821 12.8334 6.99996C12.8334 10.2217 10.2218 12.8333 7.00002 12.8333ZM7.00002 11.6666C8.2377 11.6666 9.42468 11.175 10.2999 10.2998C11.175 9.42462 11.6667 8.23764 11.6667 6.99996C11.6667 5.76228 11.175 4.5753 10.2999 3.70013C9.42468 2.82496 8.2377 2.33329 7.00002 2.33329C5.76234 2.33329 4.57536 2.82496 3.70019 3.70013C2.82502 4.5753 2.33335 5.76228 2.33335 6.99996C2.33335 8.23764 2.82502 9.42462 3.70019 10.2998C4.57536 11.175 5.76234 11.6666 7.00002 11.6666ZM4.08335 6.41663H9.91669V7.58329H4.08335V6.41663Z" />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconExportWorkflowCreateTitle: React.FC<CustomIconProps> = ({
  className
}) => {
  return (
    <CommonIconStyleWrapper
      className={classnames(
        className,
        'custom-icon order-create-title-icon title-icon'
      )}
    >
      <svg
        width="24"
        height="28"
        viewBox="0 0 24 28"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 3.33333V8.66666H20V3.33333H22.6755C23.4069 3.33333 24 3.9266 24 4.65786V26.0088C24 26.7403 23.4068 27.3333 22.6755 27.3333H1.32453C0.593013 27.3333 0 26.7401 0 26.0088V4.65786C0 3.92634 0.593267 3.33333 1.32453 3.33333H4ZM8 20.6667H5.33333V23.3333H8V20.6667ZM8 16.6667H5.33333V19.3333H8V16.6667ZM8 12.6667H5.33333V15.3333H8V12.6667ZM17.3333 0.666664V6H6.66667V0.666664H17.3333Z"
          fill="currentColor"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};
