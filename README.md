# squibly_mvp_server
## Getting Setup Locally
- clone repo to local machine. 
- make sure redis is installed
- start redis with `redis-server`
- navigate to folder on machine
- run `npm install`
- run `npm start`

### Dropping the database
If you need to drop the database add `force: true` between curly brackets line 121(subject to change) of '/index.js'

#### example:
```js
models.sequelize.sync({ force: true }).then(() => {
  server.listen(8080, () => {
```  
once the data is dropped and the server has restarted remove `force: true` to prevent the data from being drop every time a change is saved.
