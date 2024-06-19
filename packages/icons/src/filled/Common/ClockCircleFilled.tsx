import type { SVGProps } from 'react';
const ClockCircleFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={16}
      height={16}
      {...props}
    >
      <path d="M9 16.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15M9.75 9V5.25h-1.5v5.25h4.5V9z" />
    </svg>
  );
};
export default ClockCircleFilled;
