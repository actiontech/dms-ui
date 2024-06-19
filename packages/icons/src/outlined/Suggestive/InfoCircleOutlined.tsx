import type { SVGProps } from 'react';
const InfoCircleOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      width={16}
      height={16}
      {...props}
    >
      <path d="M7 12.833A5.833 5.833 0 1 1 7 1.167a5.833 5.833 0 0 1 0 11.666m0-1.166a4.666 4.666 0 1 0 0-9.333 4.666 4.666 0 0 0 0 9.333m-.583-7.584h1.166V5.25H6.417zm0 2.334h1.166v3.5H6.417z" />
    </svg>
  );
};
export default InfoCircleOutlined;
