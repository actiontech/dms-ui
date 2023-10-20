import {
  CustomIconProps,
  CommonIconStyleWrapper
} from '@actiontech/shared/lib/Icon';

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

export const IconOrderId = () => {
  return (
    <CommonIconStyleWrapper className="custom-icon">
      <svg
        width="12"
        height="14"
        viewBox="0 0 12 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 1.66671V4.33337H10V1.66671H11.3377C11.7035 1.66671 12 1.96334 12 2.32897V13.0044C12 13.3702 11.7034 13.6667 11.3377 13.6667H0.662267C0.296507 13.6667 0 13.3701 0 13.0044V2.32897C0 1.96321 0.296633 1.66671 0.662267 1.66671H2ZM4 10.3334H2.66667V11.6667H4V10.3334ZM4 8.33337H2.66667V9.66671H4V8.33337ZM4 6.33337H2.66667V7.66671H4V6.33337ZM8.66667 0.333374V3.00004H3.33333V0.333374H8.66667Z"
          fill="#C3C6CD"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderStatusIsWaitAudit = () => {
  return (
    <CommonIconStyleWrapper className="custom-icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.875 1.51554C7.57115 1.11362 8.42885 1.11362 9.125 1.51554L13.0532 3.78349C13.7494 4.18542 14.1782 4.9282 14.1782 5.73205V10.2679C14.1782 11.0718 13.7494 11.8146 13.0532 12.2165L9.125 14.4845C8.42885 14.8864 7.57115 14.8864 6.875 14.4845L2.9468 12.2165C2.25064 11.8146 1.8218 11.0718 1.8218 10.2679V5.73205C1.8218 4.9282 2.25064 4.18542 2.9468 3.78349L6.875 1.51554Z"
          stroke="#7453DA"
          strokeWidth="1.5"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderStatusIsWaitExecution = () => {
  return (
    <CommonIconStyleWrapper className="custom-icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.875 1.51554C7.57115 1.11362 8.42885 1.11362 9.125 1.51554L13.0532 3.78349C13.7494 4.18542 14.1782 4.9282 14.1782 5.73205V10.2679C14.1782 11.0718 13.7494 11.8146 13.0532 12.2165L9.125 14.4845C8.42885 14.8864 7.57115 14.8864 6.875 14.4845L2.9468 12.2165C2.25064 11.8146 1.8218 11.0718 1.8218 10.2679V5.73205C1.8218 4.9282 2.25064 4.18542 2.9468 3.78349L6.875 1.51554Z"
          stroke="#7470ED"
          strokeWidth="1.5"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 3.15466V7.99996L12.2067 10.4038C12.2864 10.2588 12.3301 10.0938 12.3301 9.92261V6.07731C12.3301 5.72005 12.1395 5.38992 11.8301 5.21129L8.5 3.28864C8.3453 3.19932 8.17265 3.15466 8 3.15466Z"
          fill="#7470ED"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderStatusIsExecScheduled = () => {
  return (
    <CommonIconStyleWrapper className="custom-icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.875 1.51554C7.57115 1.11362 8.42885 1.11362 9.125 1.51554L13.0532 3.78349C13.7494 4.18542 14.1782 4.9282 14.1782 5.73205V10.2679C14.1782 11.0718 13.7494 11.8146 13.0532 12.2165L9.125 14.4845C8.42885 14.8864 7.57115 14.8864 6.875 14.4845L2.9468 12.2165C2.25064 11.8146 1.8218 11.0718 1.8218 10.2679V5.73205C1.8218 4.9282 2.25064 4.18542 2.9468 3.78349L6.875 1.51554Z"
          stroke="#6094FC"
          strokeWidth="1.5"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.99995 3.15479V8.00008L3.79321 10.4039C3.87976 10.5616 4.00868 10.6957 4.16982 10.7888L7.49995 12.7114C7.80935 12.89 8.19055 12.89 8.49995 12.7114L11.8301 10.7888C12.1395 10.6101 12.3301 10.28 12.3301 9.92273V6.07744C12.3301 5.72017 12.1395 5.39004 11.8301 5.21141L8.49995 3.28876C8.34525 3.19944 8.1726 3.15478 7.99995 3.15479Z"
          fill="#6094FC"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderStatusIsExecuting = () => {
  return (
    <CommonIconStyleWrapper className="custom-icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.875 1.51554C7.57115 1.11362 8.42885 1.11362 9.125 1.51554L13.0532 3.78349C13.7494 4.18542 14.1782 4.9282 14.1782 5.73205V10.2679C14.1782 11.0718 13.7494 11.8146 13.0532 12.2165L9.125 14.4845C8.42885 14.8864 7.57115 14.8864 6.875 14.4845L2.9468 12.2165C2.25064 11.8146 1.8218 11.0718 1.8218 10.2679V5.73205C1.8218 4.9282 2.25064 4.18542 2.9468 3.78349L6.875 1.51554Z"
          stroke="#6094FC"
          strokeWidth="1.5"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.99995 3.15466V7.99996L3.79321 10.4038C3.87976 10.5615 4.00868 10.6956 4.16982 10.7886L7.49995 12.7113C7.80935 12.8899 8.19055 12.8899 8.49995 12.7113L11.8301 10.7886C12.1395 10.61 12.3301 10.2799 12.3301 9.92261V6.07731C12.3301 5.72005 12.1395 5.38992 11.8301 5.21129L8.49995 3.28864C8.34525 3.19932 8.1726 3.15466 7.99995 3.15466Z"
          fill="#6094FC"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderStatusIsFinished = () => {
  return (
    <CommonIconStyleWrapper className="custom-icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.875 1.51554C7.57115 1.11362 8.42885 1.11362 9.125 1.51554L13.0532 3.78349C13.7494 4.18542 14.1782 4.9282 14.1782 5.73205V10.2679C14.1782 11.0718 13.7494 11.8146 13.0532 12.2165L9.125 14.4845C8.42885 14.8864 7.57115 14.8864 6.875 14.4845L2.9468 12.2165C2.25064 11.8146 1.8218 11.0718 1.8218 10.2679V5.73205C1.8218 4.9282 2.25064 4.18542 2.9468 3.78349L6.875 1.51554Z"
          stroke="#41BF9A"
          strokeWidth="1.5"
        />
        <path
          d="M5.08325 7.99996L7.16659 10.0833L11.3333 5.91663"
          stroke="#41BF9A"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderStatusIsRejected = () => {
  return (
    <CommonIconStyleWrapper className="custom-icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.875 1.51554C7.57115 1.11362 8.42885 1.11362 9.125 1.51554L13.0532 3.78349C13.7494 4.18542 14.1782 4.9282 14.1782 5.73205V10.2679C14.1782 11.0718 13.7494 11.8146 13.0532 12.2165L9.125 14.4845C8.42885 14.8864 7.57115 14.8864 6.875 14.4845L2.9468 12.2165C2.25064 11.8146 1.8218 11.0718 1.8218 10.2679V5.73205C1.8218 4.9282 2.25064 4.18542 2.9468 3.78349L6.875 1.51554Z"
          stroke="#EBAD1C"
          strokeWidth="1.5"
        />
        <path d="M5 8H11" stroke="#EBAD1C" strokeWidth="1.5" />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderStatusIsFailed = () => {
  return (
    <CommonIconStyleWrapper className="custom-icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.875 1.51554C7.57115 1.11362 8.42885 1.11362 9.125 1.51554L13.0532 3.78349C13.7494 4.18542 14.1782 4.9282 14.1782 5.73205V10.2679C14.1782 11.0718 13.7494 11.8146 13.0532 12.2165L9.125 14.4845C8.42885 14.8864 7.57115 14.8864 6.875 14.4845L2.9468 12.2165C2.25064 11.8146 1.8218 11.0718 1.8218 10.2679V5.73205C1.8218 4.9282 2.25064 4.18542 2.9468 3.78349L6.875 1.51554Z"
          stroke="#F59957"
          strokeWidth="1.5"
        />
        <path d="M8 10L8 12" stroke="#F59957" strokeWidth="1.5" />
        <path d="M8 4L8.00415 8.5" stroke="#F59957" strokeWidth="1.5" />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderStatusIsCanceled = () => {
  return (
    <CommonIconStyleWrapper className="custom-icon">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.875 1.51554C7.57115 1.11362 8.42885 1.11362 9.125 1.51554L13.0532 3.78349C13.7494 4.18542 14.1782 4.9282 14.1782 5.73205V10.2679C14.1782 11.0718 13.7494 11.8146 13.0532 12.2165L9.125 14.4845C8.42885 14.8864 7.57115 14.8864 6.875 14.4845L2.9468 12.2165C2.25064 11.8146 1.8218 11.0718 1.8218 10.2679V5.73205C1.8218 4.9282 2.25064 4.18542 2.9468 3.78349L6.875 1.51554Z"
          stroke="#7D8CA8"
          strokeWidth="1.5"
        />
        <path
          d="M5.91675 5.91663L10.0834 10.0833"
          stroke="#7D8CA8"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M5.91675 10.0833L10.0834 5.91663"
          stroke="#7D8CA8"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderCreateTitle: React.FC<CustomIconProps> = ({
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

export const IconOrderSQLUpload: React.FC<CustomIconProps> = ({
  className
}) => {
  return (
    <CommonIconStyleWrapper className={classnames(className, 'custom-icon ')}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 7.5H3V14.25H15V7.5ZM2.25 2.25H15.75C16.1642 2.25 16.5 2.58579 16.5 3V15C16.5 15.4142 16.1642 15.75 15.75 15.75H2.25C1.83579 15.75 1.5 15.4142 1.5 15V3C1.5 2.58579 1.83579 2.25 2.25 2.25ZM3.75 4.5V6H5.25V4.5H3.75ZM6.75 4.5V6H8.25V4.5H6.75ZM3.75 8.25H6V12H3.75V8.25Z"
          fill="currentColor"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderFileUpload: React.FC<CustomIconProps> = ({
  className
}) => {
  return (
    <CommonIconStyleWrapper className={classnames(className, 'custom-icon ')}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 1.5L15.75 5.25V15.756C15.7498 15.9534 15.6712 16.1426 15.5316 16.2821C15.392 16.4216 15.2026 16.5 15.0052 16.5H2.99475C2.79778 16.4986 2.60926 16.4198 2.46991 16.2806C2.33056 16.1414 2.25157 15.953 2.25 15.756V2.244C2.25 1.833 2.58375 1.5 2.99475 1.5H12ZM9.75 9H12L9 6L6 9H8.25V12H9.75V9Z"
          fill="currentColor"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderDownloadReport: React.FC<CustomIconProps> = ({
  className
}) => {
  return (
    <CommonIconStyleWrapper className={classnames(className, 'custom-icon ')}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 6V13.9953C14.0006 14.0829 13.984 14.1697 13.951 14.2508C13.9181 14.3319 13.8695 14.4058 13.808 14.4681C13.7466 14.5304 13.6734 14.5801 13.5928 14.6141C13.5121 14.6482 13.4255 14.6661 13.338 14.6667H2.662C2.48654 14.6667 2.31826 14.597 2.19413 14.473C2.07 14.349 2.00018 14.1808 2 14.0053V1.99466C2 1.63666 2.298 1.33333 2.66533 1.33333H9.33333V5.33333C9.33333 5.51014 9.40357 5.67971 9.52859 5.80473C9.65362 5.92976 9.82319 6 10 6H14ZM14 4.66666H10.6667V1.33533L14 4.66666ZM5.33333 4.66666V6H7.33333V4.66666H5.33333ZM5.33333 7.33333V8.66666H10.6667V7.33333H5.33333ZM5.33333 10V11.3333H10.6667V10H5.33333Z"
          fill="currentColor"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderDownloadSQL: React.FC<CustomIconProps> = ({
  className
}) => {
  return (
    <CommonIconStyleWrapper className={classnames(className, 'custom-icon')}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13.333 6.66667H2.66634V12.6667H13.333V6.66667ZM1.99967 2H13.9997C14.3679 2 14.6663 2.29848 14.6663 2.66667V13.3333C14.6663 13.7015 14.3679 14 13.9997 14H1.99967C1.63149 14 1.33301 13.7015 1.33301 13.3333V2.66667C1.33301 2.29848 1.63149 2 1.99967 2ZM3.33301 4V5.33333H4.66634V4H3.33301ZM5.99967 4V5.33333H7.33301V4H5.99967ZM3.33301 7.33333H5.33301V10.6667H3.33301V7.33333Z"
          fill="currentColor"
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderStatusWrapper: React.FC<
  CustomIconProps & { filter?: string }
> = ({ color, filter = 'filter0_d_1360_13602' }) => {
  return (
    <CommonIconStyleWrapper className="icon-order-status-wrapper">
      <svg
        width="74"
        height="55"
        viewBox="0 0 74 55"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter={`url(#${filter})`}>
          <path
            d="M69 0H5V31.6481C5 33.2482 5.95359 34.6944 7.42432 35.3247L33.8487 46.6494C35.861 47.5119 38.139 47.5119 40.1514 46.6494L66.5757 35.3247C68.0464 34.6944 69 33.2482 69 31.6481V0Z"
            fill={color ?? 'currentColor'}
          />
        </g>
        <defs>
          <filter
            id={filter}
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
    </CommonIconStyleWrapper>
  );
};

export const IconOrderRejectReason: React.FC = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 11.6736C20.0907 11.2417 19.0736 11 18 11C14.134 11 11 14.134 11 18C11 19.4872 11.4638 20.8662 12.2547 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918C3 2.44405 3.44495 2 3.9934 2H16L21 7V11.6736ZM18 23C15.2386 23 13 20.7614 13 18C13 15.2386 15.2386 13 18 13C20.7614 13 23 15.2386 23 18C23 20.7614 20.7614 23 18 23ZM16.7066 20.7076C17.0982 20.895 17.5369 21 18 21C19.6569 21 21 19.6569 21 18C21 17.5369 20.895 17.0982 20.7076 16.7066L16.7066 20.7076ZM15.2924 19.2934L19.2934 15.2924C18.9018 15.105 18.4631 15 18 15C16.3431 15 15 16.3431 15 18C15 18.4631 15.105 18.9018 15.2924 19.2934Z"
        fill="#EBAD1C"
      />
    </svg>
  );
};

export const IconOrderResultLayout: React.FC<CustomIconProps> = ({
  className
}) => {
  return (
    <CommonIconStyleWrapper className={classnames(className, 'custom-icon ')}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="layout-bottom-2-line">
          <path
            id="Vector"
            d="M12.2501 1.75C12.5723 1.75 12.8334 2.01117 12.8334 2.33333V11.6667C12.8334 11.9888 12.5723 12.25 12.2501 12.25H1.75008C1.42792 12.25 1.16675 11.9888 1.16675 11.6667V2.33333C1.16675 2.01117 1.42792 1.75 1.75008 1.75H12.2501ZM11.6667 2.91667H2.33341V11.0833H11.6667V2.91667ZM10.5001 8.75V9.91667H3.50008V8.75H10.5001Z"
            fill="#292C33"
          />
        </g>
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderResultListLayout: React.FC<CustomIconProps> = ({
  className
}) => {
  return (
    <CommonIconStyleWrapper className={classnames(className, 'custom-icon ')}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="layout-bottom-2-fill">
          <path
            id="Vector"
            d="M13.9999 2C14.3681 2 14.6666 2.29848 14.6666 2.66667V13.3333C14.6666 13.7015 14.3681 14 13.9999 14H1.99992C1.63173 14 1.33325 13.7015 1.33325 13.3333V2.66667C1.33325 2.29848 1.63173 2 1.99992 2H13.9999ZM12.6666 10.6667H3.33325V12H12.6666V10.6667Z"
            fill="#8A8F99"
          />
        </g>
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderResultWaterFallLayout: React.FC<CustomIconProps> = ({
  className
}) => {
  return (
    <CommonIconStyleWrapper className={classnames(className, 'custom-icon ')}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="layout-row-fill">
          <path
            id="Vector"
            d="M12.6667 8H3.33333V12.6667H12.6667V8ZM2.66667 2H13.3333C13.7015 2 14 2.29848 14 2.66667V13.3333C14 13.7015 13.7015 14 13.3333 14H2.66667C2.29848 14 2 13.7015 2 13.3333V2.66667C2 2.29848 2.29848 2 2.66667 2Z"
            fill="#8A8F99"
          />
        </g>
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderAuditResultSuccess: React.FC<CustomIconProps> = ({
  className
}) => {
  return (
    <CommonIconStyleWrapper className={classnames(className, 'custom-icon ')}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="checkbox-circle-fill">
          <path
            id="Vector"
            d="M8.00004 14.6666C4.31804 14.6666 1.33337 11.6819 1.33337 7.99992C1.33337 4.31792 4.31804 1.33325 8.00004 1.33325C11.682 1.33325 14.6667 4.31792 14.6667 7.99992C14.6667 11.6819 11.682 14.6666 8.00004 14.6666ZM7.33537 10.6666L12.0487 5.95259L11.106 5.00992L7.33537 8.78125L5.44937 6.89525L4.50671 7.83792L7.33537 10.6666Z"
            fill="#41BF9A"
          />
        </g>
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderAuditResultNotice: React.FC<CustomIconProps> = ({
  className
}) => {
  return (
    <CommonIconStyleWrapper className={classnames(className, 'custom-icon ')}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="spam-2-fill">
          <path
            id="Vector"
            d="M10.6234 1.66724L14.3334 5.37722V10.6239L10.6234 14.3339H5.37673L1.66675 10.6239V5.37722L5.37673 1.66724H10.6234ZM7.33295 10V11.3334H8.66628V10H7.33295ZM7.33295 4.66674V8.66672H8.66628V4.66674H7.33295Z"
            fill="#6094FC"
          />
        </g>
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderAuditResultError: React.FC<CustomIconProps> = ({
  className
}) => {
  return (
    <CommonIconStyleWrapper className={classnames(className, 'custom-icon ')}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="close-circle-fill">
          <path
            id="Vector"
            d="M7.99992 14.6666C4.31792 14.6666 1.33325 11.6819 1.33325 7.99992C1.33325 4.31792 4.31792 1.33325 7.99992 1.33325C11.6819 1.33325 14.6666 4.31792 14.6666 7.99992C14.6666 11.6819 11.6819 14.6666 7.99992 14.6666ZM7.99992 7.05725L6.11459 5.17125L5.17125 6.11459L7.05725 7.99992L5.17125 9.88525L6.11459 10.8286L7.99992 8.94258L9.88525 10.8286L10.8286 9.88525L8.94258 7.99992L10.8286 6.11459L9.88525 5.17125L7.99992 7.05725Z"
            fill="#F66074"
          />
        </g>
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderAuditResultWarning: React.FC<CustomIconProps> = ({
  className
}) => {
  return (
    <CommonIconStyleWrapper className={classnames(className, 'custom-icon ')}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="alert-fill">
          <path
            id="Vector"
            d="M8.57658 2.0002L14.9274 13.0002C15.1115 13.3191 15.0022 13.7268 14.6834 13.9109C14.582 13.9694 14.4671 14.0002 14.35 14.0002H1.64836C1.28016 14.0002 0.981689 13.7017 0.981689 13.3335C0.981689 13.2165 1.01249 13.1015 1.071 13.0002L7.42185 2.0002C7.60598 1.68133 8.01365 1.57208 8.33252 1.75618C8.43392 1.81469 8.51805 1.89885 8.57658 2.0002ZM7.33252 10.6669V12.0002H8.66585V10.6669H7.33252ZM7.33252 6.0002V9.33355H8.66585V6.0002H7.33252Z"
            fill="#EBAD1C"
          />
        </g>
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconInitializedOrderStep: React.FC = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.99992 14.6668C4.31792 14.6668 1.33325 11.6822 1.33325 8.00016C1.33325 4.31816 4.31792 1.3335 7.99992 1.3335C11.6819 1.3335 14.6666 4.31816 14.6666 8.00016C14.6666 11.6822 11.6819 14.6668 7.99992 14.6668ZM7.33325 7.3335H4.66659V8.66683H7.33325V11.3335H8.66659V8.66683H11.3333V7.3335H8.66659V4.66683H7.33325V7.3335Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const IconProgressOrderStep: React.FC<CustomIconProps> = ({ color }) => {
  return (
    <CommonIconStyleWrapper className="icon-failed-order-step">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.99992 14.6644C4.31802 14.6644 1.33325 11.6796 1.33325 7.99773C1.33325 4.31582 4.31802 1.33105 7.99992 1.33105C11.6818 1.33105 14.6666 4.31582 14.6666 7.99773C14.6666 11.6796 11.6818 14.6644 7.99992 14.6644ZM7.99992 13.3311C10.9455 13.3311 13.3333 10.9433 13.3333 7.99773C13.3333 5.0522 10.9455 2.66439 7.99992 2.66439C5.0544 2.66439 2.66659 5.0522 2.66659 7.99773C2.66659 10.9433 5.0544 13.3311 7.99992 13.3311ZM7.99992 11.9977V3.99772C10.2091 3.99772 11.9999 5.78858 11.9999 7.99773C11.9999 10.2069 10.2091 11.9977 7.99992 11.9977Z"
          fill={color ?? 'currentColor'}
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconFinishedOrderStep: React.FC = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.99992 14.6668C4.31792 14.6668 1.33325 11.6822 1.33325 8.00016C1.33325 4.31816 4.31792 1.3335 7.99992 1.3335C11.6819 1.3335 14.6666 4.31816 14.6666 8.00016C14.6666 11.6822 11.6819 14.6668 7.99992 14.6668ZM7.33525 10.6668L12.0486 5.95283L11.1059 5.01016L7.33525 8.7815L5.44925 6.8955L4.50659 7.83816L7.33525 10.6668Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const IconFailedOrderStep: React.FC<CustomIconProps> = ({ color }) => {
  return (
    <CommonIconStyleWrapper className="icon-failed-order-step">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.99998 14.6663C4.31798 14.6663 1.33331 11.6817 1.33331 7.99967C1.33331 4.31767 4.31798 1.33301 7.99998 1.33301C11.682 1.33301 14.6666 4.31767 14.6666 7.99967C14.6666 11.6817 11.682 14.6663 7.99998 14.6663ZM7.99998 7.05701L6.11465 5.17101L5.17131 6.11434L7.05731 7.99967L5.17131 9.88501L6.11465 10.8283L7.99998 8.94234L9.88531 10.8283L10.8286 9.88501L8.94265 7.99967L10.8286 6.11434L9.88531 5.17101L7.99998 7.05701Z"
          fill={color ?? 'currentColor'}
        />
      </svg>
    </CommonIconStyleWrapper>
  );
};

export const IconOrderUploadTypeChecked: React.FC<CustomIconProps> = ({
  className
}) => {
  return (
    <CommonIconStyleWrapper
      className={classnames('icon-order-upload-checked', className)}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Frame">
          <path
            id="Vector"
            d="M3.88879 7.00002L6.22213 9.33335L10.8888 4.66669"
            stroke="#FCFBF9"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </CommonIconStyleWrapper>
  );
};
