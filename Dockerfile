FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    curl \
    ca-certificates \
    npm \
    nodejs \
    default-mysql-client \
  && rm -rf /var/lib/apt/lists/*

# Enable PHP extensions for Laravel + MySQL
RUN docker-php-ext-install pdo pdo_mysql

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

# Default command is overridden by docker-compose for dev
CMD ["php", "-v"]

