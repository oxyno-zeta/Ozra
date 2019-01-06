# Ozra

[![Greenkeeper badge](https://badges.greenkeeper.io/oxyno-zeta/Ozra.svg)](https://greenkeeper.io/)

Launcher and monitoring server

## Project
Monitoring server and launcher of defined script by user.

### Description
This server allow you to save script and run it through a RESTFULL API.
Another thing is that you can monitor your server through WebSockets.

IMPORTANT: Linux only for the moment !

### Database
Database used is NoSQL (CouchDB) so you can put your own server if you want.
Otherwise, it will create a folder with data in (leveldown).

### Features
- Run script on server
- RESTFULL API
- Monitoring (not yet)

## Requirements
- NodeJS installed (tested on NodeJS 4.2)
- NPM installed

## Install as service
- Download archive and extract it
- Launch the install script as "root" user
- Start Ozra server with the command :
```
service ozra start
```
- To stop it, use :
```
service ozra stop
```
- Go on your browser at url : http://server-ip:2040/ (default port)

(Default login : admin/admin)

## No install and run
If you don't want to install Ozra as service, simply go into "ozra" folder and run :
```
node main.js
```

## Environment variables
- "OZRA_PORT": Server port
- "OZRA_VERBOSE": Server verbose (boolean value)
- "OZRA_DATABASE_SERVER_URL": CouchDB database server url (not necessary, data will be put on hard drive)
- "OZRA_DATABASE_NAME": Database name

## Powered by
- NodeJS

## Licence
Free for personal use. For commercial use, please, contact me.

## Thanks
My wife BH to support me doing this

## Author
Alexandre Havrileck (Oxyno-zeta)
