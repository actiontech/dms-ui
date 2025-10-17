import type { SVGProps } from 'react';
const RocketFilled = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      className="RocketFilled_svg__icon"
      viewBox="0 0 1024 1024"
      {...props}
    >
      <path
        fill={props.color ? 'currentColor' : '#41BF9A'}
        d="M673.45 675.968s121.814-121.813 163.457-163.37c130.688-130.689 65.322-392.15 65.322-392.15S640.768 55.083 510.08 185.813c-97.707 97.707-162.816 164.992-162.816 164.992S183.296 316.501 85.248 414.55l522.88 522.88c98.048-98.048 65.323-261.461 65.323-261.461m-64.085-383.36a85.25 85.25 0 0 1 120.662 0 85.333 85.333 0 1 1-120.662 0m-482.688 602.07s128 0 213.334-85.334l-128-128c-85.334 42.667-85.334 213.333-85.334 213.333"
      />
    </svg>
  );
};
export default RocketFilled;
