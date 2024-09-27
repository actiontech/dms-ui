import type { SVGProps } from 'react';
const LanguageFilled = (props: SVGProps<SVGSVGElement>) => {
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
        d="M938.667 153.6v599.467c0 38.4-29.867 68.266-68.267 68.266h-14.933V268.8c0-55.467-44.8-100.267-100.267-100.267H202.667V153.6c0-38.4 29.866-68.267 68.266-68.267H870.4c38.4 0 68.267 29.867 68.267 68.267M454.4 435.2l55.467 162.133H396.8z"
      />
      <path
        fill={props.color ? 'currentColor' : '#C3C6CD'}
        d="M755.2 202.667H151.467c-36.267 0-66.134 29.866-66.134 66.133v601.6c0 38.4 29.867 68.267 66.134 68.267h601.6c36.266 0 66.133-29.867 66.133-66.134V268.8c2.133-36.267-27.733-66.133-64-66.133m-192 541.866L524.8 640H379.733l-38.4 104.533h-51.2l136.534-362.666h55.466l130.134 362.666z"
      />
    </svg>
  );
};
export default LanguageFilled;
