
CREATE DATABASE IF NOT EXISTS moc_wordpress;
GRANT ALL ON moc_wordpress.* TO 'moc_dbadmin'@'%' IDENTIFIED BY 'moc_!DB@dmin';
flush privileges;

CREATE DATABASE IF NOT EXISTS moc_application;
GRANT ALL ON moc_administration.* TO 'moc_dbadmin'@'%' IDENTIFIED BY 'moc_!DB@dmin';
flush privileges;
