import type { SVGProps } from 'react';
const CalendarOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path d="M6.75.75v1.5h4.5V.75h1.5v1.5h3a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-.75.75H2.25A.75.75 0 0 1 1.5 15V3a.75.75 0 0 1 .75-.75h3V.75zM15 8.25H3v6h12zm-6.75 1.5v3H4.5v-3zm-3-6H3v3h12v-3h-2.25v1.5h-1.5v-1.5h-4.5v1.5h-1.5z" />
    </svg>
  );
};
export default CalendarOutlined;
