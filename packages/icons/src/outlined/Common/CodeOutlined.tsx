import type { SVGProps } from 'react';
const CodeOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width={16}
      height={16}
      {...props}
    >
      <path d="M953.6 960H70.4V64h883.2zm-819.2-64h755.2V128H134.4z" />
      <path d="M96 320h832v64H96zM192 192h64v64h-64zM320 192h64v64h-64zM550.784 417.28l59.776 22.848L473.216 798.72l-59.776-22.912zM358.4 793.6 211.2 640l147.2-153.6 51.2 51.2L300.8 640l108.8 102.4zM665.6 793.6l-51.2-51.2L723.2 640 614.4 537.6l51.2-51.2L812.8 640z" />
    </svg>
  );
};
export default CodeOutlined;
