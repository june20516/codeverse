---
title: mysql dockerize(1) - 도커로 mysql container 띄우기
date: 2021/11/07
description: 로컬 환경을 안전하게 보호하기 위해 MySQL을 도커로 격리하여 실행하는 과정을 기록한다.
tags:
  - MYSQL_ALLOW_EMPTY_PASSWORD
  - MYSQL_RANDOM_ROOT_PASSWORD
  - MYSQL_ROOT_PASSWORD
  - container
  - docker
  - mysql
thumbnail: assets/images/posts/thumbnails/mysql-dockerize.jpeg
---

최근 작업 중 DB 스키마 변경이 로컬 개발 환경에 영향을 미치는 일이 자주 발생했다. 이를 방지하기 위해 로컬에서 실행 중인 MySQL을 도커로 격리하여 실행하기로 했다.

## 시작점

현재 사용 중인 DB는 MySQL이며, Ruby on Rails(RoR) 프로젝트를 진행 중이다. 로컬 환경에 MySQL 서버가 설치되어 있고, Docker는 이미 설치되어 있다.

## 도커로 mysql container 띄우기

### mysql 이미지 가져오기

먼저 MySQL 이미지를 가져온다.

```shell
$ docker pull mysql

Using default tag: latest
latest: Pulling from library/mysql
...
...
Digest: ...
Status: Downloaded newer image for mysql:latest
docker.io/library/mysql:latest
```

LTS 버전의 MySQL 이미지가 로드된다.

### mysql 이미지를 컨테이너로 실행하기

로드한 이미지를 컨테이너로 실행해본다.

```shell
$ docker run mysql

2021-11-07 07:55:25+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.0.27-1debian10 started.
2021-11-07 07:55:25+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
2021-11-07 07:55:25+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.0.27-1debian10 started.
2021-11-07 07:55:25+00:00 [ERROR] [Entrypoint]: Database is uninitialized and password option is not specified
    You need to specify one of the following:
    - MYSQL_ROOT_PASSWORD
    - MYSQL_ALLOW_EMPTY_PASSWORD
    - MYSQL_RANDOM_ROOT_PASSWORD
```

에러가 발생한다. MySQL 컨테이너는 루트 사용자의 비밀번호 설정 방법을 명시해야 한다. 아래 세 가지 옵션 중 하나를 선택해 컨테이너의 환경 변수로 전달한다.

```shell
$ docker run mysql -e MYSQL_ROOT_PASSWORD=1234
# 또는
$ docker run mysql -e MYSQL_ALLOW_EMPTY_PASSWORD=abcd
# 또는
$ docker run mysql -e MYSQL_RANDOM_ROOT_PASSWORD=abcd
```

루트 비밀번호를 지정해주었다. 비밀번호를 설정하지 않는 MYSQL_ALLOW_EMPTY_PASSWORD나 MYSQL_RANDOM_ROOT_PASSWORD 옵션도 환경 변수에 값을 지정해줘야 동작한다. 실제로 해당 값이 영향을 미치지는 않는다.

랜덤 비밀번호 옵션을 사용하면 실행 로그에 비밀번호가 표시된다.

```shell
2021-11-07 07:55:40+00:00 [Note] [Entrypoint]: Entrypoint script for MySQL Server 8.0.27-1debian10 started.
2021-11-07 07:55:40+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
...
...
2021-11-07 07:55:48+00:00 [Note] [Entrypoint]: GENERATED ROOT PASSWORD: ojai1toovee3jahC4ooh7on8ahjoo0ji
...
2021-11-07 07:55:50+00:00 [Note] [Entrypoint]: MySQL init process done. Ready for start up.
...
2021-11-07T07:55:51.690474Z 0 [System] [MY-011323] [Server] X Plugin ready for connections. Bind-address: '::' port: 33060, socket: /var/run/mysqld/mysqlx.sock
2021-11-07T07:55:51.690582Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.27'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.
```

컨테이너가 정상적으로 실행되었는지 확인한다.

```shell
$ docker ps

CONTAINER ID   IMAGE      COMMAND                  CREATED         STATUS          PORTS                    NAMES
ddb780457980   mysql      "docker-entrypoint.s…"   4 minutes ago   Up 4 minutes    3306/tcp, 33060/tcp      musing_dewdney
```

### 컨테이너 실행 결과 확인하기

터미널을 하나 더 열어 방금 띄운 MySQL 컨테이너에 접속할 수 있다. 지정한 비밀번호로 MySQL 클라이언트에 접속해본다.

```shell
$ docker exec -it musing_dewdney bash

root@ddb780457980:/# mysql -uroot -p1234

mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 9
Server version: 8.0.27 MySQL Community Server - GPL

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

### 옵션 추가

MySQL 서버는 항상 실행되어 있어야 하므로 데몬 모드로 실행하는 것이 일반적이다. 또한, 컨테이너에 접근하기 쉽게 이름을 지정할 수 있다.
이미 실행 중인 컨테이너를 정지하고 삭제한 후, 몇 가지 옵션을 추가하여 새로 띄운다.

```shell
$ docker kill musing_dewdney

$ docker rm musing_dewdney

$ docker run --name mysql -e MYSQL_ROOT_PASSWORD=1234 -d mysql
```

성공적으로 실행되었다면, 아까와 같이 컨테이너 내부에 접속하여 확인할 수 있다.

```
$ docker exec -it mysql bash
```
