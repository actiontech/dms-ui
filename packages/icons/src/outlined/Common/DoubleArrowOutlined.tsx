import type { SVGProps } from 'react';
const DoubleArrowOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      className="DoubleArrowOutlined_svg__icon"
      viewBox="0 0 1024 1024"
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M429.6 880c-3.2 0-7.2-.8-10.4-2.4-8.8-4-13.6-12.8-13.6-21.6V184c0-9.6 5.6-17.6 13.6-21.6 8.8-4 18.4-2.4 25.6 3.2l403.2 336c5.6 4.8 8.8 11.2 8.8 18.4s-3.2 13.6-8.8 18.4l-403.2 336c-4 4-9.6 5.6-15.2 5.6m24-644.8v569.6L795.2 520z"
      />
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M192 880q-4.8 0-9.6-2.4c-8.8-4-14.4-12.8-14.4-21.6V184c0-9.6 5.6-18.4 14.4-21.6s18.4-2.4 25.6 4L432 368c9.6 8.8 10.4 24 1.6 33.6s-24 10.4-33.6 1.6L216 237.6v564L400 636c9.6-8.8 24.8-8 33.6 1.6s8 24.8-1.6 33.6L208 872.8c-4.8 4.8-10.4 7.2-16 7.2"
      />
    </svg>
  );
};
export default DoubleArrowOutlined;
