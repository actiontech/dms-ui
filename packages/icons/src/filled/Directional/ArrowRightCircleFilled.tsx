import type { SVGProps } from 'react';
const ArrowRightCircleFilled = (props: SVGProps<SVGSVGElement>) => {
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
        d="M8 14.667A6.667 6.667 0 1 1 8 1.333a6.667 6.667 0 0 1 0 13.334m3.333-4L14.666 8l-3.333-2.667v2H6v1.334h5.333z"
      />
    </svg>
  );
};
export default ArrowRightCircleFilled;
