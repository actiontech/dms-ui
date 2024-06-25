import type { SVGProps } from 'react';
const ScanFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={16}
      height={16}
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#15C7D4'}
        d="m3.548 4.726 1.78 1.78a5.833 5.833 0 1 0 1.179-1.179l-1.78-1.78a8.333 8.333 0 1 1-1.179 1.179m2.976 2.976L10 11.178 11.178 10 7.703 6.524a4.167 4.167 0 1 1-1.179 1.179"
      />
    </svg>
  );
};
export default ScanFilled;
