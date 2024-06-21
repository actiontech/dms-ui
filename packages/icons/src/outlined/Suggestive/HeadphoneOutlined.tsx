import type { SVGProps } from 'react';
const HeadphoneOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 140"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill="url(#HeadphoneOutlined_svg__a)"
        d="M140 33.333a13.334 13.334 0 0 1 13.333 13.334v26.666A13.335 13.335 0 0 1 140 86.667h-7.08A53.336 53.336 0 0 1 80 133.333V120a39.997 39.997 0 0 0 40-40V40A40 40 0 0 0 80 0a40 40 0 0 0-40 40v46.667H20A13.333 13.333 0 0 1 6.667 73.333V46.667A13.333 13.333 0 0 1 20 33.333h7.08a53.34 53.34 0 0 1 105.84 0zm-88.267 51.9L58.8 73.927A39.8 39.8 0 0 0 80 80a39.8 39.8 0 0 0 21.2-6.073l7.066 11.306A53.1 53.1 0 0 1 80 93.333a53.1 53.1 0 0 1-28.267-8.1"
      />
      <defs>
        <linearGradient
          id="HeadphoneOutlined_svg__a"
          x1={80}
          x2={80}
          y1={-13.326}
          y2={133.333}
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset={1} />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default HeadphoneOutlined;
