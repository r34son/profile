import type {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from 'next/server';
import { type CSPHeaderParams, getCSP, nonce as getNonce } from 'csp-header';
import { NONCE, TLD } from './constants';
import { parse } from 'psl';

const REPORT_GROUP = 'csp-endpoint';

const getHostname = (request: NextRequest): string => {
  return (
    request.headers.get('X-Forwarded-Host')?.split(',')[0].trim() ||
    request.headers.get('Host') ||
    request.headers.get(':authority') ||
    ''
  );
};

export type CspMiddlewareOptions = CSPHeaderParams & {
  reportOnly?: boolean;
  reportUri: NonNullable<CSPHeaderParams['reportUri']>;
};

export const cspMiddleware =
  ({ reportOnly = false, ...cspHeaderParams }: CspMiddlewareOptions) =>
  (
    request: NextRequest,
    _event: NextFetchEvent,
    response: NextResponse | Response,
  ): ReturnType<NextMiddleware> => {
    let cspString = getCSP({
      ...cspHeaderParams,
      directives: {
        ...cspHeaderParams.directives,
        'report-to': REPORT_GROUP,
      },
    });

    if (cspString.includes(NONCE)) {
      const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
      request.headers.set('x-nonce', nonce);
      cspString = cspString.replace(new RegExp(NONCE, 'g'), getNonce(nonce));
    }

    if (cspString.includes(TLD)) {
      const domain = parse(getHostname(request));

      if (!domain.error && domain.tld) {
        cspString = cspString.replace(new RegExp(TLD, 'g'), domain.tld);
      }
    }

    response.headers.set(
      reportOnly
        ? 'Content-Security-Policy-Report-Only'
        : 'Content-Security-Policy',
      cspString,
    );

    response.headers.set(
      'Report-To',
      `{"group":"${REPORT_GROUP}","max_age":10886400,"endpoints":[{"url":"${cspHeaderParams.reportUri}"}],"include_subdomains":true}`,
    );

    response.headers.append(
      'Link',
      `<${cspHeaderParams.reportUri}>; rel=dns-prefetch`,
    );

    return response;
  };
