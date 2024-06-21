import type { SVGProps } from 'react';
const DownOutlined = (props: SVGProps<SVGSVGElement>) => {
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
        d="m8 8.781 3.3-3.3.943.943L8 10.667 3.757 6.424l.943-.943z"
      />
    </svg>
  );
};
export default DownOutlined;
