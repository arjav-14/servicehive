import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

const startServer = async () => {
  // Initialize Database Connection
  await connectDB();

  // Bind server to port
  app.listen(env.PORT, () => {
    console.log(`🚀 Server successfully started in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`🔗 API Base url: http://localhost:${env.PORT}/api`);
  });
};

startServer().catch((error) => {
  console.error('💥 Server boot failed:', error);
  process.exit(1);
});
