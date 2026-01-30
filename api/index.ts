// @ts-nocheck
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        // Dynamic import to catch any load errors
        const appModule = await import('../server/src/index');
        const app = appModule.default || appModule;

        // Let Express handle the request
        return app(req, res);
    } catch (err: any) {
        console.error('API Handler Error:', err);
        res.status(500).json({
            error: 'Serverless Function Error',
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
}
