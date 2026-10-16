FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
    git curl libpng-dev libxml2-dev zip unzip oniguruma-dev libzip-dev \
    nodejs npm

RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html