#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE prisma;
    CREATE DATABASE typeorm;
    CREATE DATABASE test_db;
    CREATE DATABASE logs_db;
EOSQL

# Adiciona extensão uuid-ossp a todos os bancos
for db in postgres prisma typeorm test_db logs_db; do
    echo "Adicionando extensão uuid-ossp ao banco $db"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$db" <<-EOSQL
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL
done
