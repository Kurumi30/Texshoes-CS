#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Define colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "${GREEN}--- Resetting Database ---${NC}"

# 1. Remove old database files
echo "- Removing existing SQLite database files..."
rm -f texshoes.db texshoes.db-shm texshoes.db-wal

# 2. Apply EF Core Migrations to create the database and schema
echo "- Applying Entity Framework migrations to create database..."
dotnet ef database update

echo "${GREEN}--- Database reset complete! ---${NC}"
echo "A new 'texshoes.db' file has been created and populated with initial data."
