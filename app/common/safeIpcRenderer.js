const { ipcRenderer } = require('electron');
const { flatten } = require('./utils')

class SafeIpcRenderer {
    constructor(events) {
        const validEvents = flatten(events);
        const protect = fn => {
            return (channel, ...args) => {
                if (!validEvents.includes(channel)) {
                    throw new Error(`Blocked access to unknown channel ${channel} from the renderer.
                                Add channel to whitelist in preload.js in case it is legitimate.`);
                }
                return fn.apply(ipcRenderer, [channel].concat(args));
            };
        };
        this.on = protect(ipcRenderer.on);
        this.once = protect(ipcRenderer.once);
        this.removeListener = protect(ipcRenderer.removeListener);
        this.removeAllListeners = protect(ipcRenderer.removeAllListeners);
        this.send = protect(ipcRenderer.send);
        this.sendSync = protect(ipcRenderer.sendSync);
        this.sendToHost = protect(ipcRenderer.sendToHost);
    }
}

module.exports = SafeIpcRenderer;