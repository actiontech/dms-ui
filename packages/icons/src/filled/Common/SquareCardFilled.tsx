import type { SVGProps } from 'react';
const SquareCardFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path d="M12.667 8H3.333v4.667h9.334zm-10-6h10.666c.368 0 .667.298.667.667v10.666a.667.667 0 0 1-.667.667H2.667A.667.667 0 0 1 2 13.333V2.667C2 2.298 2.298 2 2.667 2" />
    </svg>
  );
};
export default SquareCardFilled;
