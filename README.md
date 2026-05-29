# 診断Lab Monorepo

このリポジトリを、診断Labの唯一の本番公開用リポジトリとして扱います。

## 公開URL

- ポータル: `https://shindan-lab.github.io/`
- 疲れのカルテ: `https://shindan-lab.github.io/tsukare-karte/`
- 職場しんどいカルテ: `https://shindan-lab.github.io/shokuba-karte/`
- 回復スイッチ診断: `https://shindan-lab.github.io/recovery-switch/`
- 強みの出方診断: `https://shindan-lab.github.io/strength-style/`
- 伝わらない疲れ診断: `https://shindan-lab.github.io/tsutawaranai-tsukare/`
- 育児イライラの正体診断: `https://shindan-lab.github.io/ikuji-iraira/`
- 夫婦のすれ違い疲れ診断: `https://shindan-lab.github.io/fuufu-surechigai/`

## 構成

- `index.html`
  - 診断Labトップページ
- `about.html`
- `privacy.html`
- `disclaimer.html`
- `shared/`
  - 共通フッターなどの shared アセット
- `tsukare-karte/`
- `shokuba-karte/`
- `recovery-switch/`
- `strength-style/`
- `tsutawaranai-tsukare/`
- `ikuji-iraira/`
- `fuufu-surechigai/`

## 運用ルール

- 今後の公開修正は、原則このリポジトリでのみ行う
- 旧個別リポジトリは公開配信元としては使わない
- 診断ごとの共通文言や共通導線は、できるだけ `shared/` へ寄せる
- 新しい診断は、原則としてこのリポジトリ配下にフォルダ追加で作成する
- 公開確認は `https://shindan-lab.github.io/` 配下のURLを基準に行う

## 旧個別リポジトリについて

以下のリポジトリは、過去の分離運用の名残として残っています。

- `tsukare-karte`
- `shokuba-karte`
- `recovery-switch`
- `strength-style`
- `tsutawaranai-tsukare`

これらは **GitHub Pages の公開元としては停止済み** です。履歴参照用として残っていても、今後の更新対象は `shindan-lab.github.io` に一本化します。
