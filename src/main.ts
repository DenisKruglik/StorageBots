import App from './App';
import Commander from './logic/Commander';

const app = new App();
app.run();

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
window.commander = new Commander(app);
