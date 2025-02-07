FROM geosolutionsit/geoserver

COPY . /geoserver
COPY ./entrypoint.sh /entrypoint.sh

ENV GEOSERVER_DATA_DIR=/geoserver/data_dir
ENV GEOWEBCACHE_CONFIG_DIR=/geoserver/data_dir/gwc
ENV GEOWEBCACHE_CACHE_DIR=/geoserver/data_dir/gwc
ENV CORS_ENABLED=true
ENV CORS_ALLOWED_ORIGINS="*"
ENV CORS_ALLOWED_METHODS="GET,POST,PUT,DELETE,HEAD,OPTIONS"
ENV CORS_ALLOWED_HEADERS="*"

