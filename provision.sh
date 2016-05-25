#!/bin/bash
php_config_file="/etc/php/7.0/phpdbg/php.ini"
xdebug_config_file="/etc/php/7.0/mods-available/xdebug.ini"
mysql_config_file="/etc/mysql/my.cnf"

# Update the server
sudo apt-get update
sudo apt-get -y upgrade

if [[ -e /var/lock/vagrant-provision ]]; then
    exit;
fi

################################################################################
# Everything below this line should only need to be done once
# To re-run full provisioning, delete /var/lock/vagrant-provision and run
#
#    $ vagrant provision
#
# From the host machine
################################################################################

IPADDR=$(/sbin/ifconfig eth0 | awk '/inet / { print $2 }' | sed 's/addr://')
sudo sed -i "s/^${IPADDR}.*//" /etc/hosts
#echo $IPADDR ubuntu.localhost >> /etc/hosts	# Just to quiet down some error messages

# Install basic tools
echo "Installing Basic Tools"
sudo apt-get -y install build-essential binutils-doc git

# Install Apache
echo "Installing Apache"
sudo apt-get -y install apache2

# Install MySQL
echo "Installing MySQL"
echo "mysql-server mysql-server/root_password password web" | sudo debconf-set-selections
echo "mysql-server mysql-server/root_password_again password web" | sudo debconf-set-selections
sudo apt-get -y install mysql-server mysql-client
echo "setting bind address"
sudo sed -e "[mysqld] bind-address=0.0.0.0" ${mysql_config_file}

# Allow root access from any host
echo "GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION" | mysql -u root --password=web
echo "GRANT PROXY ON ''@'' TO 'root'@'%' WITH GRANT OPTION" | mysql -u root --password=web

# Install PHP 7.0
echo "Installing PHP"
sudo apt-get install -y --allow-unauthenticated \
	build-essential \
	gcc \
	git \
	libapache2-mod-php7.0 \
	libpcre3-dev \
	libxml2-dev \
	libsnmp-dev \
	libtool \
	make \
	php7.0-fpm \
	php7.0-cli \
	php7.0-common \
	php7.0-curl \
	php7.0-dev \
	php7.0-gd \
	php7.0-imap \
	php7.0-intl \
	php7.0-json \
	php7.0-ldap \
	php7.0-mbstring \
	php7.0-opcache \
	php7.0-pgsql \
	php7.0-phpdbg \
	php7.0-pspell \
	php7.0-recode \
	php7.0-tidy \
	php7.0-xml \
	php7.0-zip \
	php-mysql \
	re2c \
	snmp-mibs-downloader

sudo a2enmod php7.0

sudo a2enconf php7.0-fpm

sudo net-snmp-config --snmpconfpath

phpenmod mysqli

# restart php-fpm
sudo service apache2 restart
sudo service php7.0-fpm restart

# Install composer
echo "Installing Composer"
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer

# restart php-fpm
echo "Restart All Services"
sudo service apache2 restart
sudo service mysql restart
sudo service php7.0-fpm restart

# Install zephir
echo "Installing Zephir"
sudo composer global require "phalcon/zephir:dev-master"

# Install phalconphp with php7
echo "Installing Phalcon"
cd /
sudo git clone https://github.com/phalcon/cphalcon -b 2.1.x --single-branch
cd cphalcon/
sudo ~/.composer/vendor/bin/zephir build --backend=ZendEngine3
sudo touch "/etc/php/7.0/mods-available/phalcon.ini"
sudo sed -e "\$aextension=phalcon.so" "/etc/php/7.0/mods-available/phalcon.ini"
sudo ln -sf /etc/php/7.0/mods-available/phalcon.ini /etc/php/7.0/apache2/conf.d/20-phalcon.ini

# some additional php settings if you care
sudo sed -i "s/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/g" /etc/php/7.0/cli/php.ini
sudo sed -i "s/memory_limit = 128M/memory_limit = 256M /g" /etc/php/7.0/fpm/php.ini

sudo a2enmod phalcon

# Install XDebug
echo "Installing XDebug"
sudo apt-get install php-xdebug
sudo sed -e "\$azend_extension=xdebug.so" ${xdebug_config_file}
sudo sed -e "\$axdebug.remote_enable=1" ${xdebug_config_file}
sudo sed -e "\$axdebug.remote_connect_back=1" ${xdebug_config_file}
sudo sed -e "\$axdebug.remote_port=9000" ${xdebug_config_file}
sudo sed -e "\$axdebug.remote_host=192.168.56.111" ${xdebug_config_file}

sudo ln -sf /etc/php/7.0/mods-available/xdebug.ini /etc/php/7.0/fpm/conf.d/20-xdebug.ini
sudo ln -sf /etc/php/7.0/mods-available/xdebug.ini /etc/php/7.0/apache2/conf.d/20-xdebug.ini

sudo sed -i "s/display_startup_errors = Off/display_startup_errors = On/g" ${php_config_file}
sudo sed -i "s/display_errors = Off/display_errors = On/g" ${php_config_file}

# Allow htaccess mod_rewrite
sudo a2enmod rewrite

# Set up the domain
echo "Setting up the domain"
sudo cp /vagrant/moc.dev.conf /etc/apache2/sites-available/moc.dev.conf
sudo chown www-data:www-data /etc/apache2/sites-available/moc.dev.conf
sudo chmod 755 /etc/apache2/sites-available/moc.dev.conf

# Disable the conflicting domain
sudo a2dissite 000-default
# Enable the correct domain
sudo a2ensite moc.dev.conf

# Restart Services
echo "Restart Apache"
sudo service apache2 restart
echo "Restart MySQL"
sudo service mysql restart
echo "Restart PHP"
sudo service php7.0-fpm restart

# Cleanup the default HTML file created by Apache
sudo rm /var/www/html/index.html

# Install the WordPress command line tools
echo "Installing WP CLI"
cd /
sudo curl -O "https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar"
sudo chmod +x wp-cli.phar
sudo mv wp-cli.phar /usr/local/bin/wp

# Set up the wordpress database
# Install the MOC WordPress Database
echo 'Installing moc_wordpress Db'
echo "CREATE DATABASE IF NOT EXISTS moc_wordpress" | mysql --silent -uroot -pweb
echo "GRANT ALL ON moc_wordpress.* TO 'moc_dbadmin'@'%' IDENTIFIED BY 'moc_!DB@dmin'" | mysql --silent -uroot -pweb
echo "flush privileges" | mysql --silent -uroot -pweb

# Set up the WordPress marketing site
cd /var/www/html/public/
echo "Installing WordPress"
wp core download
wp core config --dbname="moc_wordpress" --dbuser="moc_dbadmin" --dbpass="moc_!DB@dmin"
wp core install --url="http://moc.dev" --title="Mining Operations Controller" --admin_user="moc_admin" --admin_password="moc_wp-admin_01" --admin_email="admin@burningphantom.com"

# Set up the admin database
# Install the MOC Administration Database
echo 'Installing moc_application Db'
echo "CREATE DATABASE IF NOT EXISTS moc_application" | mysql --silent -uroot -pweb
echo "GRANT ALL ON moc_administration.* TO 'moc_dbadmin'@'%' IDENTIFIED BY 'moc_!DB@dmin'" | mysql --silent -uroot -pweb
echo "flush privileges" | mysql --silent -uroot -pweb

touch /var/lock/vagrant-provision
