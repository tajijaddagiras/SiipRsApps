import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendOTPEmail } from './utils/mailer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// UPLOAD ENDPOINT
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Gagal mengunggah file' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Health Check
app.get('/health', async (req, res) => {
    try {
        await prisma.$connect();
        res.json({ status: 'OK', database: 'Connected' });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Database Connection Failed' });
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

        // AUTO-HEAL: Update passwordLength if it's incorrect/missing
        if ((user as any).passwordLength !== password.length) {
            await prisma.user.update({
                where: { id: user.id },
                data: { passwordLength: password.length } as any
            });
            (user as any).passwordLength = password.length;
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
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
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

// SEND OTP API
app.post('/api/auth/send-otp', async (req, res) => {
    const { email, context } = req.body; // context: 'RESET_PASSWORD' or 'REGISTER'

    if (!email) {
        return res.status(400).json({ message: 'Email harus diisi' });
    }

    try {
        // Generate 6 digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save to DB
        await prisma.oTP.create({
            data: {
                email,
                code,
                expiresAt,
                context: context || 'RESET_PASSWORD'
            }
        });

        // Send Email
        const success = await sendOTPEmail(email, code);

        if (success) {
            res.json({ message: 'Kode OTP telah dikirim ke email Anda' });
        } else {
            res.status(500).json({ message: 'Gagal mengirim email OTP' });
        }
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengirim OTP' });
    }
});

// VERIFY OTP API
app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: 'Email dan Kode OTP harus diisi' });
    }

    try {
        const otpRecord = await prisma.oTP.findFirst({
            where: {
                email,
                code,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Kode OTP salah atau sudah kadaluwarsa' });
        }

        // Optional: Delete OTP after use or mark as used
        await prisma.oTP.deleteMany({
            where: { email, code }
        });

        res.json({ message: 'Verifikasi berhasil', success: true });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat verifikasi OTP' });
    }
});

// PATIENT REGISTRATION API
app.post('/api/patients/register', async (req, res) => {
    const { mrn, name, dob, gender, category, userId, room } = req.body;

    try {
        // Cek apakah MRN sudah ada
        const existingPatient = await prisma.patient.findUnique({ where: { mrn } });
        if (existingPatient) {
            return res.status(400).json({ message: 'No. Rekam Medis sudah terdaftar' });
        }

        const patient = await prisma.patient.create({
            data: {
                mrn,
                name,
                dob,
                gender,
                category,
                room
            } as any
        });

        // Catat aktivitas jika ada userId
        if (userId) {
            await prisma.activityLog.create({
                data: {
                    userId,
                    patientId: patient.id,
                    type: 'REGISTER',
                    description: `Mendaftarkan pasien baru: ${name} (${mrn})`
                }
            });
        }

        res.json({
            message: 'Pendaftaran Berhasil',
            patient
        });
    } catch (error) {
        console.error('Patient Registration Error:', error);
        res.status(500).json({ message: 'Gagal mendaftarkan pasien' });
    }
});

// GET RECENT LOGS
app.get('/api/logs', async (req, res) => {
    const { userId } = req.query;
    try {
        const logs = await prisma.activityLog.findMany({
            where: userId ? { userId: userId as string } : {},
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

// GET UNREAD LOGS COUNT
app.get('/api/logs/unread-count/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const count = await prisma.activityLog.count({
            where: {
                userId,
                isRead: false
            } as any
        });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil jumlah notifikasi' });
    }
});

// MARK LOG AS READ
app.put('/api/logs/mark-as-read/:logId', async (req, res) => {
    const { logId } = req.params;
    try {
        await prisma.activityLog.update({
            where: { id: logId },
            data: { isRead: true } as any
        });
        res.json({ message: 'Notifikasi ditandai telah dibaca' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui status notifikasi' });
    }
});

// GET ALL PATIENTS (With Search & User Isolation + Interaction)
app.get('/api/patients', async (req, res) => {
    const { query, userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User ID diperlukan' });
    }

    try {
        // Patients registered by user OR patients who have at least one activity log by this user
        const whereClause: any = {
            OR: [
                { userId: userId as string },
                { activityLogs: { some: { userId: userId as string } } }
            ]
        };

        if (query) {
            whereClause.AND = [
                {
                    OR: [
                        { name: { contains: query as string } },
                        { mrn: { contains: query as string } }
                    ]
                }
            ];
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

// Search Patient by MRN
app.get('/api/patients/search/:mrn', async (req, res) => {
    const { mrn } = req.params;

    try {
        const patient = await prisma.patient.findUnique({
            where: { mrn }
        });

        if (!patient) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan' });
        }

        res.json(patient);
    } catch (error) {
        console.error('Search Patient Error:', error);
        res.status(500).json({ message: 'Gagal mencari pasien' });
    }
});

// UPDATE PATIENT DATA
app.put('/api/patients/:id', async (req, res) => {
    const { id } = req.params;
    const { name, dob, gender, category, mrn, room, userId } = req.body;

    try {
        // 1. Check if patient exists
        const existingPatient = await prisma.patient.findUnique({
            where: { id }
        });

        if (!existingPatient) {
            return res.status(404).json({ message: 'Pasien tidak ditemukan' });
        }

        // 2. Check if MRN is being changed and if it conflicts with another patient
        if (mrn && mrn !== existingPatient.mrn) {
            const mrnConflict = await prisma.patient.findUnique({
                where: { mrn }
            });
            if (mrnConflict) {
                return res.status(400).json({ message: 'Nomor Rekam Medis sudah digunakan oleh pasien lain' });
            }
        }

        // 3. Update patient
        const updatedPatient = await prisma.patient.update({
            where: { id },
            data: {
                name: name || undefined,
                dob: dob || undefined,
                gender: gender || undefined,
                category: category || undefined,
                mrn: mrn || undefined,
                room: room || undefined,
            }
        });

        // 4. Log the update activity if userId is provided
        if (userId) {
            await prisma.activityLog.create({
                data: {
                    userId,
                    patientId: updatedPatient.id,
                    type: 'UPDATE',
                    description: `Memperbarui data pasien: ${updatedPatient.name}`
                }
            });
        }

        res.json(updatedPatient);
    } catch (error) {
        console.error('Update Patient Error:', error);
        res.status(500).json({ message: 'Gagal memperbarui data pasien' });
    }
});

// PATIENT REGISTRATION API
app.post('/api/patients/register', async (req, res) => {
    const { mrn, name, dob, gender, category, userId, room } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID diperlukan untuk pendaftaran' });
    }

    try {
        const existingPatient = await prisma.patient.findUnique({ where: { mrn } });
        let patient;

        if (existingPatient) {
            // Jika pasien sudah ada, tautkan ke user ini dan update data
            patient = await prisma.patient.update({
                where: { mrn },
                data: {
                    userId,
                    name,
                    dob: dob || undefined,
                    gender,
                    category,
                    room
                } as any
            });
        } else {
            patient = await prisma.patient.create({
                data: {
                    mrn,
                    name,
                    dob: dob || null,
                    gender,
                    category,
                    room,
                    userId
                } as any
            });
        }

        // Catat aktivitas pendaftaran
        await prisma.activityLog.create({
            data: {
                userId,
                patientId: patient.id,
                type: 'SCAN',
                description: `Mendaftarkan pasien baru: ${name} (${mrn})`
            }
        });

        res.json({
            message: existingPatient ? 'Data Pasien diperbarui & ditautkan' : 'Pendaftaran Berhasil',
            patient
        });
    } catch (error) {
        console.error('Patient Registration Error:', error);
        res.status(500).json({ message: 'Gagal mendaftarkan pasien' });
    }
});

// Post Activity Log (General)
app.post('/api/logs', async (req, res) => {
    const { userId, patientId, type, description } = req.body;

    try {
        const log = await prisma.activityLog.create({
            data: {
                userId,
                patientId,
                type,
                description
            },
            include: {
                patient: true
            }
        });

        res.json({
            message: 'Aktivitas berhasil dicatat',
            log
        });
    } catch (error) {
        console.error('Create Log Error:', error);
        res.status(500).json({ message: 'Gagal mencatat aktivitas' });
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

        // For now, let's say alert is 0 if everything is fine
        const alertCount = 0;

        res.json({
            totalScans,
            successCount,
            totalPatients,
            alertCount
        });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ message: 'Gagal mengambil statistik' });
    }
});

// UPDATE USER PROFILE
app.put('/api/users/profile/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name, phone, avatar } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                phone,
                avatar
            } as any
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

// RESET PASSWORD API
app.post('/api/auth/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Kata sandi berhasil diperbarui', success: true });
    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Gagal memperbarui kata sandi' });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;
