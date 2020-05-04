import App from './App';
import Commander from './logic/Commander';

const app = new App();
app.run();

// @ts-ignore
window.commander = new Commander(app);
