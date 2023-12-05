import app from './app';
import connectToMongo from './database/mongo';
import { insertDefaultTables } from './database/table';
import { insertDefaultUsers } from './database/user';
import { messages } from './utils/constants';

const PORT = process.env.PORT || 3000;

connectToMongo()
  .then(() => Promise.all([insertDefaultUsers(), insertDefaultTables()]))
  .then(() => app.listen(PORT, () => {
    console.log(`${messages.local.serverStart}${PORT}`);
  }))