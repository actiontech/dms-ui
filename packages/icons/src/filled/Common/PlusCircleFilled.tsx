import type { SVGProps } from 'react';
const PlusCircleFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#4583FF'}
        d="M7 13.667A6.667 6.667 0 1 1 7 .334a6.667 6.667 0 0 1 0 13.333m-.667-7.334H3.668v1.334h2.667v2.666h1.333V7.667h2.667V6.333H7.667V3.667H6.334z"
      />
    </svg>
  );
};
export default PlusCircleFilled;
