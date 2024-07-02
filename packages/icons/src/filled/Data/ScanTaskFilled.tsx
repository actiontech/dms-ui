import type { SVGProps } from 'react';
const ScanTaskFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M2 10V2a.667.667 0 0 1 .667-.667h10.666A.667.667 0 0 1 14 2v10.667a2 2 0 0 1-2 2H2.667a2 2 0 0 1-2-2v-1.334h10.666v1.334a.667.667 0 0 0 1.333 0V10z"
      />
    </svg>
  );
};
export default ScanTaskFilled;
