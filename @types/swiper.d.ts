import 'react';

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'swiper-container': any;
      'swiper-slide': any;
    }
  }
}
