---
title: post template
description: VPC 안에 있는 RDS에서 Data base를 dump해 와서 local의 mysql에 밀어 넣는 과정에서 단편적으로 맞닥뜨렸던 문제를 기록합니다.
date: 2021/9/1 00:00:00
tags: COLUMN_STATISTICS NO_AUTO_CREATE_USER column-statistics=0 mysqldump sed sql_mode ssh tunneling
---

> VPC 안에 있는 RDS에서 Data base를 dump해 와서 local의 mysql에 밀어 넣는 과정에서 단편적으로 맞닥뜨렸던 문제를 기록합니다.

## ssh tunneling을 통해 DB dump해오기

- `mysqldump` 명령어를 통해 `.sql`파일의 형태로 db를 덤프해 올 수 있습니다.
- tunneling을 수행할 ec2 인스턴스가 mysql client를 가지고 있어야 합니다.

```shell
$ ssh `tunneling-instanse-username`@`tunneling-instanse-host` -i `key-file-path` mysqldump -u`username` -p`password` -h `remote-db-host` `database-name` > `local/path/to/save.sql`
```

### COLUMN_STATISTICS

#### 덤프 시도 중 `...: Unknown table 'COLUMN_STATISTICS' in information_schema` 라는 에러가 발생할 경우

- 8.0부터 새로 추가된 옵션으로, 덤프 할 때 ANALYZE TABLE에 통계 데이터를 입력 또는 수정하는 옵션이라고 합니다.<sup>[레퍼런스](https://jay-ji.tistory.com/62)</sup>
- 명시적으로 해당 옵션을 사용하지 않는다고 알려줍시다. dump 명령에 `--column-statistics=0` 옵션을 추가합니다.

```shell
$ ssh `tunneling-instanse-username`@`tunneling-instanse-host` -i `key-file-path` mysqldump -u`username` -p`password` -h `remote-db-host` --column-statistics=0 `database-name` > `local/path/to/save.sql`
```

#### 덤프 시도 중 `...unknown variable 'column-statistics=0'...` 라는 에러가 발생할 경우

- 위의 문제에 해당하지 않는 데 옵션을 주는 경우로, dump 명령 옵션에서 `--column-statistics=0`을 제거합니다.

## .sql파일을 로컬 mysql에 로드하기

- `mysql`명령어를 통해 `database-name`이라는 data base 에 `dumped.sql` 파일의 내용을 로드할 수 있습니다.
- 데이터를 받을 database는 미리 생성되어있고 비어있어야 합니다.

```shell
$ mysql -u`local-user-name` -p`local-pwd` `database-name` < `path/for/dumped.sql`
```

### NO_AUTO_CREATE_USER

#### 로드 시도 중 `Variable 'sql_mode' can't be set to the value of 'NO_AUTO_CREATE_USER'` 라는 에러가 발생할 경우

- USER 생성과 관련있는 모드입니다. mysql 8.0 이상부터 해당 모드가 제거되고 별도 구문으로(`CREAT USER...` 또는 `GRANT...` ) 처리됩니다.
- 해결을 위해 `dumped.sql` 의 내용을 약간 수정해줍니다.
- `.sql`파일은 데이터 베이스를 구성하는 sql문이 잔뜩 적혀있어 용량이 매우 큰 경우가 대부분입니다. 따라서 editor으로 열어서 수정하는 것은 좋지 않은 선택입니다. `sed` 명령어를 사용해 수정합니다.
- `sed`명령어는 레퍼런스가 많지만, Unix 계열인 mac의 터미널에서는 용법이 조금 다릅니다.

```shell
sed -i '' 's/NO_AUTO_CREATE_USER//' `path/for/dumped.sql`
```

- 위와 같이 입력하여 sql파일을 수정하고 다시 로드합니다.
