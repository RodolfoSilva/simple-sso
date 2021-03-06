import 'reflect-metadata';
import * as TypeORM from 'typeorm';
import express from 'express';
import engine from 'ejs-mate';
import morgan from 'morgan';
import session from 'express-session';
import router from './router';

import { Container } from 'typedi';
import { User } from './entity/User';

(async () => {
  TypeORM.useContainer(Container);
  const connection = await TypeORM.createConnection();

  const userRepository = connection.getRepository(User);

  const app = express();

  let user = await userRepository.findOne({ email: 'admin@admin.com' });

  if (!user) {
    user = new User();

    user.firstName = 'Admin';
    user.lastName = 'General';
  }

  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
    }),
  );
  app.use((req, res, next) => {
    console.log(req.session);
    next();
  });
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(morgan('dev'));
  app.engine('ejs', engine);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');

  app.use('/simplesso', router);
  app.get('/', (req, res, next) => {
    res.render('index', {
      what: `SSO-Server ${req.session.user}`,
      title: 'SSO-Server | Home',
    });
  });

  app.use((req, res, next) => {
    // catch 404 and forward to error handler
    const err = new Error('Resource Not Found') as any;
    err.status = 404;
    next(err);
  });

  app.use((err, req, res, next) => {
    console.error({
      message: err.message,
      error: err,
    });
    const statusCode = err.status || 500;
    let message = err.message || 'Internal Server Error';

    if (statusCode === 500) {
      message = 'Internal Server Error';
    }
    res.status(statusCode).json({ message });
  });

  app.listen(3010, () => console.log(`👾 RUNING: http://localhost:3010`));
})();
