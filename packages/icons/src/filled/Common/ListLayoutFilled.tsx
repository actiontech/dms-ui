import type { SVGProps } from 'react';
const ListLayoutFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#8A8F99'}
        d="M14 2c.368 0 .667.298.667.667v10.666A.667.667 0 0 1 14 14H2a.667.667 0 0 1-.667-.667V2.667C1.333 2.298 1.632 2 2 2zm-1.333 8.667H3.333V12h9.334z"
      />
    </svg>
  );
};
export default ListLayoutFilled;
