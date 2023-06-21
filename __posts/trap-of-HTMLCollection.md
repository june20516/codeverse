---
title: HTMLCollection의 함정
description: 최근 작업에서 클래스를 기준으로 스크립트를 작성할 일이 있었습니다. 그런데, 이 작업 도중 도무지 이해가 가지 않는 일이 생겨 한참 삽질을 했습니다. 그 삽질의 기억을 기록합니다.
date: 2021/09/07
tags: HTMLCollection getElementsByClassName nodeList querySelectorAll()
categories: dev web
---

최근 작업에서 클래스를 기준으로 스크립트를 작성할 일이 있었습니다. 그런데, 이 작업 도중 도무지 이해가 가지 않는 일이 생겨 한참 삽질을 했습니다. 그 삽질의 기억을 기록합니다.

```html
<div class="wrapper lunchtime-template">
  <p class="title">
    <span class="text-primary name-slot">OOO</span>
    의 점심시간
  </p>
  <ul>
    <li class="text-info history-slot"></li>
    <li class="text-info history-slot"></li>
    <li class="text-info history-slot"></li>
    <li class="text-info history-slot"></li>
  </ul>
</div>
```

위와 같은 형태의 html이 있고, 이 template를 복사해 와서 데이터를 알맞게 넣는 식의 작업이었습니다.
스크립트를 짜기 시작합니다..

```javascript
const data = {
  bran: ['철판 볶음밥을 먹었다', '커피를 주문했다', '쿠키도 구매했다', '양치를 했다'],
};
let lunchTimeDiv = document.querySelector('.lunchtime-template').cloneNode(true);
```

상세 전략으로, 알맞는 tag element를 찾아 알맞는 데이터를 넣어준 이후, template로 활용하고자 설정해 두었던 class name들을 다 제거하려 생각했습니다.

```javascript
lunchTimeDiv.classList.remove('lunchtime-template');

let name = Object.keys(data)[0];
let nameSlot = lunchTimeDiv.querySelector('.name-slot');
nameSlot.innerHTML = name;
nameSlot.classList.remove('name-slot');
```

여기까지는 무탈하게 진행하였으나, 문제는 이후에 발생했습니다.

```javascript
const histories = data[name];
let historySlots = lunchTimeDiv.getElementsByClassName('history-slot');
for (let idx = 0; idx < historySlots.length; idx++) {
  slot = historySlots[idx];
  slot.innerText = histories[idx];
  slot.classList.remove('history-slot');
}
```

스크립트로 뿌려진 데이터는 기대와 달랐습니다.

```html
<div class="wrapper">
  <p class="title">
    <span class="text-primary">bran</span>
    의 점심시간
  </p>
  <ul>
    <li class="text-info">철판 볶음밥을 먹었다</li>
    <li class="text-info history-slot"></li>
    <li class="text-info">커피를 주문했다</li>
    <li class="text-info history-slot"></li>
  </ul>
</div>
```

> 이.. 이게 대체 어떻게 된 일이지..

기대와 전혀 다른 모습에 얼떨떨합니다. 아무리 생각처럼 한번에 안되는 것이 코딩이라지만, 이렇게 단순한 코드에서 삽질이라니??
영문을 모르고 어리둥절 해서 빤히 보고있는데, 패턴이 뭔가 익숙합니다. 고사리손으로 level1 알고리즘 문제를 풀어나가던 시절이 떠올랐습니다. 루프 안에서 인덱스를 조절해야 했던 문제가 있었던 것 같아요. 혹시나 싶어 서둘러 코드에 한줄을 끼워 넣어봅니다..

```javascript
for (let idx = 0; idx < histories.length; idx++) {
  slot = historySlots[idx];
  slot.innerText = histories[idx];
  slot.classList.remove('history-slot');
  idx -= 1;
}
```

결과가 나오긴 나왔습니다. 뭔가 이상하지만요.

```html
<div class="wrapper">
  <p class="title">
    <span class="text-primary">bran</span>
    의 점심시간
  </p>
  <ul>
    <li class="text-info">철판 볶음밥을 먹었다</li>
    <li class="text-info">철판 볶음밥을 먹었다</li>
    <li class="text-info">철판 볶음밥을 먹었다</li>
    <li class="text-info">철판 볶음밥을 먹었다</li>
  </ul>
</div>
```

