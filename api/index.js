// Full API Implementation - Pure JavaScript for Vercel Serverless
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$connect();
        res.json({
            status: 'OK',
            database: 'Connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health Check Error:', error);
        res.status(500).json({
            status: 'Error',
            message: 'Database Connection Failed',
            error: error.message
        });
    }
});

// SEND OTP API
app.post('/api/auth/send-otp', async (req, res) => {
    const { email, context } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email diperlukan' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Database (Persistent across serverless invocations)
    try {
        // Delete existing OTPs for this email to keep it clean
        await prisma.oTP.deleteMany({ where: { email } });

        await prisma.oTP.create({
            data: {
                email,
                code: otp,
                context: context || 'REGISTER',
                expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
            }
        });
    } catch (dbError) {
        console.error('Database OTP Error:', dbError);
        return res.status(500).json({ message: 'Gagal menyimpan kode OTP', error: dbError.message });
    }

    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Kode Verifikasi SIIP RS ESA UNGGUL',
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4285F4;">Verifikasi Akun Anda</h2>
        <p>Halo,</p>
        <p>Gunakan kode OTP berikut untuk melanjutkan tindakan Anda di SIIP RS ESA UNGGUL:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4285F4;">${otp}</span>
        </div>
        <p>Kode ini berlaku selama 10 menit. Jika Anda tidak merasa melakukan tindakan ini, silakan abaikan email ini.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #777;">Email ini dikirim secara otomatis oleh sistem SIIP RS ESA UNGGUL.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP sent to:', email);
        res.json({ message: 'Kode OTP berhasil dikirim ke email Anda' });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ message: 'Gagal mengirim kode OTP', error: error.message });
    }
});

// VERIFY OTP API
app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: 'Email dan kode OTP diperlukan' });
    }

    try {
        // Find newest OTP for this email
        const storedOtp = await prisma.oTP.findFirst({
            where: { email },
            orderBy: { createdAt: 'desc' }
        });

        if (!storedOtp) {
            return res.status(400).json({ message: 'Kode OTP tidak ditemukan. Silakan minta kode baru.' });
        }

        if (new Date() > storedOtp.expiresAt) {
            await prisma.oTP.delete({ where: { id: storedOtp.id } });
            return res.status(400).json({ message: 'Kode OTP sudah kedaluwarsa. Silakan minta kode baru.' });
        }

        if (storedOtp.code !== code) {
            return res.status(400).json({ message: 'Kode OTP tidak valid' });
        }

        // OTP valid - remove usage
        await prisma.oTP.deleteMany({ where: { email } });
        res.json({ message: 'Verifikasi berhasil', verified: true });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ message: 'Gagal memverifikasi OTP', error: error.message });
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
                phone: user.phone,
                avatar: user.avatar,
                passwordMask: '*'.repeat(user.passwordLength || 8)
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
    }
});

// USER REGISTRATION API
app.post('/api/auth/register', async (req, res) => {
    const { email, password, name, phone } = req.body;
    console.log('Registering user:', email); // Debug log
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
            }
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
                passwordMask: '*'.repeat(user.passwordLength || 8)
            }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Gagal mendaftarkan akun', error: error.message });
    }
});

// GET RECENT LOGS
app.get('/api/logs', async (req, res) => {
    const userId = req.query.userId;
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
        console.error('Fetch Logs Error:', error);
        res.status(500).json({ message: 'Gagal mengambil log aktivitas', error: error.message });
    }
});

// GET UNREAD LOG COUNT
app.get('/api/logs/unread-count/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const count = await prisma.activityLog.count({
            where: { userId, isRead: false }
        });
        res.json({ count });
    } catch (error) {
        console.error('Unread Count Error:', error);
        res.status(500).json({ message: 'Gagal mengambil jumlah notifikasi' });
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
        const totalPatients = await prisma.patient.count({
            where: { userId }
        });
        res.json({ totalScans, successCount, totalPatients, alertCount: 0 });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ message: 'Gagal mengambil statistik', error: error.message });
    }
});

// GET ALL PATIENTS
app.get('/api/patients', async (req, res) => {
    const { query, userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: 'User ID diperlukan' });
    }
    try {
        const whereClause = {
            OR: [
                { userId: userId },
                { activityLogs: { some: { userId: userId } } }
            ]
        };
        if (query) {
            whereClause.AND = [{
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { mrn: { contains: query, mode: 'insensitive' } }
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
        res.status(500).json({ message: 'Gagal mengambil data pasien', error: error.message });
    }
});

// GET PATIENT BY MRN
app.get('/api/patients/:mrn', async (req, res) => {
    const { mrn } = req.params;
    try {
        const patient = await prisma.patient.findUnique({
            where: { mrn },
            include: {
                activityLogs: {
                    take: 10,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
        if (!patient) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan' });
        }
        res.json(patient);
    } catch (error) {
        console.error('Fetch Patient Error:', error);
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
                data: { userId, name, dob: dob || undefined, gender, category, room }
            });
        } else {
            patient = await prisma.patient.create({
                data: { mrn, name, dob: dob || null, gender, category, room, userId }
            });
        }
        await prisma.activityLog.create({
            data: {
                userId,
                patientId: patient.id,
                type: 'SCAN',
                description: `Mendaftarkan pasien: ${name} (${mrn})`
            }
        });
        res.json({
            message: existingPatient ? 'Data Pasien diperbarui' : 'Pendaftaran Berhasil',
            patient
        });
    } catch (error) {
        console.error('Patient Registration Error:', error);
        res.status(500).json({ message: 'Gagal mendaftarkan pasien', error: error.message });
    }
});

// UPDATE PATIENT
app.put('/api/patients/:id', async (req, res) => {
    const { id } = req.params;
    const { name, dob, gender, category, room } = req.body;
    try {
        const patient = await prisma.patient.update({
            where: { id },
            data: { name, dob, gender, category, room }
        });
        res.json({ message: 'Data pasien berhasil diperbarui', patient });
    } catch (error) {
        console.error('Update Patient Error:', error);
        res.status(500).json({ message: 'Gagal memperbarui data pasien' });
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
        res.status(500).json({ message: 'Gagal mencatat aktivitas', error: error.message });
    }
});

// UPDATE USER PROFILE
app.put('/api/users/profile/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name, phone, avatar } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name, phone, avatar }
        });
        res.json({
            message: 'Profil berhasil diperbarui',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name,
                phone: updatedUser.phone,
                avatar: updatedUser.avatar
            }
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Gagal memperbarui profil' });
    }
});

// Vercel Serverless Handler
module.exports = app;
