import type { SVGProps } from 'react';
const MenuSquareFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="#6094FC"
        d="M2.5 2.5h6.667v6.667H2.5zm0 8.333h6.667V17.5H2.5zM10.833 2.5H17.5v6.667h-6.667zm0 8.333H17.5V17.5h-6.667z"
      />
    </svg>
  );
};
export default MenuSquareFilled;
