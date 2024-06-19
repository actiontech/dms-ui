import type { SVGProps } from 'react';
const CheckCircleOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path d="M8 14.667A6.667 6.667 0 1 1 8 1.333a6.667 6.667 0 0 1 0 13.334m0-1.334A5.333 5.333 0 1 0 8 2.667a5.333 5.333 0 0 0 0 10.666m-.665-2.666L4.507 7.838l.942-.943 1.886 1.886 3.771-3.771.943.943z" />
    </svg>
  );
};
export default CheckCircleOutlined;
