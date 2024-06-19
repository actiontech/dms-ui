import type { SVGProps } from 'react';
const ClockCircleOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={16}
      height={16}
      {...props}
    >
      <path d="M9 16.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15M9 15A6 6 0 1 0 9 3a6 6 0 0 0 0 12m.75-6h3v1.5h-4.5V5.25h1.5z" />
    </svg>
  );
};
export default ClockCircleOutlined;
