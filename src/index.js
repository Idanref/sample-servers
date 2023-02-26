// External Modules
const express = require('express');
const bodyParser = require('body-parser');
// Routes & Helpers
const serversRoutes = require('./routes/server');
const historyRoutes = require('./routes/history');
const { createTablesIfNotExist } = require('./migrations/create_tables');
const { initiateSchedulingJobs } = require('./worker/cron');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/servers', serversRoutes);
app.use('/history', historyRoutes);

app.listen(port, () => {
  createTablesIfNotExist();
  initiateSchedulingJobs();
  console.log(`Server is up on port ${port}!`);
});
