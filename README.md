# Codeverse

> 코드의 망망대해를 떠도는 빛나는 우주 먼지

## Commands

```shell
# 초안은 manuscripts/drafts/<slug>.md 에 만들어진다. 같은 slug가 있으면 멈춘다.

# required
$ yarn write --slug='introduce-mermaid'

# optional
$ yarn write --slug='introduce-mermaid' --title='강력한 차팅 툴 Mermaid'

$ yarn write --slug='introduce-mermaid' --title='강력한 차팅 툴 Mermaid' --description='코딩만큼 쉬운 Diagram 그리기!'

# tags, categories는 쉼표로 구분한다. date는 yyyy/MM/DD( HH(:mm(:ss))), 생략하면 오늘.
$ yarn write --slug='introduce-mermaid' --title='강력한 차팅 툴 Mermaid' --description='코딩만큼 쉬운 Diagram 그리기!' --date='2024/08/30' --tags='mermaid,flowchart,diagram graph' --categories='dev,tool'

# test
$ node --test commands/write.test.js

# 빌드 결과물(out/)의 링크·canonical·title·sitemap lastmod 검사. 빌드한 뒤에 실행한다.
$ yarn build && node --test tests/build-output.test.js
```
