const cluster = require('cluster');
const {
  httpPort,
  dbConnectionString,
} = require('./configuration');
const setupWorkerProcesses = require('./common/utils/workerProcesses');
const logging = require('./common/logging');
const signals = require('./signals');
const db = require('./data/infrastructure/db')({ dbConnectionString });
const postsRepositoryContainer = require('./data/repositories/posts');
const usersRepositoryContainer = require('./data/repositories/users');
const filmsRepositoryContainer = require('./data/repositories/films');
const companiesRepositoryContainer = require('./data/repositories/companies');
const authenticationRepositoryContainer = require('./data/repositories/authenticationRepository');
const recourceLimiterRepositoryContainer = require('./data/repositories/recourceLimiterRepository');
const authServiceContainer = require('./domain/auth/service');
const postsServiceContainer = require('./domain/posts/service');
const filmsServiceContainer = require('./domain/films/service');
const companiesServiceContainer = require('./domain/companies/service');

const usersServiceContainer = require('./domain/users/service');
const appContainer = require('./router/http/app');
const websocketsContainer = require('./router/websockets');

const authenticationRepository = authenticationRepositoryContainer.init();
const postsRepository = postsRepositoryContainer.init(db.schemas);
const filmsRepository = filmsRepositoryContainer.init(db.schemas);
const companiesRepository = companiesRepositoryContainer.init(db.schemas);

const usersRepository = usersRepositoryContainer.init(db.schemas);
const recourceLimiterRepository = recourceLimiterRepositoryContainer.init();
const authService = authServiceContainer.init({
  authenticationRepository,
  usersRepository,
  recourceLimiterRepository,
});
const postsService = postsServiceContainer.init({
  postsRepository,
});
const filmsService = filmsServiceContainer.init({
  filmsRepository,
});
const companiesService = companiesServiceContainer.init({
  companiesRepository,
});
const usersService = usersServiceContainer.init({
  usersRepository,
  postsRepository,
});
const app = appContainer.init({
  authService,
  postsService,
  usersService,
  filmsService,
  companiesService,
});
const websockets = websocketsContainer.init(app);

let server;

((isClusterRequired) => {
  // if it is a master process then call setting up worker process
  if (isClusterRequired && cluster.isMaster) {
    setupWorkerProcesses();
  } else {
    // to setup server configurations and share port address for incoming requests
    server = app.listen(httpPort, () => {
      logging.info(`Listening on *:${httpPort}`);
    });
  }
})(true);


const shutdown = signals.init(async () => {
  await db.close();
  await server.close();
});

(async () => {
  try {
    await db.connect();
  } catch (error) {
    await shutdown();
  }
})();

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
