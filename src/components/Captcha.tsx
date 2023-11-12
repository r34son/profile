'use client';

import { useCallback, useState } from 'react';
import {
  InvisibleSmartCaptcha,
  InvisibleSmartCaptchaProps,
} from '@yandex/smart-captcha';

export const Captcha = ({
  visible: visibleProp,
  onChallengeHidden,
  ...restProps
}: Omit<InvisibleSmartCaptchaProps, 'sitekey'>) => {
  const [visible, setVisible] = useState(false);

  const handleChallengeHidden = useCallback(() => {
    setVisible(false);
    onChallengeHidden?.();
  }, [onChallengeHidden]);

  return (
    <InvisibleSmartCaptcha
      {...restProps}
      sitekey={process.env.NEXT_PUBLIC_YCAPTCHA_SITEKEY!}
      onChallengeHidden={handleChallengeHidden}
      visible={visibleProp || visible}
    />
  );
};
