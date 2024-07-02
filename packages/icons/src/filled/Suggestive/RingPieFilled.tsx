import type { SVGProps } from 'react';
const RingPieFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <rect
        width={16}
        height={16}
        fill={props.color ? 'currentColor' : '#E8F3FF'}
        rx={3}
      />
      <circle
        cx={8}
        cy={8}
        r={3}
        fill="#fff"
        stroke={props.color ? 'currentColor' : '#4583FF'}
        strokeWidth={2}
      />
    </svg>
  );
};
export default RingPieFilled;
