(function () {
  function appendList(target, items) {
    target.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      target.appendChild(li);
    });
  }

  function selectedInsights(mainKey, questions, answers) {
    return questions
      .map((question, index) => {
        const baseScore = question[1][mainKey] || 0;
        const answerScore = answers[index]?.[mainKey] || 0;
        return { text: question[0], strength: baseScore ? answerScore / baseScore : -1, index };
      })
      .filter(item => item.strength >= 1)
      .sort((a, b) => b.strength - a.strength || a.index - b.index)
      .slice(0, 3)
      .map(item => item.text);
  }

  window.renderDeepResult = function renderDeepResult({ result, questions, answers, depth }) {
    const resultSection = document.getElementById('result');
    const mainKey = typeof result === 'string' ? result : result?.main;
    const mainData = depth?.[mainKey];
    if (!resultSection || !mainData) return;

    let root = document.getElementById('result-depth');
    if (!root) {
      root = document.createElement('div');
      root.id = 'result-depth';
      root.className = 'result-depth';
      root.innerHTML = `
        <section class="result-depth-section result-evidence">
          <div class="result-depth-kicker">今回の回答から</div>
          <h3>特に表れていたこと</h3>
          <p class="result-depth-intro">選んだ回答の中で、このタイプにつながった項目です。</p>
          <ul id="result-evidence-list" class="result-check-list"></ul>
        </section>
        <section class="result-depth-section">
          <div class="result-depth-kicker">表と内側</div>
          <h3>周りに見えている姿と、あなたの本音</h3>
          <div class="result-two-sides">
            <div><span>周りからは</span><p id="result-outside"></p></div>
            <div><span>あなたの中では</span><p id="result-inside"></p></div>
          </div>
        </section>
        <section class="result-depth-section">
          <div class="result-depth-kicker">見逃したくない変化</div>
          <h3>余裕が減っているときのサイン</h3>
          <ul id="result-sign-list" class="result-sign-list"></ul>
        </section>
        <section class="result-depth-section result-actions">
          <div class="result-depth-kicker">無理なく変える</div>
          <h3>今のあなたに合う、3つの動き方</h3>
          <div class="result-action-list">
            <div><span>今日</span><p id="result-action-today"></p></div>
            <div><span>今週</span><p id="result-action-week"></p></div>
            <div><span>伝えるなら</span><p id="result-action-words"></p></div>
          </div>
        </section>
        <p class="result-depth-note">すべてが当てはまる必要はありません。今の自分に近い部分だけを、これからのヒントとして受け取ってください。</p>
      `;
      const letterCard = document.getElementById('letter')?.closest('.card');
      resultSection.insertBefore(root, letterCard || document.getElementById('aff'));
    }

    const evidence = selectedInsights(mainKey, questions, answers);
    appendList(
      document.getElementById('result-evidence-list'),
      evidence.length ? evidence : ['このタイプに強く偏る回答は少なく、複数の傾向が近い強さで表れていました。']
    );
    document.getElementById('result-outside').textContent = mainData.outside;
    document.getElementById('result-inside').textContent = mainData.inside;
    appendList(document.getElementById('result-sign-list'), mainData.signs);
    document.getElementById('result-action-today').textContent = mainData.actions.today;
    document.getElementById('result-action-week').textContent = mainData.actions.week;
    document.getElementById('result-action-words').textContent = mainData.actions.words;
  };

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
