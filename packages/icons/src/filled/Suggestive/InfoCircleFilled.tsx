import type { SVGProps } from 'react';
const InfoCircleFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="#C3C6CD"
        d="M8 14.667A6.667 6.667 0 1 1 8 1.333a6.667 6.667 0 0 1 0 13.334m-.667-7.334v4h1.333v-4zm0-2.666V6h1.333V4.667z"
      />
    </svg>
  );
};
export default InfoCircleFilled;
