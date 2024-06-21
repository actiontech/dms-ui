import type { SVGProps } from 'react';
const ClockCircleFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      {...props}
    >
      <circle cx={12} cy={12} r={11} fill="currentColor" />
      <circle cx={12} cy={12} r={10} stroke="#fff" />
      <path stroke="#fff" d="M12 7.5V12h3.5" />
    </svg>
  );
};
export default ClockCircleFilled;
