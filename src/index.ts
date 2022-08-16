import express from 'express';
import {getPackage, getPackageNames} from './packages/packages';
import {readPackages} from './services/readPackages';

const hostName = 'localhost';
const port = 8080;

const app = express();
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  res.render('index', getPackageNames());
});

app.get('/pkg/:name.html', (req, res) => {
  res.render('pkg', getPackage(req.params.name));
});

app.listen(port, async () => {
  await readPackages();
  console.log(`Server running at http://${hostName}:${port}/`);
});
