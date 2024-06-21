import type { SVGProps } from 'react';
const ThunderBulbFilled = (props: SVGProps<SVGSVGElement>) => {
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
        d="M5.956 13.5c-.223-.954-1.228-1.736-1.64-2.25a6 6 0 1 1 9.368.002c-.413.513-1.417 1.294-1.64 2.248zM12 15v.75a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5V15zM9.75 7.504V4.5L6.375 9.004H8.25v3l3.375-4.5z"
      />
      <path
        fill="#8A8F99"
        d="M12 15v.75a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5V15z"
      />
    </svg>
  );
};
export default ThunderBulbFilled;
