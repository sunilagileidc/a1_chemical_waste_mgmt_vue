#!/bin/bash

set -e

echo "Fix permissions"

sudo chown -R ubuntu:www-data /var/www/html/projects/pharmacare_vue
sudo chmod -R 755 /var/www/html/projects/pharmacare_vue

echo "Restart Apache"

sudo systemctl restart apache2 || true

echo "Deployment completed"