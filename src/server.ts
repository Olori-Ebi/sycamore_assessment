import app from './app';
import { env } from './config/env';
import { sequelize } from './config/sequelize';

(async () => {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        app.listen(env.PORT, () => {
            console.log(`Server started on port ${env.PORT} in ${env.NODE_ENV} mode`);
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Unable to start server:', error.message);
        } else {
            console.error('Unable to start server:', String(error));
        }
        process.exit(1);
    }
})();
