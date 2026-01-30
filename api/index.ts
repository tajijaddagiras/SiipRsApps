// MINIMAL DEBUG VERSION - No external dependencies
export default function handler(req, res) {
    // Step 1: Basic Response Test
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
}
