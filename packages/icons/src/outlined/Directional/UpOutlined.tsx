import type { SVGProps } from 'react';
const UpOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path d="m8 7.219-3.3 3.3-.942-.943L8 5.333l4.243 4.243-.943.943z" />
    </svg>
  );
};
export default UpOutlined;
