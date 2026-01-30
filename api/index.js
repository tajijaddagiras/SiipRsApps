// MINIMAL DEBUG VERSION - Pure JavaScript, No TypeScript
module.exports = function handler(req, res) {
    try {
        const debugInfo = {
            step: 1,
            message: 'Basic function is working',
            timestamp: new Date().toISOString(),
            env: {
                hasDbUrl: !!process.env.DATABASE_URL,
                dbUrlPreview: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'NOT SET',
                hasJwtSecret: !!process.env.JWT_SECRET,
                nodeEnv: process.env.NODE_ENV
            }
        };
        return res.status(200).json(debugInfo);
    } catch (error) {
        return res.status(500).json({
            error: 'Caught Error',
            message: error.message,
            stack: error.stack
        });
    }
};
