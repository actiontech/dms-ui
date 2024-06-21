import type { SVGProps } from 'react';
const DownTriangleOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 18 6"
      width={16}
      height={16}
      {...props}
    >
      <path stroke="#E6E4E3" d="m1 1 8 4 8-4" />
    </svg>
  );
};
export default DownTriangleOutlined;
