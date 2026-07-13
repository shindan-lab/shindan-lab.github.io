(function () {
  function enhanceDiagnosisPage() {
    const top = document.getElementById('top');
    const main = document.querySelector('body > main');
    if (!top || !main || document.body.classList.contains('portal-page')) return;

    if (!document.querySelector('.lab-header')) {
      const header = document.createElement('header');
      header.className = 'lab-header';
      header.innerHTML = `
        <a class="lab-brand" href="https://shindan-lab.github.io/">診断<em>Lab</em></a>
        <a class="lab-header-link" href="https://shindan-lab.github.io/">診断一覧</a>
      `;
      main.insertBefore(header, main.firstChild);
    }

    const pathParts = location.pathname.split('/').filter(Boolean);
    const slug = (pathParts[pathParts.length - 1] === 'index.html' ? pathParts[pathParts.length - 2] : pathParts[pathParts.length - 1]) || '';
    const iconBySlug = {
      'tsukare-karte': 'tsukare-karte.png',
      'shokuba-karte': 'shokuba-karte.png',
      'tsutawaranai-tsukare': 'tsutawaranai-tsukare.png',
      'alone-time': 'alone-time.png',
      'ikuji-iraira': 'ikuji-iraira.png',
      'fuufu-surechigai': 'fuufu-surechigai.png',
      'money-anxiety': 'money-anxiety.png',
      'recovery-switch': 'recovery-switch.png',
      'holiday-style': 'holiday-style.png',
      'reward-style': 'reward-style.png',
      'strength-style': 'strength-style.png'
    };
    if (iconBySlug[slug]) {
      let visual = top.querySelector('.visual');
      if (!visual) {
        visual = document.createElement('img');
        visual.className = 'visual';
        const subtitle = top.querySelector('.h1 + p');
        if (subtitle) subtitle.insertAdjacentElement('afterend', visual);
      }
      visual.src = `../shared/diagnosis-icons/${iconBySlug[slug]}`;
      visual.alt = '';
      visual.width = 320;
      visual.height = 320;
    }

    if (!top.querySelector('.lab-answer-guide')) {
      const guide = document.createElement('p');
      guide.className = 'lab-answer-guide';
      guide.innerHTML = '<strong>回答の目安</strong><span>ここ1か月の自分を振り返り、それぞれの文がどの程度当てはまるかを選んでください。</span>';
      const startButton = top.querySelector('button');
      if (startButton) top.insertBefore(guide, startButton);
    }

    const quiz = document.getElementById('quiz');
    const result = document.getElementById('result');
    if (quiz) quiz.setAttribute('aria-live', 'polite');
    if (result) result.setAttribute('aria-live', 'polite');

    const affiliate = document.getElementById('aff');
    if (affiliate && !affiliate.querySelector('.lab-affiliate-note')) {
      const note = document.createElement('p');
      note.className = 'lab-affiliate-note';
      note.textContent = '診断結果に合わせた参考アイテムです。リンク先は外部サイトです。';
      const link = document.getElementById('afflink');
      if (link) affiliate.insertBefore(note, link);
    }

    document.addEventListener('click', event => {
      const option = event.target.closest('.opt');
      if (!option) return;
      option.classList.add('is-selected');
      option.setAttribute('aria-pressed', 'true');
    });

    const observer = new MutationObserver(records => {
      records.forEach(record => {
        if (record.type !== 'attributes' || record.attributeName !== 'class') return;
        const section = record.target;
        if (section.classList.contains('hide')) return;
        if (section.id === 'quiz') {
          const question = document.getElementById('q');
          if (question) question.setAttribute('tabindex', '-1');
        }
        if (section.id === 'result') {
          const heading = section.querySelector('.result-type-name,.type-name,h2');
          if (heading) {
            heading.setAttribute('tabindex', '-1');
            setTimeout(() => heading.focus({ preventScroll: true }), 80);
          }
        }
      });
    });
    ['quiz', 'result'].forEach(id => {
      const section = document.getElementById(id);
      if (section) observer.observe(section, { attributes: true });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceDiagnosisPage);
  } else {
    enhanceDiagnosisPage();
  }
})();
