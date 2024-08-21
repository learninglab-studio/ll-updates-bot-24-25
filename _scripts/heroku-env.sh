#!/bin/bash

# Check if the .env file is passed as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 path/to/.env"
  exit 1
fi

# Check if the .env file exists
if [ ! -f "$1" ]; then
  echo ".env file not found!"
  exit 1
fi

# Read the .env file and set the variables in Heroku
while IFS='=' read -r key value; do
  # Ignore empty lines and comments
  if [ -n "$key" ] && [[ "$key" != \#* ]]; then
    # Remove possible surrounding quotes from the value
    value=$(echo $value | sed -e 's/^"//' -e 's/"$//')
    echo "Setting $key in Heroku..."
    heroku config:set "$key=$value"
  fi
done < "$1"
