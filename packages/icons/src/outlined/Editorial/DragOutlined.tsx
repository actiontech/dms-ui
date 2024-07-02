import type { SVGProps } from 'react';
const DragOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path d="M5.667 4.667a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4.333a1 1 0 1 0 0-2 1 1 0 0 0 0 2m1 3.333a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3.666-7.666a1 1 0 1 0 0-2 1 1 0 0 0 0 2m1 3.333a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-1 5.333a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
    </svg>
  );
};
export default DragOutlined;
