import { CustomIconProps } from '@actiontech/shared/lib/Icon';

export const IconFormListDelete: React.FC<CustomIconProps> = ({
  width = 16,
  height = 16,
  color
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.00016 14.6667C4.31816 14.6667 1.3335 11.682 1.3335 8.00004C1.3335 4.31804 4.31816 1.33337 8.00016 1.33337C11.6822 1.33337 14.6668 4.31804 14.6668 8.00004C14.6668 11.682 11.6822 14.6667 8.00016 14.6667ZM4.66683 7.33337V8.66671H11.3335V7.33337H4.66683Z"
        fill={color ? color : '#F66074'}
      />
    </svg>
  );
};

export const IconFormListAdd: React.FC<CustomIconProps> = ({
  width = 16,
  height = 16,
  color
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.00016 13.6667C3.31816 13.6667 0.333496 10.682 0.333496 7.00004C0.333496 3.31804 3.31816 0.333374 7.00016 0.333374C10.6822 0.333374 13.6668 3.31804 13.6668 7.00004C13.6668 10.682 10.6822 13.6667 7.00016 13.6667ZM6.3335 6.33337H3.66683V7.66671H6.3335V10.3334H7.66683V7.66671H10.3335V6.33337H7.66683V3.66671H6.3335V6.33337Z"
        fill={color ? color : '#4583FF'}
      />
    </svg>
  );
};

export const IconMemberIsAdmin: React.FC<CustomIconProps> = () => {
  return (
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
  );
};

export const IconMemberNotAdmin: React.FC<CustomIconProps> = () => {
  return (
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
  );
};
