import type { SVGProps } from 'react';
const DownArrowLineOutlined = (props: SVGProps<SVGSVGElement>) => {
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
        d="M1.75 11.083h10.5v1.167H1.75zm5.833-3.4 3.542-3.541.825.824L7 9.916 2.05 4.968l.825-.825 3.542 3.54V1.167h1.166z"
      />
    </svg>
  );
};
export default DownArrowLineOutlined;
