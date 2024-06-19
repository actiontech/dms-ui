import type { SVGProps } from 'react';
const RingOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      viewBox="0 0 14 12"
      {...props}
    >
      <circle cx={6} cy={6} r={2.5} fill="#000" />
      <circle cx={6} cy={6} r={4} stroke="#000" />
    </svg>
  );
};
export default RingOutlined;
