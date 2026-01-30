// @ts-nocheck
// Vercel Serverless Handler for Express App
import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Initialize Express app for serverless
const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$connect();
        res.json({ status: 'OK', database: 'Connected', timestamp: new Date().toISOString() });
    } catch (error: any) {
        console.error('Health Check Error:', error);
        res.status(500).json({ status: 'Error', message: 'Database Connection Failed', error: error.message });
    }
});

// LOGIN API
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Email atau Password salah' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email atau Password salah' });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({
            message: 'Login Berhasil',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: (user as any).phone,
                avatar: user.avatar,
                passwordMask: '*'.repeat((user as any).passwordLength || 8)
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// USER REGISTRATION API
app.post('/api/auth/register', async (req, res) => {
    const { email, password, name, phone } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                passwordLength: password.length,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            } as any
        });
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({
            message: 'Pendaftaran Berhasil',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                avatar: user.avatar,
                passwordMask: '*'.repeat((user as any).passwordLength || 8)
            }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Gagal mendaftarkan akun' });
    }
});

// GET RECENT LOGS
app.get('/api/logs', async (req, res) => {
    const userId = req.query.userId as string | undefined;
    try {
        const logs = await prisma.activityLog.findMany({
            where: userId ? { userId } : {},
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true } },
                patient: { select: { name: true, mrn: true } }
            }
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil log aktivitas' });
    }
});

// GET USER STATS
app.get('/api/users/stats/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const totalScans = await prisma.activityLog.count({
            where: { userId, type: { in: ['ACTION', 'SCAN'] } }
        });
        const successCount = await prisma.activityLog.count({
            where: { userId, type: 'ACTION' }
        });
        const totalPatients = await prisma.patient.count();
        res.json({ totalScans, successCount, totalPatients, alertCount: 0 });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ message: 'Gagal mengambil statistik' });
    }
});

// GET ALL PATIENTS
app.get('/api/patients', async (req, res) => {
    const { query, userId } = req.query as { query?: string, userId?: string };
    if (!userId) {
        return res.status(400).json({ message: 'User ID diperlukan' });
    }
    try {
        const whereClause: any = {
            OR: [
                { userId: userId },
                { activityLogs: { some: { userId: userId } } }
            ]
        };
        if (query) {
            whereClause.AND = [{
                OR: [
                    { name: { contains: query } },
                    { mrn: { contains: query } }
                ]
            }];
        }
        const patients = await prisma.patient.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        res.json(patients);
    } catch (error) {
        console.error('Fetch Patients Error:', error);
        res.status(500).json({ message: 'Gagal mengambil data pasien' });
    }
});

// PATIENT REGISTRATION
app.post('/api/patients/register', async (req, res) => {
    const { mrn, name, dob, gender, category, userId, room } = req.body;
    if (!userId) {
        return res.status(400).json({ message: 'User ID diperlukan untuk pendaftaran' });
    }
    try {
        const existingPatient = await prisma.patient.findUnique({ where: { mrn } });
        let patient;
        if (existingPatient) {
            patient = await prisma.patient.update({
                where: { mrn },
                data: { userId, name, dob: dob || undefined, gender, category, room } as any
            });
        } else {
            patient = await prisma.patient.create({
                data: { mrn, name, dob: dob || null, gender, category, room, userId } as any
            });
        }
        await prisma.activityLog.create({
            data: { userId, patientId: patient.id, type: 'SCAN', description: `Mendaftarkan pasien baru: ${name} (${mrn})` }
        });
        res.json({ message: existingPatient ? 'Data Pasien diperbarui' : 'Pendaftaran Berhasil', patient });
    } catch (error) {
        console.error('Patient Registration Error:', error);
        res.status(500).json({ message: 'Gagal mendaftarkan pasien' });
    }
});

// POST ACTIVITY LOG
app.post('/api/logs', async (req, res) => {
    const { userId, patientId, type, description } = req.body;
    try {
        const log = await prisma.activityLog.create({
            data: { userId, patientId, type, description },
            include: { patient: true }
        });
        res.json({ message: 'Aktivitas berhasil dicatat', log });
    } catch (error) {
        console.error('Create Log Error:', error);
        res.status(500).json({ message: 'Gagal mencatat aktivitas' });
    }
});

// UPDATE USER PROFILE
app.put('/api/users/profile/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name, phone, avatar } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name, phone, avatar } as any
        });
        res.json({
            message: 'Profil berhasil diperbarui',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                phone: (updatedUser as any).phone,
                avatar: updatedUser.avatar
            }
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Gagal memperbarui profil' });
    }
});

// Vercel handler export
export default app;
