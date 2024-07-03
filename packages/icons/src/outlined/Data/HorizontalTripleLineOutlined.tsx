import type { SVGProps } from 'react';
const HorizontalTripleLineOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 12"
      width={16}
      height={16}
      {...props}
    >
      <rect width={10} height={2} rx={0.5} />
      <rect width={10} height={2} x={4} y={5} rx={0.5} />
      <rect width={10} height={2} y={10} rx={0.5} />
    </svg>
  );
};
export default HorizontalTripleLineOutlined;
