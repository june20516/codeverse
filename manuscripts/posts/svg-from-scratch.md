---
title: SVG 그려보기
date: 2024/10/1
tags:
  - svg
  - path
  - progress
thumbnail: assets/images/posts/svg-from-scratch.png
---

SVG(Scalable Vector Graphics)는 XML 기반의 마크업 언어로, 웹에서 확장 가능한 벡터 그래픽을 만드는 데 사용된다.

## SVG 기본 이해

1. 벡터 그래픽
   SVG는 벡터 기반 그래픽을 사용하여 이미지를 표현한다. 이는 이미지가 픽셀로 구성되어 있지 않고, 수학적인 수식으로 표현된다는 것을 의미하는데, 따라서 확대하거나 축소해도 이미지의 품질이 저하되지 않는다.

2. XML 기반
   SVG는 XML을 사용하여 그래픽의 요소를 정의한다. 이 구조는 웹 기술과 잘 통합되므로, 웹 페이지 내에서 사용하기 쉽고 스크립트로 조작할 수도 있다.

## SVG 주요 요소

- `<svg>`: SVG 요소를 시작하는 루트 엘리먼트. 모든 다른 SVG 요소는 이 안에 포함된다.
- `<path>`: 자유롭게 다양한 형태의 경로를 그릴 때 사용된다. d 프로퍼티에 M(이동), L(직선), H(수평선), V(수직선), C(큐빅 베지어 곡선), S(스무스 큐빅 베지어 곡선), Q(쿼드라틱 베지어 곡선), T(스무스 쿼드라틱 베지어 곡선), A(호)등의 명령을 통해 표현할 수 있다.
  `<rect>`: 사각형
  `<circle>`: 원
  `<ellipse>`: 타원
  `<line>`: 두 점을 잇는 직선
  `<polyline>` 및 `<polygon>`: 여러 점을 연결해 도형을 만드는 엘리먼트

## SVG 스타일링

SVG 요소는 CSS를 통해 스타일링할 수 있다. fill, stroke, stroke-width, stroke-linecap, stroke-dasharray 등을 사용해 엘리먼트의 색상, 선 굵기, 선 종류 등을 정의할 수 있다.

## Path

- svg 안에서 거의 대부분을 path로 표현할 수 있다. 직선, 곡선, 호 등 다양한 형태의 경로를 만드는 것이 가능하고, d프로퍼티를 사용하여 도형의 경로를 정의한다.

### 주요 명령어

- M (moveto): 새로운 시작점으로 이동한다.
- L (lineto): 현재 위치에서 지정된 위치까지 직선을 그린다.
- H (horizontal lineto): 현재 위치에서 지정된 x 좌표까지 수평선을 그린다.
- V (vertical lineto): 현재 위치에서 지정된 y 좌표까지 수직선을 그린다.
- C (cubic Bézier curve): 세 점을 이용한 큐빅 베지어 곡선을 그린다. 첫 두 점은 컨트롤 포인트이고, 마지막 점은 곡선의 끝점이다.
- S (smooth cubic Bézier curve): 이전 C 또는 S 명령의 끝점을 기준으로 부드러운 큐빅 베지어 곡선을 그린다.
- Q (quadratic Bézier curve): 하나의 컨트롤 포인트와 끝점을 사용하는 쿼드라틱 베지어 곡선을 그린다.
- T (smooth quadratic Bézier curve): 이전 Q 또는 T 명령의 끝점을 기준으로 부드러운 쿼드라틱 베지어 곡선을 그린다.
- A (arc): 타원의 일부로 구성된 호를 그린다. 시작점에서 반지름, 각도, 방향, 끝점까지의 경로를 정의한다.
- Z (closepath): 현재 경로의 시작점과 끝점을 연결하여 도형을 닫는다.

#### Bézier curve

Bézier 곡선은 "제어점(control points)"을 사용하여 정의하는 곡선으로, 곡선 자체는 항상 제어점을 직접 통과하지는 않지만 제어점에 영향을 받아 형태가 결정된다.

##### 종류

- 선형(Linear) Bézier 곡선(제어점 두 개): 두 점을 직선으로 연결
- 이차(Quadratic) Bézier 곡선(제어점 세 개): 첫 번째와 두 번째 제어점 사이, 그리고 두 번째와 세 번째 제어점 사이에 선형 Bézier 곡선을 그리고, 이 두 곡선을 기반으로 중간 점을 계산하여 곡선을 생성
- 입방(Cubic) Bézier 곡선(제어점 네 개): 가장 일반적으로 사용되는 Bézier 곡선. 복잡한 형태와 전환 효과를 만들 수 있다.

##### 사용 예

- Bézier 곡선은 디지털 디자인(특히 벡터 기반 그래픽), 애니메이션, 그리고 컴퓨터 시뮬레이션에서 널리 사용된다. 예를 들어, 웹 개발에서는 CSS 애니메이션과 전환에 큐빅 베지어 곡선을 사용하여 움직임의 속도를 조절한다.

### Progress bar로 동작하게 하기

#### stroke-dasharray와 stroke-dashoffset

- stroke-dasharray: 선의 표시 부분과 공백 부분의 길이를 정의한다. 예를 들어, stroke-dasharray="5, 3"는 선을 5의 길이로 그린 후, 3의 길이만큼 공백을 두고 다시 반복하여 그린다.

- stroke-dashoffset: stroke-dasharray에서 정의된 대쉬 패턴이 시작되는 지점을 조정한다. 이 값이 클수록 선의 시작 부분이 뒤로 밀리면서, 그려지는 선의 시작 지점이 변경된다.

프로그레스 바는 이 두 값들을 사용해, 대쉬 패턴의 첫번째 칸을 넓고 크게 만들어 채워지는 정도를 조절하는 개념으로 접근한다.

#### 예제

원을 이용해 프로그레스 바를 만드는 예제. 원 전체를 한 바퀴 돌면서 진행률을 표시한다.

```xml
<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">
<circle cx="60" cy="60" r="50" fill="transparent" stroke="#ddd" stroke-width="10"/>
<circle cx="60" cy="60" r="50" fill="transparent" stroke="blue" stroke-width="10"
          stroke-dasharray="314" stroke-dashoffset="314"/>
</svg>
```

원의 둘레는 약 `314(2 * π * 50)`

- `stroke-dasharray="314"`: 원 전체를 하나의 대쉬로 만든다.
- `stroke-dashoffset="314"`: 최초 상태에서는 진행 부분이 보이지 않는다. 진행률에 따라 이 값을 0까지 줄여감으로써 원하는 비율만큼 "파란색" 선이 나타나게 할 수 있다.

#### 진행률에 따라 stroke-dashoffset 조정하기

예를 들어, 진행률이 50%인 경우 stroke-dashoffset을 원의 둘레의 절반인 157로 설정한다.

```javascript
const progress = 50; // 진행률
const circle = document.querySelector('circle');
const circumference = 2 _ Math.PI _ 50; // 원의 둘레 계산

circle.style.strokeDashoffset = circumference \* (1 - progress / 100);
```

이제 진행률에 따라 원형 프로그레스 바가 시각적으로 업데이트된다.
