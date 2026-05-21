(function () {
  const footer = document.querySelector('footer.site-footer[data-root]');
  if (!footer) return;

  const root = footer.dataset.root || '.';
  const cssHref = `${root}/shared/footer.css`;

  if (!document.querySelector('link[data-shared-footer-css]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    link.dataset.sharedFooterCss = '1';
    document.head.appendChild(link);
  }

  footer.innerHTML = `
    <a class="footer-logo-wrap" href="${root}/"><span class="footer-brand-name">診断<em>Lab</em></span></a>
    <p class="footer-tagline">あなたの「なんか」を、言葉にする。</p>
    <p class="footer-links">
      <a href="${root}/">トップページ</a>
      <span>|</span>
      <a href="${root}/about.html">運営情報</a>
      <span>|</span>
      <a href="${root}/privacy.html">プライバシーポリシー</a>
      <span>|</span>
      <a href="${root}/disclaimer.html">免責事項</a>
    </p>
    <p class="footer-copy">© 2026 診断Lab</p>
  `;
})();
