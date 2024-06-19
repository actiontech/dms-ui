import type { SVGProps } from 'react';
const TrendCardTwoTone = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={16}
      height={16}
      {...props}
    >
      <rect width={14} height={16} x={5} y={2} opacity={0.5} rx={1.5} />
      <rect width={20} height={17} x={2} y={5} rx={2} />
      <path
        stroke="#fff"
        d="m16.243 12.088-2.829 2.829-2.828-2.829-2.829 2.829"
      />
    </svg>
  );
};
export default TrendCardTwoTone;
