
const express = require('express');
const mongoose = require('mongoose');
const compressRoutes = require('./Routes/routes');
const cors = require('cors');
const app = express();
const port = 3002;

/* Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/compressImageVideo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});*/

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use('/api', compressRoutes);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
