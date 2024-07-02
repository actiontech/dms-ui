import type { SVGProps } from 'react';
const DashOutlined = (props: SVGProps<SVGSVGElement>) => {
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
        d="M3.333 6.667C2.6 6.667 2 7.267 2 8s.6 1.333 1.333 1.333c.734 0 1.334-.6 1.334-1.333s-.6-1.333-1.334-1.333m9.334 0c-.734 0-1.334.6-1.334 1.333s.6 1.333 1.334 1.333C13.4 9.333 14 8.733 14 8s-.6-1.333-1.333-1.333M8 6.667c-.733 0-1.333.6-1.333 1.333S7.267 9.333 8 9.333 9.333 8.733 9.333 8 8.733 6.667 8 6.667"
      />
    </svg>
  );
};
export default DashOutlined;
