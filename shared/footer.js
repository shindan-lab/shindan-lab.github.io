(function () {
  const footer = document.querySelector('footer.site-footer[data-root]');
  if (!footer) return;

  const root = footer.dataset.root || '.';
  const cssHref = `${root}/shared/footer.css`;
  const diagnoses = [
    { title: '疲れのカルテ', url: 'https://shindan-lab.github.io/tsukare-karte/', desc: '疲れの正体を広く見る' },
    { title: '職場しんどいカルテ', url: 'https://shindan-lab.github.io/shokuba-karte/', desc: '仕事のしんどさを整理する' },
    { title: '伝わらない疲れ診断', url: 'https://shindan-lab.github.io/tsutawaranai-tsukare/', desc: '言えないしんどさを見る' },
    { title: 'お金の不安の正体診断', url: 'https://shindan-lab.github.io/money-anxiety/', desc: '生活の不安を整理する' },
    { title: 'ひとり時間の必要度診断', url: 'https://shindan-lab.github.io/alone-time/', desc: '今の余白の必要度を見る' },
    { title: 'あなたの回復スイッチ診断', url: 'https://shindan-lab.github.io/recovery-switch/', desc: '戻りやすい休み方を探す' },
    { title: '育児イライラの正体診断', url: 'https://shindan-lab.github.io/ikuji-iraira/', desc: '怒りの奥にある疲れを見る' },
    { title: '夫婦のすれ違い疲れ診断', url: 'https://shindan-lab.github.io/fuufu-surechigai/', desc: '家のモヤモヤを言葉にする' },
    { title: '理想の休日タイプ診断', url: 'https://shindan-lab.github.io/holiday-style/', desc: '求めている休日を探す' },
    { title: '自分へのごほうび診断', url: 'https://shindan-lab.github.io/reward-style/', desc: '今の自分に合う満たし方を見る' },
    { title: 'あなたの強みの出方診断', url: 'https://shindan-lab.github.io/strength-style/', desc: '自分の良さを見直す' }
  ];

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
    <div class="footer-diagnosis-nav" aria-label="診断メニュー">
      ${diagnoses.slice(0, 4).map(item => `<a href="${item.url}"><strong>${item.title}</strong><span>${item.desc}</span></a>`).join('')}
    </div>
    <p class="footer-links">
      <a href="${root}/">トップページ</a>
      <span>|</span>
      <a href="${root}/about.html">運営情報</a>
      <span>|</span>
      <a href="${root}/privacy.html">プライバシーポリシー</a>
      <span>|</span>
      <a href="${root}/disclaimer.html">免責事項</a>
    </p>
    <p class="footer-pr-note">当サイトにはPR・アフィリエイトリンクが含まれる場合があります。診断結果は自己理解のための読み物であり、専門的判断の代替ではありません。</p>
    <p class="footer-copy">© 2026 診断Lab</p>
  `;

  const result = document.getElementById('result');
  if (!result || document.getElementById('shared-result-growth')) return;

  const currentPath = `${location.origin}${location.pathname}`;
  const related = diagnoses.filter(item => item.url !== currentPath).slice(0, 3);
  const card = document.createElement('div');
  card.id = 'shared-result-growth';
  card.className = 'shared-result-growth card';
  card.innerHTML = `
    <div class="shared-mini-label">次に見るなら</div>
    <p>今の結果に近いテーマをもう一つ見ると、自分の状態を別の角度から整理しやすくなります。</p>
    <div class="shared-result-links">
      ${related.map(item => `<a href="${item.url}"><strong>${item.title}</strong><span>${item.desc}</span></a>`).join('')}
    </div>
  `;

  const lastAction = Array.from(result.children).find(child => child.querySelector('button:last-of-type'));
  if (lastAction) {
    result.insertBefore(card, lastAction);
    return;
  }
  result.appendChild(card);
})();
