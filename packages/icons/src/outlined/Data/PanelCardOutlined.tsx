import type { SVGProps } from 'react';
const PanelCardOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={16}
      height={16}
      {...props}
    >
      <path d="M15 7.5H3v6.75h12zM2.25 2.25h13.5a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-.75.75H2.25A.75.75 0 0 1 1.5 15V3a.75.75 0 0 1 .75-.75m1.5 2.25V6h1.5V4.5zm3 0V6h1.5V4.5zm-3 3.75H6V12H3.75z" />
    </svg>
  );
};
export default PanelCardOutlined;
