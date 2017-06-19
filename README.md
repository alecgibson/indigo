# Indigo

## Setup

### NPM

`npm install`  

`npm install -g gulp`  

`npm install -g sequelize-cli`  

### Postgres

Install Postgres.

May need to create superuser (`-s`) `postgres` user:  
`createuser -s postgres`

Make `db` directory:  
`mkdir db`

Start database:
`pg_ctl start -D db -l db/db.log`

Create database:  
`psql -U postgres 'CREATE DATABASE indigo;'`

## Running

(See `gulpfile.js`)
