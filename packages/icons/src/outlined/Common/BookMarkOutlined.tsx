import type { SVGProps } from 'react';
const BookMarkOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 140"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="url(#BookMarkOutlined_svg__a)"
        d="M20 103.333v-90c0-11.045 8.954-20 20-20h93.333A6.667 6.667 0 0 1 140 0v120a6.667 6.667 0 0 1-6.667 6.667h-90C30.447 126.667 20 116.22 20 103.333m106.667 10v-20H43.333c-5.523 0-10 4.478-10 10s4.477 10 10 10zm-60-106.666H40a6.667 6.667 0 0 0-6.667 6.666v68.912a23.24 23.24 0 0 1 10-2.245h83.334V6.667h-13.334V60L90 46.667 66.667 60z"
        opacity={0.06}
      />
      <defs>
        <linearGradient
          id="BookMarkOutlined_svg__a"
          x1={80}
          x2={80}
          y1={-6.667}
          y2={126.667}
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset={1} />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default BookMarkOutlined;
