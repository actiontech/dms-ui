import type { SVGProps } from 'react';
const LeftArrowOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="currentColor"
        d="M5.219 7.333h8.114v1.334H5.22l3.576 3.576-.943.942L2.667 8l5.185-5.185.943.942z"
      />
    </svg>
  );
};
export default LeftArrowOutlined;
