import React from 'react';

interface GamanIconProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

const GamanIcon: React.FC<GamanIconProps> = ({ 
  width = 40, 
  height = 40, 
  className = "",
  color = "#F08372" 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 41 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_457_3145)">
        <g clipPath="url(#clip1_457_3145)">
          <path 
            d="M26.5284 37C23.9281 37 21.6704 35.5862 19.9982 32.9113C18.8117 31.0148 18.3322 29.1277 18.3135 29.0498C18.2886 28.9502 18.2761 28.8505 18.2761 28.7478V21.7412C18.2761 21.2211 18.5969 20.7571 19.0858 20.5734L26.0924 17.9451C26.3758 17.8393 26.6841 17.8393 26.9674 17.9451L33.9741 20.5734C34.4599 20.754 34.7837 21.2211 34.7837 21.7412V28.7478C34.7837 28.8505 34.7713 28.9502 34.7463 29.0498C34.7277 29.1277 34.2481 31.0148 33.0616 32.9113C31.3894 35.5862 29.1317 37 26.5315 37H26.5284ZM20.7674 28.5765C21.0258 29.4671 22.6701 34.5057 26.5284 34.5057C30.3867 34.5057 32.0278 29.4702 32.2894 28.5765V22.6038L26.5284 20.4426L20.7674 22.6038V28.5765Z" 
            fill={color}
          />
          <path 
            d="M17.1021 29.3488C17.0523 29.1557 17.0274 28.9502 17.0274 28.7446V28.5952C15.3209 28.3803 13.8884 27.9381 12.811 27.2343C11.3224 26.2627 10.3571 24.7182 10.3571 22.1553C10.3571 16.9984 14.9908 12.919 19.5934 12.919C22.3431 12.919 25.1052 14.3764 26.8834 16.6528C27.0577 16.6777 27.2321 16.7213 27.4003 16.7836L30.6825 18.0136C29.5272 15.074 27.2072 12.726 24.4637 11.4181C24.7845 11.197 25.0772 10.9385 25.3388 10.652C25.8059 10.132 26.192 9.43129 26.192 8.58427C26.192 7.73725 25.7748 7.0179 25.2391 6.53523C24.7284 6.07746 24.0869 5.77228 23.4766 5.56676C22.2465 5.15259 20.7736 5.00311 19.5965 5.00311C18.4194 5.00311 16.9433 5.15259 15.7164 5.56676C15.1029 5.77228 14.4614 6.07435 13.9538 6.53523C13.4182 7.0179 13.0009 7.70611 13.0009 8.58427C13.0009 9.46244 13.3902 10.132 13.8542 10.652C14.1157 10.9385 14.4085 11.197 14.7292 11.4181C10.7868 13.2927 7.71948 17.3192 7.71948 22.1553C7.71948 25.5278 9.06475 27.9443 11.3692 29.4453C13.141 30.6006 15.3832 31.1549 17.7872 31.3293C17.3232 30.2238 17.1146 29.4048 17.1021 29.3519V29.3488ZM15.6479 8.56559L15.7164 8.49397C15.8534 8.3694 16.1243 8.2137 16.5572 8.06423C17.4198 7.77151 18.5844 7.64071 19.5934 7.64071C20.6023 7.64071 21.767 7.77462 22.6296 8.06423C23.0655 8.21059 23.3333 8.3694 23.4704 8.49397C23.4859 8.50642 23.5015 8.52199 23.514 8.53756L23.5513 8.58427L23.542 8.62787C23.5015 8.72752 23.4454 8.81471 23.3707 8.88945C23.1839 9.09809 22.8756 9.33165 22.4458 9.55586C21.577 10.0074 20.4622 10.2814 19.5934 10.2814C18.7245 10.2814 17.6128 10.0074 16.7409 9.55586C16.308 9.33165 15.9997 9.09809 15.816 8.89256C15.7413 8.81783 15.6821 8.72752 15.6447 8.62787L15.6354 8.58427C15.6354 8.58427 15.6447 8.57182 15.6479 8.56559Z" 
            fill={color}
          />
          <path 
            d="M24.6257 23.0864C24.5728 23.0023 24.5043 22.9276 24.4202 22.8684C24.3392 22.8093 24.2458 22.7688 24.1493 22.747C24.0527 22.7252 23.95 22.7221 23.8503 22.7376C23.7507 22.7532 23.6572 22.7906 23.5701 22.8435C23.486 22.8965 23.4112 22.965 23.3521 23.049C23.2929 23.13 23.2524 23.2234 23.2306 23.32C23.2088 23.4165 23.2057 23.5193 23.2213 23.6189C23.2368 23.7186 23.2742 23.812 23.3272 23.8992L25.1458 26.8077H23.978C23.7756 26.8077 23.5794 26.8887 23.4361 27.0319C23.2929 27.1752 23.2119 27.3713 23.2119 27.5738C23.2119 27.7762 23.2929 27.9724 23.4361 28.1156C23.5794 28.2589 23.7725 28.3398 23.978 28.3398H25.7623V28.8505H23.978C23.7756 28.8505 23.5794 28.9315 23.4361 29.0747C23.2929 29.218 23.2119 29.4142 23.2119 29.6166C23.2119 29.819 23.2929 30.0152 23.4361 30.1584C23.5794 30.3017 23.7725 30.3826 23.978 30.3826H25.7623V31.6563C25.7623 31.8587 25.8433 32.0549 25.9866 32.1981C26.1298 32.3414 26.326 32.4223 26.5284 32.4223C26.7308 32.4223 26.927 32.3414 27.0702 32.1981C27.2135 32.0549 27.2945 31.8587 27.2945 31.6563V30.3826H29.0788C29.2812 30.3826 29.4774 30.3017 29.6207 30.1584C29.7639 30.0152 29.8449 29.819 29.8449 29.6166C29.8449 29.4142 29.7639 29.218 29.6207 29.0747C29.4774 28.9315 29.2812 28.8505 29.0788 28.8505H27.2945V28.3398H29.0788C29.2812 28.3398 29.4774 28.2589 29.6207 28.1156C29.7639 27.9724 29.8449 27.7762 29.8449 27.5738C29.8449 27.3713 29.7639 27.1752 29.6207 27.0319C29.4774 26.8887 29.2812 26.8077 29.0788 26.8077H27.911L29.7296 23.8992C29.8386 23.7279 29.8729 23.5193 29.8262 23.3231C29.7795 23.1238 29.658 22.9525 29.4868 22.8466C29.3155 22.7376 29.1068 22.7034 28.9107 22.7501C28.7145 22.7968 28.5432 22.9183 28.4342 23.0895L26.5346 26.1288L24.6351 23.0895L24.6257 23.0864Z" 
            fill={color}
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_457_3145">
          <rect width="40" height="40" fill="white" transform="translate(0.25)"/>
        </clipPath>
        <clipPath id="clip1_457_3145">
          <rect width="27.0611" height="32" fill="white" transform="translate(7.71948 5)"/>
        </clipPath>
      </defs>
    </svg>
  );
};

export default GamanIcon;