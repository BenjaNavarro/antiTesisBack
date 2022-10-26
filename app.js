import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
// import path from 'path';

const app = express();
app.use(helmet());
const corsOptions = {
  exposedHeaders: 'x-auth-token',
}

app.use(morgan('dev'));
app.use(corsOptions);
app.use(express.json({limit:'50mb'}));
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit:'200mb',extended: true,parameterLimit:1000000}));

export default app;
