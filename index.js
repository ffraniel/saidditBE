const app = require('./server');
const config = require('./config');

const PORT = process.env.PORT || config.PORT[process.env.NODE_ENV];

app.listen(PORT, function () {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${PORT}`);
});