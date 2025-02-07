FROM postgres:17

ENV DEBIAN_FRONTEND noninteractive

ENV POSTGRES_DB gisdb
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres


RUN apt-get update -y
RUN exec apt install postgresql-17-ogr-fdw -y
RUN exec apt install postgresql-17-postgis -y
RUN exec apt-get install postgresql-17-pgrouting -y
COPY ./gisdb_dump_v3.sql /docker-entrypoint-initdb.d/