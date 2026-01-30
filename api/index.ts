// @ts-nocheck
try {
    const appModule = await import('../server/src/index');
    const app = appModule.default || appModule;

    export default async (req, res) => {
        try {
            return app(req, res);
        } catch (err) {
            console.error('Runtime Error in API Handler:', err);
            res.status(500).json({ error: 'Runtime Error', details: err.message });
        }
    };
} catch (loadError) {
    console.error('Failed to load server module:', loadError);
    export default (req, res) => {
        res.status(500).json({ error: 'Load Error', details: loadError.message, path: '../server/src/index' });
    };
}
