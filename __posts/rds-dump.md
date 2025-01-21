---
title: AWS RDS의 Data base를 dump하기
description: VPC 내부에 있는 RDS에서 데이터베이스를 덤프하고, 이를 로컬 MySQL로 복구하는 과정에서 겪은 문제들을 기록한다.
date: 2021/09/14
tags:
  - COLUMN_STATISTICS
  - NO_AUTO_CREATE_USER
  - column-statistics=0
  - mysqldump
  - sed
  - sql_mode
  - ssh tunneling
thumbnail: assets/images/posts/rds-dump.png
---

## ssh tunneling을 통해 DB dump해오기

- mysqldump 명령어를 사용하여 .sql 파일 형태로 데이터베이스를 덤프할 수 있다.
- 이 과정에서는 터널링을 수행할 EC2 인스턴스에 MySQL 클라이언트가 설치되어 있어야 한다.

```shell
$ ssh `tunneling-instanse-username`@`tunneling-instanse-host` -i `key-file-path` mysqldump -u`username` -p`password` -h `remote-db-host` `database-name` > `local/path/to/save.sql`
```

### COLUMN_STATISTICS

#### 덤프 시도 중 `...: Unknown table 'COLUMN_STATISTICS' in information_schema` 라는 에러가 발생할 경우

- 이 에러는 MySQL 8.0에서 새로 추가된 옵션인 COLUMN_STATISTICS 때문이다. 이 옵션은 테이블의 통계 데이터를 분석하여 덤프 시 포함하는 기능이다. <sup>[레퍼런스](https://jay-ji.tistory.com/62)</sup>
- 이 옵션을 비활성화하려면 덤프 명령어에 `--column-statistics=0`을 추가한다.

```shell
$ ssh `tunneling-instanse-username`@`tunneling-instanse-host` -i `key-file-path` mysqldump -u`username` -p`password` -h `remote-db-host` --column-statistics=0 `database-name` > `local/path/to/save.sql`
```

#### 덤프 시도 중 `...unknown variable 'column-statistics=0'...` 라는 에러가 발생할 경우

- 이 에러는 해당 옵션이 불필요한 경우 발생할 수 있다. 이런 경우에는 덤프 명령어에서 `--column-statistics=0`을 제거하고 다시 시도한다.

## .sql파일을 로컬 mysql에 로드하기

- 덤프한 .sql 파일을 로컬 데이터베이스에 로드할 때는 mysql 명령어를 사용한다.
- 데이터를 받을 데이터베이스는 미리 생성되어 있고 비어 있어야 한다.

```shell
$ mysql -u`local-user-name` -p`local-pwd` `database-name` < `path/for/dumped.sql`
```

### NO_AUTO_CREATE_USER

#### 로드 시도 중 `Variable 'sql_mode' can't be set to the value of 'NO_AUTO_CREATE_USER'` 라는 에러가 발생할 경우

- 이 에러는 MySQL 8.0 이상 버전에서 발생하는데, 해당 모드는 사용자 생성 관련 모드다. MySQL 8.0 이상에서는 이 모드가 제거되었으며, 대신 `CREATE USER` 또는 `GRANT` 구문을 사용한다.
- 이 문제를 해결하려면 `dumped.sql` 파일을 수정해야 한다.
- .sql 파일은 매우 크기 때문에 일반 텍스트 에디터로 수정하는 것은 비효율적이다. 대신 `sed` 명령어를 사용해 빠르게 수정할 수 있다.
- `macOS`와 같은 `Unix` 계열 시스템에서는 다음과 같이 `sed` 명령어를 사용한다.

```shell
sed -i '' 's/NO_AUTO_CREATE_USER//' `path/for/dumped.sql`
```

- 수정한 후 다시 데이터를 로드하면 된다.
