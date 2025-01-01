import { Server } from 'http';
import app from './app'
import config from './config';
// import config from './config';

async function main() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const server: Server = app.listen(config.port, () => {
        // eslint-disable-next-line no-console
        console.log("Sever is running on port ", config.port);
    })
}

main();