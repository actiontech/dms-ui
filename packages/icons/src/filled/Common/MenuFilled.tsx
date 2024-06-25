import type { SVGProps } from 'react';
const MenuFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="#C3C6CD"
        d="M10.75 15.75a1 1 0 0 1-1-1v-5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1zm-7.5-6a1 1 0 0 1-1-1v-5.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1z"
      />
      <path
        fill={props.color ? 'currentColor' : '#8A8F99'}
        d="M3.25 15.75a1 1 0 0 1-1-1v-2.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1zm6.5-12.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"
      />
    </svg>
  );
};
export default MenuFilled;
