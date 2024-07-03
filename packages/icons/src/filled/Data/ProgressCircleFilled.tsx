import type { SVGProps } from 'react';
const ProgressCircleFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path d="M8 14.664A6.667 6.667 0 1 1 8 1.331a6.667 6.667 0 0 1 0 13.333m0-1.333A5.333 5.333 0 1 0 8 2.664a5.333 5.333 0 0 0 0 10.667m0-1.333v-8a4 4 0 1 1 0 8" />
    </svg>
  );
};
export default ProgressCircleFilled;
