---
title: mysql dockerize(1) - 도커로 mysql container 띄우기
date: 2021/11/07
tags: MYSQL_ALLOW_EMPTY_PASSWORD MYSQL_RANDOM_ROOT_PASSWORD MYSQL_ROOT_PASSWORD container docker mysql
---

> 내 로컬 환경은 소중하니까

최근 작업 중 DB에 스키마 변경을 가하면 DB랑 로컬 개발 환경이 함께 쭉 드러누워버리는 일이 자주 발생합니다. 로컬에서 돌리고 있던 mysql을 격리시켜버리기로 결심했습니다.

## 시작점

저는 DB로 mysql을 쓰고있고, ROR로 프로젝트를 진행하고 있습니다. 로컬 환경에 mysql server를 설치해 쓰고있었고, Docker는 이미 깔려있습니다.

## 도커로 mysql container 띄우기

### mysql 이미지 가져오기

먼저 mysql 이미지를 가져옵니다.

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

lts버젼의 mysql 이미지가 로드됩니다.

### mysql 이미지를 컨테이너로 실행하기

로드한 이미지를 컨테이너로 실행해봅니다.

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

에러가 뜹니다. mysql 컨테이너는 root 유저의 password를 어떻게 할 것인지에 대해 옵션을 명시해야 한다고 합니다. 아래 3개의 항목 중 하나를 선택해 컨테이너 안에 환경변수로 넘겨 줍니다.

```shell
$ docker run mysql -e MYSQL_ROOT_PASSWORD=1234
# 또는
$ docker run mysql -e MYSQL_ALLOW_EMPTY_PASSWORD=abcd
# 또는
$ docker run mysql -e MYSQL_RANDOM_ROOT_PASSWORD=abcd
```

저는 root password를 지정해주었습니다. password를 설정하지 않는 `MYSQL_ALLOW_EMPTY_PASSWORD` 옵션이나 `MYSQL_RANDOM_ROOT_PASSWORD` 옵션도 환경변수 안에 어떤 값이든 담아주어야 동작합니다. 실제로 해당 값이 영향을 끼치지는 않습니다.

random 옵션은 아래와 같이 실행 로그에서 비밀번호를 알려줍니다.

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

컨테이너가 잘 떴는지 확인해봅니다.

```shell
$ docker ps

CONTAINER ID   IMAGE      COMMAND                  CREATED         STATUS          PORTS                    NAMES
ddb780457980   mysql      "docker-entrypoint.s…"   4 minutes ago   Up 4 minutes    3306/tcp, 33060/tcp      musing_dewdney
```

### 컨테이너 실행 결과 확인하기

터미널 창을 하나 더 켜고, 아래 명령어로 방금 띄운 mysql 컨테이너에 접속해 볼 수 있습니다. 지정한 비밀번호로 mysql 클라이언트도 잘 접속이 됩니다.

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

mysql 서버는 항상 돌아가고 있어야 하므로 데몬 환경으로 실행하는 것이 일반적입니다. 그리고 편하게 접근하기 위해서 임의로 컨테이너에 네임도 붙이고 싶습니다.
띄워놓은 컨테이너를 정지, 삭제 하고 몇가지 옵션을 추가해 새로 띄워봅니다.

```shell
$ docker kill musing_dewdney

$ docker rm musing_dewdney

$ docker run --name mysql -e MYSQL_ROOT_PASSWORD=1234 -d mysql
```

성공하였다면 아까와 같이 컨테이너 안에 접속하여 확인할 수 있습니다.

```
$ docker exec -it mysql bash
```
