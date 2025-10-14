---
title: HTMLCollection의 함정
description: 클래스를 기준으로 스크립트를 작성하다가 맞닥트린 예상치 못한 문제
date: 2021/09/07
tags:
  - HTMLCollection
  - getElementsByClassName
  - nodeList
  - querySelectorAll()
categories:
  - dev
  - web
thumbnail: assets/images/posts/thumbnails/trap-of-htmlcollection.jpeg
---

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

위와 같은 형태의 HTML 템플릿에 데이터를 넣는 작업이었다. 스크립트를 작성하면서, 먼저 알맞은 태그 요소를 찾아 데이터를 넣고, 템플릿으로 활용했던 클래스 이름들을 제거하려고 했다.

```javascript
const data = {
  bran: ['철판 볶음밥을 먹었다', '커피를 주문했다', '쿠키도 구매했다', '양치를 했다'],
};

let lunchTimeDiv = document.querySelector('.lunchtime-template').cloneNode(true);
lunchTimeDiv.classList.remove('lunchtime-template');

let name = Object.keys(data)[0];
let nameSlot = lunchTimeDiv.querySelector('.name-slot');
nameSlot.innerHTML = name;
nameSlot.classList.remove('name-slot');
```

여기까지는 별 문제 없었지만, 이후에 문제가 발생했다.

```javascript
const histories = data[name];
let historySlots = lunchTimeDiv.getElementsByClassName('history-slot');
for (let idx = 0; idx < historySlots.length; idx++) {
  slot = historySlots[idx];
  slot.innerText = histories[idx];
  slot.classList.remove('history-slot');
}
```

스크립트로 처리된 결과는 기대와 달랐다.

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

코드가 기대한 대로 작동하지 않아 어리둥절했다. 간단한 코드에서 문제가 발생하리라 예상하지 못했지만, 분명히 어디선가 잘못된 부분이 있었다.
고민 끝에, 루프 안에서 인덱스를 조절해야 했던 알고리즘 문제를 떠올리고 코드를 수정해 보았다.

```javascript
for (let idx = 0; idx < histories.length; idx++) {
  slot = historySlots[idx];
  slot.innerText = histories[idx];
  slot.classList.remove('history-slot');
  idx -= 1;
}
```

결과는 나왔지만, 뭔가 이상했다.

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

포문에서 발생한 문제는 어느 정도 해결됐지만, 데이터를 인덱스와 같이 순환해야 하므로 복잡성만 더 커졌을 뿐, 이 방식은 적절하지 않았다.
근본적인 문제를 고민해보니, `historySlots`가 루프가 진행됨에 따라 변하고 있었다. 그래서 `historySlots`를 잡는 방식을 `getElementsByClassName`에서 `querySelectorAll`로 바꿔보기로 했다.

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

  // 이곳을 변경
  let historySlots = lunchTimeDiv.querySelectorAll('.history-slot');

  for (let idx = 0; idx < historySlots.length; idx++) {
    slot = historySlots[idx];
    slot.innerText = histories[idx];
    slot.classList.remove('history-slot');
  }
</script>
```

드디어 의도대로 동작했다.

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

`getElementsByClassName`은 `HTMLCollection`을 반환하고, `querySelectorAll`은 `NodeList`를 반환한다.

```javascript
let historySlots1 = lunchTimeDiv.getElementsByClassName('history-slot');
let historySlots2 = lunchTimeDiv.querySelectorAll('.history-slot');
console.log(historySlots1.toString()); // '[object HTMLCollection]'
console.log(historySlots2.toString()); //  '[object NodeList]'
```

[HTMLCollection과 NodeList](https://dev.to/theoluyi/queryselector-vs-getelementsbyclassname-nodelist-vs-htmlcollection-30gg) 의 차이를 설명하는 좀 더 자세한 글을 첨부한다.

간단하게 말하자면, HTMLCollection은 항상 현재 상황을 반영한다. 즉, 클래스 이름을 기준으로 요소들이 담기는데, 내가 클래스 이름을 지우면서 해당 컬렉션에서 제외된 것이다. 포문이 제대로 작동하지 않은 이유는 바로 이 때문이었다.

더 나아가 HTMLCollection은 배열이 아닌 유사 배열이기 때문에 forEach 같은 배열 메서드를 사용할 수 없다. 하지만 객체 속성에 접근하듯이 .속성명 형식으로 접근이 가능하다. <sup>[ref](https://devsoyoung.github.io/posts/js-htmlcollection-nodelist)</sup>

앞으로는 상황에 맞는 선택을 더 신중히 해야겠다.
