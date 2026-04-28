@echo off

echo --- Resetting Database (Windows) ---

REM 1. Remove old database files
echo - Removing existing SQLite database files...
if exist texshoes.db del texshoes.db
if exist texshoes.db-shm del texshoes.db-shm
if exist texshoes.db-wal del texshoes.db-wal

REM 2. Apply EF Core Migrations to create the database and schema
echo - Applying Entity Framework migrations to create database...
dotnet ef database update

echo --- Database reset complete! ---
echo A new 'texshoes.db' file has been created and populated with initial data.

pause
