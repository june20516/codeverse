---
title: React Native에서 REST API를 Connect RPC로 마이그레이션하기
description: axios를 버리고 타입 안전한 gRPC 세상으로
date: 2026/01/05
tags:
  - React Native
  - Connect RPC
  - Protobuf
  - gRPC
  - TypeScript
categories:
  - dev
  - architecture
thumbnail: assets/images/posts/thumbnails/react-native-connect-rpc-migration.png
---

# React Native에서 REST API를 Connect RPC로 마이그레이션하기

API 문서의 중요함은 웹 개발자들 사이에서 말하면 입아플 정도로 널리 공감되는 주제이다. 이를 위해 많은 도구들이 존재하고 다양한 노력들이 이루어졌다.
나는 최근에 프로젝트를 진행하며 백엔드 입장에서 문서를 제공해야 했었고, 가져가기로 한 기술 스택에서 이 문서화 도구의 지원이 빈약함을 알게 되었다. 그래서 조금 더 많은 수작업이 필요해졌는데, 갑자기 회의감이 들었다. 코드와 코드의 대화 사이에 들어가는 사람의 손길, 이 헐거움이 어색하게 느껴졌다.
이 문제를 근본적으로 해결하기 위해 REST API를 버리고 [Connect RPC](https://connectrpc.com/)로 전환하기로 결정했다. Connect RPC는 [gRPC](https://grpc.io/)의 장점(타입 안전성, 코드 생성)을 가져오면서도 HTTP/1.1을 지원해 React Native에서도 사용할 수 있다.

## 왜 Connect RPC인가?

### REST API의 문제점

기존에는 [axios](https://axios-http.com/)로 REST API를 호출하고, 응답 타입을 수동으로 정의했다.

```typescript
// 수동으로 작성한 타입
interface ProfileResponse {
  profile: {
    userId: number;
    nickname: string;
    // ... 30개 이상의 필드
  };
}

// API 호출
const response = await axios.get<ProfileResponse>('/profiles/me');
```

이 방식의 문제는:

1. **(그럴 일은 절대 없어야 하지만)백엔드가 API를 일방적으로 변경하면 프론트엔드는 런타임 에러가 나서야 안다**
2. **타입 정의가 실제 API와 달라져도 TypeScript는 모른다**
3. **필드 하나 추가될 때마다 타입 정의를 찾아서 수정해야 한다**

### Connect RPC의 장점

Connect RPC는 [Protobuf](https://protobuf.dev/) 스키마를 공유하고 코드를 자동 생성한다.

```protobuf
// proto 파일 (백엔드와 공유)
message Profile {
  int64 user_id = 1;
  optional string nickname = 2;
  // ...
}

service ProfileService {
  rpc GetMyProfile(GetMyProfileRequest) returns (GetMyProfileResponse);
}
```

이 스키마에서 TypeScript 타입과 클라이언트 코드가 자동 생성되므로:

1. **백엔드가 스키마를 바꾸면 프론트엔드의 타입이 컴파일 타임에 깨진다**
2. **타입 정의가 항상 실제 API와 일치한다**
3. **proto 파일만 받으면 코드 생성으로 모든 게 업데이트된다**

## 1. Protobuf Repository 추가

백엔드와 proto 파일을 공유하기 위해 별도 저장소를 만들고 [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules)로 관리하기로 했다.

```bash
# proto repository를 submodule로 추가
git submodule add git@github.com:your-org/myapp-proto.git proto

# 폴더 구조
proto/
  ├── myapp/
  │   └── v1/
  │       ├── auth.proto
  │       ├── profile.proto
  │       └── interest.proto
  └── buf.yaml
```

proto 파일 예시:

```protobuf
// myapp/v1/auth.proto
syntax = "proto3";

package myapp.v1;

service AuthService {
  rpc RequestSignup(RequestSignupRequest) returns (RequestSignupResponse);
  rpc VerifySignup(VerifySignupRequest) returns (VerifySignupResponse);
  rpc GetMe(GetMeRequest) returns (GetMeResponse);
}

message RequestSignupRequest {
  string email = 1;
}

message RequestSignupResponse {
  string message = 1;
}

message VerifySignupRequest {
  string email = 1;
  string code = 2;
}

message VerifySignupResponse {
  string access_token = 1;
  string refresh_token = 2;
}
```

## 2. 패키지 설치

Connect RPC와 Protobuf 관련 패키지를 설치한다.

```bash
# 런타임 라이브러리
yarn add @connectrpc/connect @connectrpc/connect-web @bufbuild/protobuf

# 코드 생성 도구 (dev dependencies)
yarn add -D @bufbuild/buf @bufbuild/protoc-gen-es @connectrpc/protoc-gen-connect-es
```

각 패키지의 역할:

- `@connectrpc/connect`: Connect RPC 핵심 라이브러리
- `@connectrpc/connect-web`: HTTP/1.1 기반 transport (React Native 호환)
- `@bufbuild/protobuf`: Protobuf 메시지 런타임
- [`@bufbuild/buf`](https://buf.build/docs/introduction): 코드 생성 CLI
- `@bufbuild/protoc-gen-es`: TypeScript 타입 생성 플러그인
- `@connectrpc/protoc-gen-connect-es`: Connect 서비스 클라이언트 생성 플러그인

## 3. buf 설정 및 코드 생성

`buf.gen.yaml` 파일을 만들어 코드 생성 설정을 작성한다.

```yaml
# buf.gen.yaml
version: v2
inputs:
  - directory: proto
plugins:
  - local: protoc-gen-es
    out: gen
    opt:
      - target=ts
  - local: protoc-gen-connect-es
    out: gen
    opt:
      - target=ts
```

package.json에 코드 생성 스크립트를 추가한다.

```json
{
  "scripts": {
    "generate": "buf generate"
  }
}
```

코드를 생성한다.

```bash
yarn generate
```

이제 `gen/` 폴더에 TypeScript 코드가 자동 생성된다:

```
gen/
  └── myapp/
      └── v1/
          ├── auth_pb.ts        # 메시지 타입
          ├── auth_connect.ts   # 서비스 정의
          ├── profile_pb.ts
          ├── profile_connect.ts
          └── ...
```

생성된 코드 예시:

```typescript
// gen/myapp/v1/auth_pb.ts
export type VerifySignupRequest = Message<'myapp.v1.VerifySignupRequest'> & {
  email: string;
  code: string;
};

export type VerifySignupResponse = Message<'myapp.v1.VerifySignupResponse'> & {
  accessToken: string;
  refreshToken: string;
};
```

## 4. Metro 설정 (중요!)

React Native의 [Metro bundler](https://metrobundler.dev/)가 Connect 패키지의 [package exports](https://nodejs.org/api/packages.html#exports)를 인식하도록 설정해야 한다. 이 설정이 없으면 런타임 에러가 발생한다.

```javascript
// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// package exports 활성화 (필수!)
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
```

Connect 패키지는 Node.js 스타일의 package exports를 사용하는데, React Native의 Metro bundler는 기본적으로 이를 지원하지 않기 때문이다.

## 5. Transport 및 클라이언트 설정

Connect 클라이언트를 설정한다.

```typescript
// api/transport.ts
import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';

import { AuthService } from '@/gen/myapp/v1/auth_pb';
import { ProfileService } from '@/gen/myapp/v1/profile_pb';
import { InterestService } from '@/gen/myapp/v1/interest_pb';

import { createAuthInterceptor, createLoggingInterceptor } from './interceptors';

const API_URL = process.env.EXPO_PUBLIC_SERVER_URL;

if (!API_URL) {
  throw new Error('EXPO_PUBLIC_SERVER_URL is not defined');
}

const transport = createConnectTransport({
  baseUrl: API_URL,
  interceptors: [createLoggingInterceptor(), createAuthInterceptor()],
});

export const authClient = createClient(AuthService, transport);
export const profileClient = createClient(ProfileService, transport);
export const interestClient = createClient(InterestService, transport);
```

## 6. 인터셉터 구현

인증 토큰 주입과 에러 핸들링을 위한 인터셉터를 구현한다.

```typescript
// api/interceptors.ts
import type { Interceptor } from '@connectrpc/connect';

import { useAuthStore } from '@/stores/authStore';

export const createAuthInterceptor = (): Interceptor => next => async req => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    req.header.set('Authorization', `Bearer ${token}`);
  }

  return await next(req);
};

export const createLoggingInterceptor = (): Interceptor => next => async req => {
  console.log(`[Connect] ${req.method.name}`, req.message);

  const response = await next(req);

  console.log(`[Connect] ${req.method.name} response`, response.message);

  return response;
};
```

Connect의 인터셉터는 axios의 인터셉터와 비슷하지만 더 type-safe하다. 요청과 응답에 대한 모든 정보가 타입으로 보장된다.

## 7. 에러 핸들링

Connect RPC에서는 두 가지 에러 처리 방식이 있다:

1. **Network/Protocol 에러**: Connect의 기본 `ConnectError` (네트워크 장애, 인증 실패 등)
2. **비즈니스 로직 에러**: Protobuf로 정의된 `Error` 메시지

먼저 proto에 Error 메시지를 정의한다.

```protobuf
// proto/myapp/v1/common.proto
message Error {
  ErrorCode code = 1;
  string message = 2;
  map<string, string> details = 3;
}

enum ErrorCode {
  ERROR_CODE_UNSPECIFIED = 0;
  ERROR_CODE_PROFILE_NOT_FOUND = 1;
  ERROR_CODE_AUTH_ERROR = 2;
  ERROR_CODE_INVALID_TOKEN = 3;
  // ...
}
```

모든 응답은 `oneof result` 패턴을 사용한다.

```protobuf
message VerifySignupResponse {
  oneof result {
    VerifySignupSuccess success = 1;
    Error error = 2;
  }
}

message VerifySignupSuccess {
  string access_token = 1;
  string refresh_token = 2;
}
```

이 패턴을 처리하기 위해 `unwrap()` 함수와 `ApplicationError` 클래스를 만든다.

```typescript
// api/connectError.ts
import { ConnectError } from '@connectrpc/connect';

import { Error as ProtoError, ErrorCode } from '@/gen/myapp/v1/common_pb';

/**
 * 비즈니스 로직 에러
 * Proto에 정의된 Error 메시지를 래핑함
 */
export class ApplicationError extends Error {
  code: ErrorCode;
  details: { [key: string]: string };

  constructor(code: ErrorCode, message: string, details: { [key: string]: string } = {}) {
    super(message);
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }

  static fromProto(error: ProtoError): ApplicationError {
    return new ApplicationError(error.code, error.message, error.details);
  }
}

/**
 * oneof result에서 성공값을 추출하거나 에러를 throw
 */
export function unwrap<T>(response: {
  result:
    | { case: 'success'; value: T }
    | { case: 'error'; value: ProtoError }
    | { case: undefined };
}): NonNullable<T> {
  if (response.result.case === 'error') {
    throw ApplicationError.fromProto(response.result.value);
  }
  if (response.result.case === 'success') {
    return response.result.value as NonNullable<T>;
  }
  throw new ApplicationError(ErrorCode.INTERNAL, 'Unknown response result');
}

/**
 * ConnectError를 ApplicationError로 변환
 */
export const handleConnectError = (error: unknown): ApplicationError => {
  if (error instanceof ApplicationError) {
    return error;
  }

  if (error instanceof ConnectError) {
    // 네트워크 에러 등을 SYSTEM_ERROR로 매핑
    return new ApplicationError(ErrorCode.SYSTEM_ERROR, error.message);
  }

  if (error instanceof Error) {
    return new ApplicationError(
      ErrorCode.INTERNAL,
      error.message || '알 수 없는 오류가 발생했습니다'
    );
  }

  return new ApplicationError(ErrorCode.UNSPECIFIED, '알 수 없는 오류가 발생했습니다');
};
```

### 백엔드 구현

백엔드는 비즈니스 로직 에러를 Protobuf `Error` 메시지로 만든다. 이 방식을 사용하면 에러 코드가 proto enum으로 정의되어 백엔드-프론트엔드 간 타입 일치가 보장된다.

```go
// internal/response/errors.go
func NewConnectError(code domain.ErrorCode, err error) *connect.Error {
  connectErr := connect.NewError(toConnectCode(code), err)

  // Protobuf Error 메시지 생성
  protoErr := &duologuev1.Error{
    Code:    domain.ToProtoErrorCode(code),
    Message: err.Error(),
    Details: make(map[string]string),
  }

  // Error를 Connect error detail로 추가
  if detail, detailErr := connect.NewErrorDetail(protoErr); detailErr == nil {
    connectErr.AddDetail(detail)
  }

  return connectErr
}
```

### 인터셉터에서 에러 코드별 처리

인터셉터에서 특정 에러 코드에 대한 공통 처리를 할 수 있다.

```typescript
// api/interceptors.ts
export const createAuthInterceptor = (): Interceptor => next => async req => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    req.header.set('Authorization', `Bearer ${token}`);
  }

  try {
    return await next(req);
  } catch (error) {
    if (error instanceof ApplicationError) {
      // 프로필 없음 → 로그아웃 처리
      if (error.code === ErrorCode.PROFILE_NOT_FOUND) {
        useAuthStore.getState().clearAuth();
        router.replace('/');
        throw error;
      }

      // 인증 에러 → 토큰 갱신 시도
      if (
        error.code === ErrorCode.AUTH_ERROR ||
        error.code === ErrorCode.AUTH_REQUIRED ||
        error.code === ErrorCode.INVALID_TOKEN
      ) {
        const newToken = await tokenRefreshManager.refresh();
        req.header.set('Authorization', `Bearer ${newToken}`);
        return await next(req); // 재시도
      }
    }

    throw error;
  }
};
```

이 패턴을 사용하면:

1. **타입 안전한 에러 처리**: ErrorCode enum으로 가능한 에러를 컴파일 타임에 알 수 있음
2. **중앙화된 에러 처리**: 인터셉터에서 공통 에러 로직 처리
3. **명시적인 에러 흐름**: oneof를 통해 성공/실패가 proto 레벨에서 명확히 구분됨

## 8. API 레이어 마이그레이션

이제 기존 axios 기반 API를 Connect로 교체한다.

### Before (axios)

```typescript
// api/auth.ts (before)
import { apiClient } from './client';

interface VerifySignupRequest {
  email: string;
  code: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export const authApi = {
  verifySignup: async (email: string, code: string): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/verify-signup', {
      email,
      code,
    });
    return response.data;
  },
};
```

### After (Connect)

```typescript
// api/auth.ts (after)
import { create } from '@bufbuild/protobuf';

import { VerifySignupRequestSchema } from '@/gen/myapp/v1/auth_pb';

import { handleConnectError } from './connectError';
import { authClient } from './transport';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  verifySignup: async (email: string, code: string): Promise<TokenResponse> => {
    try {
      const request = create(VerifySignupRequestSchema, { email, code });
      const response = await authClient.verifySignup(request);
      const result = unwrap(response); // oneof result 처리
      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      };
    } catch (error) {
      throw handleConnectError(error);
    }
  },
};
```

변경된 점:

1. **타입을 수동으로 정의하지 않는다** - proto에서 자동 생성됨
2. **URL 경로를 하드코딩하지 않는다** - 서비스 정의에 포함됨
3. **create()로 요청 메시지를 생성한다** - 타입 안전성 보장

### Profile API 예시

```typescript
// api/profile.ts
import { create } from '@bufbuild/protobuf';

import { GetMyProfileRequestSchema, UpdateMyProfileRequestSchema } from '@/gen/myapp/v1/profile_pb';

import { handleConnectError } from './connectError';
import { profileClient } from './transport';

export const profileApi = {
  getMe: async (): Promise<ProfileMe> => {
    try {
      const request = create(GetMyProfileRequestSchema, {});
      const response = await profileClient.getMyProfile(request);
      const result = unwrap(response); // oneof result 처리

      return mapProfile(result.profile);
    } catch (error) {
      throw handleConnectError(error);
    }
  },

  updateMe: async (data: UpdateProfileData): Promise<ProfileMe> => {
    try {
      const request = create(UpdateMyProfileRequestSchema, {
        nickname: data.nickname,
        gender: data.gender,
        region: data.region,
        shortBio: data.shortBio,
        profileImageUrl: data.profileImageUrl,
        interestIds: data.interestIds?.map(id => BigInt(id)) ?? [],
      });

      const response = await profileClient.updateMyProfile(request);
      const result = unwrap(response); // oneof result 처리

      return mapProfile(result.profile);
    } catch (error) {
      throw handleConnectError(error);
    }
  },
};
```

## 9. React Query 훅은 그대로

[React Query](https://tanstack.com/query/latest) 훅은 API 함수만 호출하므로 수정할 필요가 없다.

```typescript
// queries/useMutationAuth.ts
export const useVerifySignup = () => {
  return useMutation({
    mutationFn: ({ email, code }: VerifySignupParams) => authApi.verifySignup(email, code),
    onSuccess: data => {
      setTokens(data.accessToken, data.refreshToken);
    },
  });
};
```

API 레이어만 교체했으므로 컴포넌트 코드는 전혀 수정하지 않아도 된다.

## 10. axios 제거

마이그레이션이 완료되면 axios를 제거한다.

```bash
yarn remove axios
```

기존에 axios를 사용하던 파일들도 삭제한다:

```bash
rm api/client.ts  # axios 클라이언트
```

## 결과

### 타입 안전성 확보

이제 백엔드가 API를 변경하면 프론트엔드가 **컴파일 타임에** 에러가 발생한다.

```typescript
// proto에서 nickname 필드가 제거되면
const profile = await profileApi.getMe();
console.log(profile.nickname); // ❌ TypeScript 에러: 'nickname' does not exist
```

### 개발 경험 개선

1. **자동 완성이 정확하다**: proto에 정의된 필드만 자동 완성됨
2. **리팩토링이 안전하다**: 필드명을 바꾸면 사용하는 모든 곳에서 에러 발생
3. **문서가 필요 없다**: proto 파일이 곧 API 명세서

### 유지보수 비용 감소

- 타입 정의를 수동으로 관리할 필요 없음
- snake_case ↔ camelCase 변환 코드 불필요
- API 변경 시 영향받는 코드를 TypeScript가 알려줌

## Binary vs JSON

Connect RPC는 binary(Protobuf)와 JSON 두 가지 포맷을 지원한다. `createConnectTransport`는 기본적으로 binary 포맷을 사용하므로, 별도 설정 없이도 binary의 이점을 누릴 수 있다.

- **Binary (기본값)**: 더 작은 페이로드, 더 빠른 직렬화/역직렬화
- **JSON**: 디버깅이 쉬움 (네트워크 탭에서 내용 확인 가능)

Proto 스키마의 타입 안전성을 유지하면서 실제 통신 데이터 포맷은 선택할 수 있다는 것이 Connect RPC의 큰 장점이다. 개발 환경에서 디버깅이 필요하다면 JSON으로, 프로덕션에서는 Binary로 전환하는 것도 가능하다.

```typescript
const transport = createConnectTransport({
  baseUrl: API_URL,
  useBinaryFormat: false, // JSON 사용 (디버깅 시 편리)
  // useBinaryFormat을 생략하면 기본값인 true(binary)가 적용됨
});
```

## 주의사항

### 1. Metro 설정 필수

`unstable_enablePackageExports`를 활성화하지 않으면 런타임 에러가 발생한다. 이 설정을 빠뜨리면 앱이 제대로 실행되지 않는다.

### 2. Streaming은 미지원

Connect RPC는 [Unary RPC](https://grpc.io/docs/what-is-grpc/core-concepts/#unary-rpc)만 지원한다. [Server Streaming](https://grpc.io/docs/what-is-grpc/core-concepts/#server-streaming-rpc)이나 [Bidirectional Streaming](https://grpc.io/docs/what-is-grpc/core-concepts/#bidirectional-streaming-rpc)은 React Native에서 작동하지 않는다.

### 3. 코드 생성 타이밍

proto 파일이 변경되면 `yarn generate`를 다시 실행해야 한다. submodule을 업데이트할 때마다 실행하는 것을 잊지 말자.

```bash
# proto submodule 업데이트 후
git submodule update --remote proto
yarn generate
```

proto 파일은 Protobuf의 네이밍 규칙에 따라 snake_case를 사용하지만, Connect는 코드 생성 시 자동으로 TypeScript의 camelCase로 변환해준다.

## 마무리

REST API에서 Connect RPC로 마이그레이션하면서 가장 만족스러운 점은 **타입 안전성**이다. 백엔드가 API를 변경하면 프론트엔드가 런타임이 아닌 컴파일 타임에 깨지므로, 배포 전에 문제를 발견할 수 있다.

수동으로 타입을 정의하던 시간을 아낄 수 있고, proto 파일만 보면 API 명세를 정확히 알 수 있어 문서를 별도로 관리할 필요도 없어졌다.

백엔드와 프론트엔드가 상호완결성을 가지는 서비스 프로덕트라면 gRPC 도입을 고려 해보는 것도 나쁘지 않은 것 같다.
