'use client';

import { useLocale } from 'next-intl';
import {
  InvisibleSmartCaptcha,
  type InvisibleSmartCaptchaProps,
} from '@yandex/smart-captcha';
import { captureException, captureMessage } from '@sentry/nextjs';

export const Captcha = () => {
  const locale = useLocale() as InvisibleSmartCaptchaProps['language'];

  return (
    <InvisibleSmartCaptcha
      visible
      sitekey="ysc1_xaaIVbCrCSFWZJ1FLnJpv0ahxnBWEMY3hi018frx8eb4fee4"
      language={locale}
      onJavascriptError={captureException}
      onNetworkError={() => captureMessage('SmartCaptcha: Network Error')}
    />
  );
};
