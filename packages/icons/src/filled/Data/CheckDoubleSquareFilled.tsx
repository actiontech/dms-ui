import type { SVGProps } from 'react';
const CheckDoubleSquareFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      {...props}
    >
      <rect
        width={15}
        height={15}
        x={8}
        y={1}
        fill="currentColor"
        opacity={0.5}
        rx={1.5}
      />
      <rect width={18} height={18} x={2} y={4} fill="currentColor" rx={2} />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m7.8 13 2.475 2.475 4.243-4.243"
      />
    </svg>
  );
};
export default CheckDoubleSquareFilled;
