import Script from 'next/script';

export const YMScript = () => (
  <>
    <Script id="metrika-counter">
      {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date(); for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }} k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)}) (window, document, "script", "https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js", "ym"); ym(95478689, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });`}
    </Script>
    <noscript>
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://mc.yandex.ru/watch/95478689"
          style={{ position: 'absolute', left: -9999 }}
          alt=""
        />
      </div>
    </noscript>
  </>
);
