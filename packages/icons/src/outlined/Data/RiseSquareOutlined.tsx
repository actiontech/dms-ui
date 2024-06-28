import type { SVGProps } from 'react';
const RiseSquareOutlined = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M823.685 375.036c-.096-.198-.198-.493-.198-.691-1.578-7.32-5.142-14.238-10.777-19.878-5.634-5.635-12.558-9.192-19.878-10.777-.198-.101-.492-.198-.69-.198-2.67-.492-5.34-.791-8.011-.791H621.969c-22.248 0-40.543 18.192-40.543 40.541 0 22.248 18.193 40.543 40.543 40.543h64.273l-159.89 159.788-114.506-114.5c-15.721-15.726-41.531-15.726-57.252 0l-143.277 143.18c-15.726 15.72-15.726 41.526 0 57.252 15.721 15.721 41.528 15.721 57.247 0L383.172 554.9 497.18 669.01c.198.198.299.396.397.497 7.913 7.908 18.293 11.863 28.674 11.766a40.77 40.77 0 0 0 28.679-11.766c.193-.198.294-.396.391-.497l188.072-188.073v64.273c0 22.248 18.198 40.543 40.543 40.543 22.248 0 40.543-18.193 40.543-40.543V383.142c-.002-2.67-.296-5.436-.794-8.106m0 0"
      />
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M899.111 124.889V899.11H124.889V124.889zM947.74 27.63H76.259c-26.857 0-48.63 21.772-48.63 48.63v871.48c0 26.857 21.773 48.63 48.63 48.63H947.74c26.857 0 48.63-21.772 48.63-48.63V76.26c0-26.858-21.772-48.63-48.63-48.63"
      />
    </svg>
  );
};
export default RiseSquareOutlined;