import FEEMonitor from './FEEMonitor';
const _FEEMonitor = function (config) {
    if (typeof window !== 'undefined' && !window._feeminjected) {
        window._feeminjected = true;
        window._feemins = new FEEMonitor(config);
    }
};
export default _FEEMonitor;