반쪽이나마, 포문에서 발생하는 걸로 추정되는 문제는 해결이 되었습니다. 하지만 데이터도 같은 인덱스로 돌아야 하기 때문에 이렇게는 복잡성만 키울 뿐, 이 방향으로는 해결이 어려울 것 같습니다.

보다 근본적인 문제를 고민해보니, 아무래도 루프가 진행됨에 따라 `historySlots`이 제 예상과는 다르게 변하고 있는 것 같습니다. 그래서 `historySlots`을 잡는 방법을 `getElementsByClassName`에서 `querySelectorAll`으로 바꿔보았습니다.

```html
<div class="wrapper lunchtime-template">
  <p class="title">
    <span class="text-primary name-slot">OOO</span>
    의 점심시간
  </p>
  <ul>
    <li class="text-info history-slot"></li>
    <li class="text-info history-slot"></li>
    <li class="text-info history-slot"></li>
    <li class="text-info history-slot"></li>
  </ul>
</div>

<script>
  const data = {
    bran: ['철판 볶음밥을 먹었다', '커피를 주문했다', '쿠키도 구매했다', '양치를 했다'],
  };
  let lunchTimeDiv = document.querySelector('.lunchtime-template').cloneNode(true);
  lunchTimeDiv.classList.remove('lunchtime-template');

  let name = Object.keys(data)[0];
  let nameSlot = lunchTimeDiv.querySelector('.name-slot');
  nameSlot.innerHTML = name;
  nameSlot.classList.remove('name-slot');
  const histories = data[name];

  // 이곳을
  let historySlots = lunchTimeDiv.querySelectorAll('.history-slot');
  // 바꿨습니다.

  for (let idx = 0; idx < historySlots.length; idx++) {
    slot = historySlots[idx];
    slot.innerText = histories[idx];
    slot.classList.remove('history-slot');
  }
</script>
```

드디어 의도대로 동작하는 것을 확인할 수 있었습니다.

```html
<div class="wrapper">
  <p class="title">
    <span class="text-primary">bran</span>
    의 점심시간
  </p>
  <ul>
    <li class="text-info">철판 볶음밥을 먹었다</li>
    <li class="text-info">커피를 주문했다</li>
    <li class="text-info">쿠키도 구매했다</li>
    <li class="text-info">양치를 했다</li>
  </ul>
</div>
```

---

`getElementsByClassName`은 `HTMLCollection`을 반환합니다.
`querySelectorAll`은 `NodeList`를 반환합니다.

```javascript
let historySlots1 = lunchTimeDiv.getElementsByClassName('history-slot');
let historySlots2 = lunchTimeDiv.querySelectorAll('.history-slot');
console.log(historySlots1.toString()); // '[object HTMLCollection]'
console.log(historySlots2.toString()); //  '[object NodeList]'
```

[HTMLCollection과 NodeList](https://dev.to/theoluyi/queryselector-vs-getelementsbyclassname-nodelist-vs-htmlcollection-30gg) 의 차이를 설명하는 글을 공유합니다.

간단하게 얘기하면, HTMLCollection은 항상 현재의 상황을 반영합니다. collection의 기준이 class name이었고, 저는 그 요소들의 class name을 지웠으니 더이상 해당 collection에 해당이 되지 않아 collection이 작아진거죠. 포문이 오작동한 원인은 이 것 때문이었습니다.

더 깊게 얘기하면, HTML은 배열이 아닌 유사 배열로, 배열(array)에서 제공하는 forEach등의 함수를 사용할 수 없다고 합니다. 하지만 조금 더 HTML친화적으로 객체의 속성에 접근하듯이 `.[속성명]`의 방식으로 접근할 수도 있다고 합니다. <sup>[ref](https://devsoyoung.github.io/posts/js-htmlcollection-nodelist)</sup>

좀 더 공부해서, 앞으로는 상황에 맞게 적절한 선택을 하며 작업해야겠습니다.
