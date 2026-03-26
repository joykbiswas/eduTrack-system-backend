import app from "./app";
import { envVars } from "./config/env";
import { runAllSeeds } from "./app/utils/seed";

const bootstrap = async () => {
    try {
        // Run database seeds
        await runAllSeeds();
        
        // Start the server
        app.listen(envVars.PORT, () => {
            console.log(`Server is running on http://localhost:${envVars.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

bootstrap();
