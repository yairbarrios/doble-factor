# ajedrez
Proyecto Final de Desarrollo de Software IX

# Ejecución
## Backend
Estando en la carpeta backend ejecutar:

```
$ npm install
$ npm run dev
```

## Frontend
Estando en la carpeta frontend ejecutar:

```
$ npm install
$ npm start
```

## Configuración de mongo
Ejecutar en una terminal: 
```
docker run -d --rm --name chess-mongodb \
      -e MONGO_INITDB_ROOT_USERNAME=admin \
      -e MONGO_INITDB_ROOT_PASSWORD=password \
      -p 27017:27017 \
      -v db:/data/db \
      mongo
```