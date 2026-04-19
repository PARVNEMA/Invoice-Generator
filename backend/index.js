
require('dotenv').config({ path: './.env' });
const connectDB = require('./db/index.js');
const app = require('./server.js');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('MONGO db connection failed !!! ', err);
    process.exit(1);
  });
