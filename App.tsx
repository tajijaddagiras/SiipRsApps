import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TextInput,
    Dimensions,
    Keyboard,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Asset } from 'expo-asset';
import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';

// Prevent auto-hiding before assets are loaded
SplashScreen.preventAutoHideAsync().catch(() => { });

// Modules
import OnboardingScreen from './components/OnboardingScreen';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import LogoutModal from './components/LogoutModal';
import NotificationsScreen from './components/NotificationsScreen';
import ManualInputScreen from './components/ManualInputScreen';
import PatientActionScreen from './components/PatientActionScreen';
import PatientListScreen from './components/PatientListScreen';
import EditProfileScreen from './components/EditProfileScreen';
import SecurityScreen from './components/SecurityScreen';
import ScannerScreen from './components/ScannerScreen';
import PatientRegistrationScreen from './components/PatientRegistrationScreen';
import PatientDetailScreen from './components/PatientDetailScreen';

import { onboardingData } from './constants/data';
import { AuthTab } from './types';
import { BASE_URL } from './constants/config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
    // === STATE MANAGEMENT ===
    const [currentStep, setCurrentStep] = useState(0);
    const [showLogin, setShowLogin] = useState(false);
    const [activeTab, setActiveTab] = useState<AuthTab>('Masuk');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showHome, setShowHome] = useState(false);
    const [activeHomeTab, setActiveHomeTab] = useState('Home');
    const [appIsReady, setAppIsReady] = useState(false);

    // Auth Flow States
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showOTPVerification, setShowOTPVerification] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const [showRegSuccess, setShowRegSuccess] = useState(false);

    // Auth Input States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [authErrorTrigger, setAuthErrorTrigger] = useState(0);
    const [user, setUser] = useState<any>(null);

    // Registration States
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [stats, setStats] = useState<any>({ totalScans: 0, successCount: 0, alertCount: 0 });
    const [activePatient, setActivePatient] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [regNameError, setRegNameError] = useState(false);
    const [regEmailError, setRegEmailError] = useState(false);
    const [regPasswordError, setRegPasswordError] = useState(false);

    const [newPass, setNewPass] = useState('');
    const [confirmNewPass, setConfirmNewPass] = useState('');

    const [otpCode, setOtpCode] = useState('');
    const [otpSelection, setOtpSelection] = useState({ start: 0, end: 0 });
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showManualInput, setShowManualInput] = useState(false);
    const [showPatientAction, setShowPatientAction] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showSecurityAccount, setShowSecurityAccount] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [showPatientRegistration, setShowPatientRegistration] = useState(false);
    const [showPatientList, setShowPatientList] = useState(false);
    const [showPatientDetail, setShowPatientDetail] = useState(false);

    // Refresh Trigger State
    const [patientListUpdateTrigger, setPatientListUpdateTrigger] = useState(0);
    const triggerPatientListUpdate = useCallback(() => {
        setPatientListUpdateTrigger(prev => prev + 1);
        fetchStats();
    }, [user]);
    const [selectedDetailPatient, setSelectedDetailPatient] = useState<any>(null);

    // OTP Context to distinguish between forgot password, update password, and registration
    const [otpContext, setOtpContext] = useState<'forgot' | 'update' | 'register'>('forgot');
    const [otpTimer, setOtpTimer] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);

    // === ANIMATIONS ===
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // OTP Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer(prev => prev - 1);
            }, 1000);
        } else if (otpTimer === 0 && isTimerActive) {
            setIsTimerActive(false);
            setShowOTPVerification(false);
            otpVerificationOpacity.setValue(0);
            setOtpCode('');
            Alert.alert('Waktu Habis', 'Sesi verifikasi telah berakhir. Silakan coba lagi.');
        }
        return () => clearInterval(interval);
    }, [isTimerActive, otpTimer]);
    const loginOpacity = useRef(new Animated.Value(0)).current;
    const homeOpacity = useRef(new Animated.Value(0)).current;
    const forgotPasswordOpacity = useRef(new Animated.Value(0)).current;
    const otpVerificationOpacity = useRef(new Animated.Value(0)).current;
    const resetPasswordOpacity = useRef(new Animated.Value(0)).current;
    const successScreenOpacity = useRef(new Animated.Value(0)).current;
    const regSuccessOpacity = useRef(new Animated.Value(0)).current;

    const logoutModalOpacity = useRef(new Animated.Value(0)).current;
    const notificationsOpacity = useRef(new Animated.Value(0)).current;
    const manualInputOpacity = useRef(new Animated.Value(0)).current;
    const patientActionOpacity = useRef(new Animated.Value(0)).current;
    const editProfileOpacity = useRef(new Animated.Value(0)).current;
    const securityAccountOpacity = useRef(new Animated.Value(0)).current;
    const editPasswordOpacity = useRef(new Animated.Value(0)).current;
    const scannerOpacity = useRef(new Animated.Value(0)).current;
    const patientRegistrationOpacity = useRef(new Animated.Value(0)).current;
    const patientListOpacity = useRef(new Animated.Value(0)).current;
    const patientDetailOpacity = useRef(new Animated.Value(0)).current;
    const appOpacity = useRef(new Animated.Value(0)).current;
    const splashOpacity = useRef(new Animated.Value(1)).current;
    const splashContentOpacity = useRef(new Animated.Value(0)).current;
    const splashLogoScale = useRef(new Animated.Value(0.2)).current;
    const splashTopRightXY = useRef(new Animated.ValueXY({ x: -SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 })).current;
    const splashBottomLeftXY = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH / 2, y: -SCREEN_HEIGHT / 2 })).current;
    const slideAnim = useRef(new Animated.Value(20)).current; // Start slightly lower
    const onboardingScroll = useRef(new Animated.Value(0)).current;
    const dotScroll = useRef(new Animated.Value(0)).current;

    // === PRELOADING ASSETS ===
    useEffect(() => {
        async function prepare() {
            try {
                // Preload local assets
                const images = [
                    require('./assets/images/onboarding_1.png'),
                    require('./assets/images/onboarding_2.jpg'),
                    require('./assets/images/onboarding_3.png'),
                    require('./assets/images/logo.png'),
                    require('./assets/images/logosplash.png'),
                ];

                // Phase 1: Preload local assets
                const cacheImages = images.map(image => Asset.fromModule(image).downloadAsync());

                // Phase 2: Preload remote assets (Avatars)
                const remoteImages = [
                    'https://randomuser.me/api/portraits/men/32.jpg',
                    'https://randomuser.me/api/portraits/women/44.jpg',
                    'https://randomuser.me/api/portraits/women/45.jpg',
                    'https://randomuser.me/api/portraits/men/12.jpg',
                    'https://randomuser.me/api/portraits/women/22.jpg'
                ];

                const cacheRemoteImages = remoteImages.map(url => Image.prefetch(url));

                // Add a safety timeout for web to ensure apps starts even if preloading hangs
                const timeoutPromise = new Promise(resolve => setTimeout(resolve, 3000));

                await Promise.race([
                    Promise.all([...cacheImages, ...cacheRemoteImages]),
                    timeoutPromise
                ]);
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    useEffect(() => {
        if (appIsReady) {
            // 1. Instantly hide the white native splash
            SplashScreen.hideAsync().catch(() => { });

            // 2. Phase 1: Wait 0.1 second (pure blue background)
            const introTimer = setTimeout(() => {
                // Phase 2: Animate elements in (Zoom & Slide)
                Animated.parallel([
                    Animated.timing(splashContentOpacity, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.spring(splashLogoScale, {
                        toValue: 1,
                        friction: 5,
                        tension: 40,
                        useNativeDriver: true,
                    }),
                    Animated.spring(splashTopRightXY, {
                        toValue: { x: 0, y: 0 },
                        friction: 6,
                        tension: 30,
                        useNativeDriver: true,
                    }),
                    Animated.spring(splashBottomLeftXY, {
                        toValue: { x: 0, y: 0 },
                        friction: 6,
                        tension: 30,
                        useNativeDriver: true,
                    })
                ]).start();
            }, 100);

            // 3. Phase 3: Total 4 seconds wait then Transition to Onboarding
            const exitTimer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(appOpacity, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(splashOpacity, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    })
                ]).start();
            }, 4000);

            return () => {
                clearTimeout(introTimer);
                clearTimeout(exitTimer);
            };
        }
    }, [appIsReady]);

    // Refs for OTP
    const inputRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    // === HANDLERS ===
    const handleNext = () => {
        if (currentStep < onboardingData.length - 1) {
            // 1. Start scrolling immediately
            Animated.parallel([
                Animated.timing(onboardingScroll, {
                    toValue: (currentStep + 1) * SCREEN_WIDTH,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(dotScroll, {
                    toValue: (currentStep + 1) * SCREEN_WIDTH,
                    duration: 500,
                    useNativeDriver: false,
                })
            ]).start();

            // 2. Schedule state update for button label
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
            }, 250);
        } else {
            setShowLogin(true);
            Animated.timing(loginOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    };

    const fetchLogs = async () => {
        if (!user?.id) return;
        try {
            const response = await fetch(`${BASE_URL}/logs?userId=${user.id}`);
            const data = await response.json();
            if (response.ok) {
                setLogs(data);
            }
        } catch (error) {
            console.error('Fetch logs error:', error);
        }
    };

    const fetchStats = async () => {
        if (!user?.id) return;
        try {
            const response = await fetch(`${BASE_URL}/users/stats/${user.id}`);
            const data = await response.json();
            if (response.ok) {
                setStats(data);
            }
        } catch (error) {
            console.error('Fetch stats error:', error);
        }
    };

    const fetchUnreadCount = async () => {
        if (!user?.id) return;
        try {
            const response = await fetch(`${BASE_URL}/logs/unread-count/${user.id}`);
            const data = await response.json();
            setUnreadCount(data.count || 0);
        } catch (error) {
            console.error('Fetch unread count error:', error);
        }
    };

    useEffect(() => {
        if (showHome) {
            fetchLogs();
            fetchStats();
            fetchUnreadCount();

            // Setup polling for notifications
            const interval = setInterval(fetchUnreadCount, 30000); // 30s
            return () => clearInterval(interval);
        }
    }, [showHome, user]);

    const handleLogin = async () => {
        // Reset errors
        setEmailError(false);
        setPasswordError(false);

        if (!email || !password) {
            if (!email) setEmailError(true);
            if (!password) setPasswordError(true);
            setAuthErrorTrigger(prev => prev + 1);

            // Auto-reset after 1 second
            setTimeout(() => {
                setEmailError(false);
                setPasswordError(false);
            }, 1000);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                // In a real app, save data.token to SecureStore here
                setShowHome(true);
                Animated.timing(homeOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start(() => {
                    setShowLogin(false);
                    loginOpacity.setValue(0);
                });
            } else {
                setEmailError(true);
                setPasswordError(true);
                setAuthErrorTrigger(prev => prev + 1);

                // Auto-reset after 1 second
                setTimeout(() => {
                    setEmailError(false);
                    setPasswordError(false);
                }, 1000);
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Kesalahan Koneksi', 'Tidak dapat terhubung ke server. Pastikan backend sudah jalan dengan "npm run dev"');
        }
    };

    const handleRegister = async () => {
        // Reset errors
        setRegNameError(false);
        setRegEmailError(false);
        setRegPasswordError(false);

        if (!regEmail || !regPassword || !regName) {
            if (!regName) setRegNameError(true);
            if (!regEmail) setRegEmailError(true);
            if (!regPassword) setRegPasswordError(true);
            setAuthErrorTrigger(prev => prev + 1);

            // Auto-reset after 1 second
            setTimeout(() => {
                setRegNameError(false);
                setRegEmailError(false);
                setRegPasswordError(false);
            }, 1000);
            return;
        }

        // Email Format Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(regEmail)) {
            setRegEmailError(true);
            setAuthErrorTrigger(prev => prev + 1);
            setTimeout(() => setRegEmailError(false), 1000);
            Alert.alert('Email Tidak Valid', 'Format email tidak sesuai.');
            return;
        }

        try {
            setOtpContext('register');
            const response = await fetch(`${BASE_URL}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: regEmail, context: 'REGISTER' }),
            });

            const data = await response.json();

            if (response.ok) {
                setOtpCode(''); setOtpTimer(120); setIsTimerActive(true);
                setOtpSelection({ start: 0, end: 0 });
                setShowOTPVerification(true);
                Animated.timing(otpVerificationOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            } else {
                setRegEmailError(true);
                setAuthErrorTrigger(prev => prev + 1);
                setTimeout(() => setRegEmailError(false), 1000);
                Alert.alert('Email Tidak Terdeteksi', data.message || 'Gagal mengirim kode verifikasi ke email ini.');
            }
        } catch (error) {
            console.error('Registration OTP error:', error);
            Alert.alert('Kesalahan Koneksi', 'Tidak dapat terhubung ke server');
        }
    };

    // Function to perform the actual registration after OTP is verified
    const executeRegister = async () => {
        try {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: regEmail,
                    password: regPassword,
                    name: regName,
                    phone: regPhone
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                // Clear inputs
                setRegName('');
                setRegEmail('');
                setRegPassword('');
                setRegPhone('');

                // Go direct to Home
                setShowHome(true);
                Animated.timing(homeOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start(() => {
                    // Hide BOTH Login/Auth and OTP screens after Home is visible
                    setShowLogin(false);
                    loginOpacity.setValue(0);
                    setShowOTPVerification(false);
                    otpVerificationOpacity.setValue(0);
                });
            } else {
                Alert.alert('Pendaftaran Gagal', data.message || 'Terjadi kesalahan saat mendaftar');
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Kesalahan Koneksi', 'Gagal mendaftarkan akun');
        }
    };

    const handleForgotPassword = (show: boolean) => {
        if (show) {
            setShowForgotPassword(true);
            Animated.parallel([
                Animated.timing(forgotPasswordOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(loginOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => {
                // Keep showLogin as true to prevent Onboarding from showing in background
            });
        } else {
            Animated.parallel([
                Animated.timing(forgotPasswordOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(loginOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setShowForgotPassword(false);
            });
        }
    };

    const handleSendOTP = async () => {
        if (!email && otpContext === 'forgot') {
            Alert.alert('Email Kosong', 'Silakan masukkan email Anda terlebih dahulu.');
            return;
        }

        const targetEmail = otpContext === 'forgot' ? email : user?.email;

        try {
            const response = await fetch(`${BASE_URL}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: targetEmail, context: otpContext === 'forgot' ? 'RESET_PASSWORD' : 'UPDATE_PASSWORD' }),
            });

            const data = await response.json();

            if (response.ok) {
                setOtpCode(''); setOtpTimer(120); setIsTimerActive(true);
                setOtpSelection({ start: 0, end: 0 });
                setShowOTPVerification(true);
                Animated.timing(otpVerificationOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            } else {
                Alert.alert('Gagal', data.message || 'Gagal mengirim kode OTP');
            }
        } catch (error) {
            console.error('Send OTP error:', error);
            Alert.alert('Kesalahan Koneksi', 'Tidak dapat menghubungi server');
        }
    };

    const handleSendOTPUpdate = () => {
        setOtpContext('update');
        handleSendOTP();
    };

    const handleCloseOTP = async () => {
        if (otpContext === 'forgot') {
            // Show Reset Password first (zIndex 5000 > 4000, covers OTP)
            setShowResetPassword(true);
            Animated.timing(resetPasswordOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                // Now hide OTP after Reset Password is shown
                setShowOTPVerification(false);
                otpVerificationOpacity.setValue(0);
            });
        } else if (otpContext === 'register') {
            // New Registration: Complete the signup
            // executeRegister will handle hiding the OTP screen after Home is ready
            executeRegister();
        } else {
            // Update context: SAVE PASSWORD FIRST then Go to success
            try {
                const response = await fetch(`${BASE_URL}/auth/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user?.email, newPassword: newPass }),
                });

                const data = await response.json();

                if (response.ok) {
                    setNewPass('');
                    setConfirmNewPass('');
                    setShowSuccessScreen(true);
                    Animated.timing(successScreenOpacity, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        // Now hide everything behind success to prevent flicker later
                        setShowOTPVerification(false);
                        setShowEditPassword(false);
                        otpVerificationOpacity.setValue(0);
                        editPasswordOpacity.setValue(0);
                    });
                } else {
                    Alert.alert('Gagal', data.message || 'Gagal memperbarui kata sandi');
                }
            } catch (error) {
                console.error('Update password error:', error);
                Alert.alert('Kesalahan Koneksi', 'Tidak dapat menghubungi server');
            }
        }
    };

    const handleCloseResetPassword = () => {
        Animated.timing(resetPasswordOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowResetPassword(false);
        });
    };

    const handleSaveNewPassword = async () => {
        if (!newPass) {
            Alert.alert('Gagal', 'Kata sandi baru tidak boleh kosong');
            return;
        }
        if (newPass.length < 8) {
            Alert.alert('Gagal', 'Kata sandi minimal 8 karakter');
            return;
        }
        if (newPass !== confirmNewPass) {
            Alert.alert('Gagal', 'Konfirmasi kata sandi tidak cocok');
            return;
        }

        try {
            const targetEmail = otpContext === 'forgot' ? email : user?.email;

            const response = await fetch(`${BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: targetEmail, newPassword: newPass }),
            });

            const data = await response.json();

            if (response.ok) {
                setOtpCode('');
                setNewPass('');
                setConfirmNewPass('');

                // Show Success screen first
                setShowSuccessScreen(true);
                Animated.timing(successScreenOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    // ONLY Cleanup background after success is visible to prevent flicker
                    setShowResetPassword(false);
                    setShowOTPVerification(false);
                    setShowForgotPassword(false);
                    setShowEditPassword(false);
                    // setShowLogin(false) removed to prevent onboarding flicker
                    loginOpacity.setValue(0);

                    // Explicitly set these to 0 as safety
                    resetPasswordOpacity.setValue(0);
                    otpVerificationOpacity.setValue(0);
                    forgotPasswordOpacity.setValue(0);
                    editPasswordOpacity.setValue(0);
                });
            } else {
                Alert.alert('Gagal', data.message || 'Gagal menyimpan kata sandi baru');
            }
        } catch (error) {
            console.error('Save new password error:', error);
            Alert.alert('Kesalahan Koneksi', 'Tidak dapat menghubungi server');
        }
    };

    const handleCloseSuccessScreen = () => {
        if (otpContext === 'update') {
            // Close everything to return to Profile
            Animated.parallel([
                Animated.timing(successScreenOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(securityAccountOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(editPasswordOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setShowSuccessScreen(false);
                setShowOTPVerification(false);
                setShowEditPassword(false);
                setShowSecurityAccount(false);
            });
        } else {
            // Forgot Password Flow: Success -> Home
            // 1. Prepare Home (rendered behind Success)
            setShowHome(true);
            homeOpacity.setValue(0);

            // 2. Parallel transition
            Animated.parallel([
                // Fade in Home
                Animated.timing(homeOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                // Fade out Success
                Animated.timing(successScreenOpacity, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                })
            ]).start(() => {
                // 3. Complete cleanup
                setShowSuccessScreen(false);
                setShowLogin(false);
                loginOpacity.setValue(0);

                // Hide all Auth-related states
                setShowOTPVerification(false);
                setShowForgotPassword(false);
                setShowResetPassword(false);
            });
        }
    };

    const handleOpenLogoutModal = () => {
        setShowLogoutModal(true);
        Animated.timing(logoutModalOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseLogoutModal = () => {
        Animated.timing(logoutModalOpacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setShowLogoutModal(false));
    };

    const handleConfirmLogout = () => {
        // 1. Prepare Login Screen (but keep it transparent)
        setShowLogin(true);
        loginOpacity.setValue(0);

        // 2. Perform parallel transition to prevent flickering
        Animated.parallel([
            // Fade out Modal
            Animated.timing(logoutModalOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            // Fade out Home
            Animated.timing(homeOpacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            // Fade in Login
            Animated.timing(loginOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            })
        ]).start(() => {
            // 3. Cleanup after transition
            setShowLogoutModal(false);
            setShowHome(false);
            setActiveHomeTab('Home');
            // Ensure security and other overlays are closed
            setShowSecurityAccount(false);
            setShowEditProfile(false);
            setShowPatientAction(false);
        });
    };

    // Notifications Handlers
    const handleOpenNotifications = () => {
        setShowNotifications(true);
        Animated.timing(notificationsOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseNotifications = () => {
        Animated.timing(notificationsOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setShowNotifications(false));
    };

    // Manual Input Handlers
    const handleOpenManualInput = () => {
        setShowManualInput(true);
        Animated.timing(manualInputOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleOpenPatientList = useCallback(() => {
        // Close other potential overlays
        if (showEditProfile) {
            handleCloseEditProfile();
        }

        setShowPatientList(true);
        Animated.timing(patientListOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [showEditProfile, editProfileOpacity]);

    const handleClosePatientList = useCallback(() => {
        Animated.timing(patientListOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setShowPatientList(false));
    }, []);

    const handleOpenPatientDetail = (patient: any) => {
        setSelectedDetailPatient(patient);
        setShowPatientDetail(true);
        Animated.timing(patientDetailOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleClosePatientDetail = () => {
        Animated.timing(patientDetailOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowPatientDetail(false);
            setSelectedDetailPatient(null);
        });
    };

    const handleCloseManualInput = () => {
        Animated.timing(manualInputOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setShowManualInput(false));
    };

    // Patient Action Handlers
    const handleOpenPatientAction = (patient: any) => {
        setActivePatient(patient);
        setShowManualInput(false);
        setShowScanner(false);

        setShowPatientAction(true);
        Animated.timing(patientActionOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };


    const handleClosePatientAction = () => {
        Animated.timing(patientActionOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setShowPatientAction(false));
    };

    const handleConfirmPatientAction = () => {
        // Refresh logs to show the new action
        fetchLogs();
        fetchStats();
        handleClosePatientAction();
        handleCloseManualInput();
        handleCloseScanner();
        // Switch to Orders tab after closing
        setActiveHomeTab('Orders');
    };

    // Edit Profile Handlers
    const handleOpenEditProfile = () => {
        setShowEditProfile(true);
        Animated.timing(editProfileOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseEditProfile = () => {
        Animated.timing(editProfileOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setShowEditProfile(false));
    };

    const handleUpdateProfile = async (updatedData: any) => {
        if (!user?.id) return;
        try {
            const response = await fetch(`${BASE_URL}/users/profile/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
                Alert.alert('Berhasil', 'Profil berhasil diperbarui');
            } else {
                Alert.alert('Gagal', data.message || 'Gagal memperbarui profil');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            Alert.alert('Kesalahan Koneksi', 'Tidak dapat terhubung ke server');
        }
    };

    // Security Account Handlers
    const handleOpenSecurityAccount = () => {
        setShowSecurityAccount(true);
        Animated.timing(securityAccountOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseSecurityAccount = () => {
        Animated.timing(securityAccountOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setShowSecurityAccount(false));
    };

    const handleOpenEditPassword = () => {
        setShowEditPassword(true);
        Animated.timing(editPasswordOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseEditPassword = () => {
        Animated.timing(editPasswordOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setShowEditPassword(false));
    };

    // Scanner Handlers
    const handleOpenScanner = () => {
        setShowScanner(true);
        Animated.timing(scannerOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseScanner = () => {
        Animated.timing(scannerOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setShowScanner(false));
    };

    const handleConfirmScan = (patient: any) => {
        handleCloseScanner();
        handleOpenPatientAction(patient);
    };

    const handleOpenPatientRegistration = () => {
        setShowPatientRegistration(true);
        Animated.timing(patientRegistrationOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };

    const handleClosePatientRegistration = () => {
        Animated.timing(patientRegistrationOpacity, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
        }).start(() => setShowPatientRegistration(false));
    };

    const handleRegistrationComplete = () => {
        // Show Success Popup over Registration
        setShowRegSuccess(true);
        // Refresh logs to show the new registration
        fetchLogs();
        fetchStats();
        triggerPatientListUpdate(); // Trigger list refresh
        Animated.timing(regSuccessOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            // Wait 2 seconds then close everything
            setTimeout(() => {
                Animated.parallel([
                    Animated.timing(regSuccessOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
                    Animated.timing(patientRegistrationOpacity, { toValue: 0, duration: 400, useNativeDriver: true })
                ]).start(() => {
                    setShowRegSuccess(false);
                    setShowPatientRegistration(false);
                });
            }, 2000);
        });
    };

    const handleOtpChange = async (text: string) => {
        const cleanText = text.replace(/[^0-9]/g, '').slice(0, 6);
        setOtpCode(cleanText);

        if (cleanText.length === 6) {
            Keyboard.dismiss();

            // Auto-verify when 6 digits are entered
            const targetEmail = otpContext === 'register' ? regEmail : (otpContext === 'forgot' ? email : user?.email);

            if (!targetEmail) {
                Alert.alert('Error', 'Email tidak ditemukan untuk verifikasi');
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: targetEmail, code: cleanText }),
                });

                const data = await response.json();

                if (response.ok) {
                    setIsTimerActive(false);
                    handleCloseOTP();
                } else {
                    Alert.alert('Verifikasi Gagal', data.message || 'Kode OTP salah');
                    setOtpCode(''); // Clear code so user can retry
                }
            } catch (error) {
                console.error('Verify OTP error:', error);
                Alert.alert('Kesalahan Koneksi', 'Gagal memverifikasi kode');
            }
        }
    };

    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#4285F4' }}>
                <Animated.View style={[styles.container, { opacity: appOpacity }]}>
                    <StatusBar style="light" translucent backgroundColor="transparent" />

                    {/* 1. Onboarding Screen */}
                    {!showLogin && !showHome && (
                        <OnboardingScreen
                            data={onboardingData}
                            currentStep={currentStep}
                            fadeAnim={fadeAnim}
                            onboardingScroll={onboardingScroll}
                            dotScroll={dotScroll}
                            onNext={handleNext}
                        />
                    )}

                    {/* 3. Home Screen Overlay */}
                    {showHome && (
                        <Animated.View
                            renderToHardwareTextureAndroid={true}
                            style={[
                                StyleSheet.absoluteFillObject,
                                {
                                    opacity: homeOpacity,
                                    zIndex: 10,
                                    pointerEvents: 'auto'
                                }
                            ]}
                        >
                            <HomeScreen
                                showHome={showHome}
                                homeOpacity={homeOpacity}
                                activeTab={activeHomeTab}
                                setActiveTab={setActiveHomeTab}
                                onOpenNotifications={handleOpenNotifications}
                                onOpenScanner={handleOpenScanner}
                                onOpenManualInput={handleOpenManualInput}
                                onOpenSearch={() => { }}
                                onOpenCheckBloodSugar={() => { }}
                                onOpenFoodInput={() => { }}
                                onOpenAnalysis={() => { }}
                                onOpenChat={() => { }}
                                onOpenInsightDetail={() => { }}
                                onOpenFoodDetail={() => { }}
                                onJoinCommunity={() => { }}
                                // Cart Props
                                cartCount={0}
                                onOpenCart={() => { }}
                                onOpenEditProfile={handleOpenEditProfile}
                                onMealActivity={() => { }}
                                onOpenAddAddress={() => { }}
                                onOpenSecurityAccount={handleOpenSecurityAccount}
                                onLogout={handleOpenLogoutModal}
                                onOpenPremium={() => { }}
                                onPatientList={handleOpenPatientList}
                                onDetailPatientPress={handleOpenPatientDetail}
                                onOpenPatientRegistration={handleOpenPatientRegistration}
                                logs={logs}
                                user={user}
                                stats={stats}
                                unreadCount={unreadCount}
                                totalPatients={stats?.totalPatients}
                            />
                        </Animated.View>
                    )}

                    {showNotifications && (
                        <NotificationsScreen
                            showNotifications={showNotifications}
                            notificationsOpacity={notificationsOpacity}
                            onClose={handleCloseNotifications}
                            logs={logs}
                            onMarkAsRead={() => {
                                fetchUnreadCount();
                                fetchLogs();
                            }}
                            userId={user?.id || ''}
                        />
                    )}

                    {showManualInput && (
                        <ManualInputScreen
                            showManualInput={showManualInput}
                            manualInputOpacity={manualInputOpacity}
                            onClose={handleCloseManualInput}
                            onSearch={handleOpenPatientAction}
                        />
                    )}

                    {showPatientAction && (
                        <PatientActionScreen
                            showPatientAction={showPatientAction}
                            patientActionOpacity={patientActionOpacity}
                            onClose={handleClosePatientAction}
                            onConfirm={handleConfirmPatientAction}
                            patientData={activePatient}
                            userId={user?.id}
                        />
                    )}

                    {showEditProfile && (
                        <EditProfileScreen
                            visible={showEditProfile}
                            animation={editProfileOpacity}
                            onClose={handleCloseEditProfile}
                            user={user}
                            onSave={handleUpdateProfile}
                        />
                    )}

                    {showSecurityAccount && (
                        <SecurityScreen
                            visible={showSecurityAccount}
                            animation={securityAccountOpacity}
                            onClose={handleCloseSecurityAccount}
                            onEditPassword={handleOpenEditPassword}
                            user={user}
                        />
                    )}

                    {showScanner && (
                        <ScannerScreen
                            showScanner={showScanner}
                            scannerOpacity={scannerOpacity}
                            onClose={handleCloseScanner}
                            onCapture={handleConfirmScan}
                        />
                    )}

                    {showPatientRegistration && (
                        <PatientRegistrationScreen
                            show={showPatientRegistration}
                            animation={patientRegistrationOpacity}
                            onClose={handleClosePatientRegistration}
                            onComplete={handleRegistrationComplete}
                            userId={user?.id}
                        />
                    )}

                    {/* Registration Success Popup */}
                    {showRegSuccess && (
                        <Animated.View
                            style={{
                                ...StyleSheet.absoluteFillObject,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                zIndex: 3000,
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: regSuccessOpacity
                            }}
                        >
                            <View style={{
                                width: SCREEN_WIDTH - 80,
                                backgroundColor: '#fff',
                                borderRadius: 24,
                                padding: 30,
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: 0.2,
                                shadowRadius: 20,
                                elevation: 10,
                            }}>
                                <View style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    backgroundColor: '#DCFCE7',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 20
                                }}>
                                    <Ionicons name="checkmark-circle" size={50} color="#22C55E" />
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: '900', color: '#1E293B', textAlign: 'center', marginBottom: 8 }}>Pendaftaran Berhasil!</Text>
                                <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center' }}>Kartu Pasien Telah Berhasil Diunduh!</Text>
                            </View>
                        </Animated.View>
                    )}

                    <LogoutModal
                        isVisible={showLogoutModal}
                        opacity={logoutModalOpacity}
                        onClose={handleCloseLogoutModal}
                        onConfirm={handleConfirmLogout}
                    />

                    {/* 5. Edit Password Screen */}
                    {showEditPassword && (
                        <Animated.View
                            style={[
                                StyleSheet.absoluteFillObject,
                                {
                                    backgroundColor: '#fff',
                                    zIndex: 500,
                                    opacity: editPasswordOpacity,
                                }
                            ]}
                        >
                            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom'] as any}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    paddingVertical: 16,
                                }}>
                                    <TouchableOpacity
                                        style={{
                                            width: 40,
                                            height: 40,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 12,
                                            borderWidth: 1,
                                            borderColor: '#E2E8F0',
                                        }}
                                        onPress={handleCloseEditPassword}
                                    >
                                        <Ionicons name="arrow-back" size={24} color="#1E293B" />
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1E293B' }}>Edit Kata Sandi</Text>
                                    <View style={{ width: 40 }} />
                                </View>

                                <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20 }}>
                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600', marginBottom: 8 }}>Email</Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            height: 52,
                                            borderWidth: 1,
                                            borderColor: '#E2E8F0',
                                            borderRadius: 12,
                                            paddingHorizontal: 16,
                                            backgroundColor: '#F8FAFC',
                                        }}>
                                            <Ionicons name="person-outline" size={20} color="#94A3B8" style={{ marginRight: 12 }} />
                                            <Text style={{ fontSize: 14, color: '#1E293B', fontWeight: '600' }}>{user?.email || 'email@example.com'}</Text>
                                        </View>
                                    </View>

                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600', marginBottom: 8 }}>Kata Sandi Baru</Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            height: 52,
                                            borderWidth: 1,
                                            borderColor: '#E2E8F0',
                                            borderRadius: 12,
                                            paddingHorizontal: 16,
                                        }}>
                                            <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={{ marginRight: 12 }} />
                                            <TextInput
                                                style={{ flex: 1, fontSize: 14, color: '#1E293B', fontWeight: '600' }}
                                                placeholder="Masukkan kata sandi baru"
                                                placeholderTextColor="#94A3B8"
                                                secureTextEntry={!showPassword}
                                                value={newPass}
                                                onChangeText={setNewPass}
                                            />
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                <Ionicons
                                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                                    size={20}
                                                    color="#94A3B8"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 6 }}>Panjangnya minimal 8 karakter!</Text>
                                    </View>

                                    <View style={{ marginBottom: 20 }}>
                                        <Text style={{ fontSize: 14, color: '#64748B', fontWeight: '600', marginBottom: 8 }}>Konfirmasi Kata Sandi Baru</Text>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            height: 52,
                                            borderWidth: 1,
                                            borderColor: '#E2E8F0',
                                            borderRadius: 12,
                                            paddingHorizontal: 16,
                                        }}>
                                            <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={{ marginRight: 12 }} />
                                            <TextInput
                                                style={{ flex: 1, fontSize: 14, color: '#1E293B', fontWeight: '600' }}
                                                placeholder="Konfirmasi kata sandi baru"
                                                placeholderTextColor="#94A3B8"
                                                secureTextEntry={!showPassword}
                                                value={confirmNewPass}
                                                onChangeText={setConfirmNewPass}
                                            />
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                <Ionicons
                                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                                    size={20}
                                                    color="#94A3B8"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 6 }}>Harus sama dengan kata sandi baru!</Text>
                                    </View>
                                </ScrollView>

                                <View style={{ padding: 24 }}>
                                    <TouchableOpacity
                                        style={{
                                            height: 52,
                                            backgroundColor: '#4285F4',
                                            borderRadius: 16,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onPress={handleSaveNewPassword}
                                    >
                                        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Simpan Kata Sandi</Text>
                                    </TouchableOpacity>
                                </View>
                            </SafeAreaView>
                        </Animated.View>
                    )}



                    {showPatientList && (
                        <Animated.View
                            style={[
                                StyleSheet.absoluteFillObject,
                                {
                                    zIndex: 100, // Higher than bottom sheets
                                    opacity: patientListOpacity,
                                    // Removed translateY for simple fade-in effect to match standard overlays
                                }
                            ]}
                        >
                            <PatientListScreen
                                onBack={handleClosePatientList}
                                onPatientPress={handleOpenPatientDetail}
                                userId={user?.id}
                                updateTrigger={patientListUpdateTrigger}
                            />
                        </Animated.View>
                    )}

                    {showPatientDetail && (
                        <Animated.View
                            style={[
                                StyleSheet.absoluteFillObject,
                                {
                                    zIndex: 100,
                                    opacity: patientDetailOpacity,
                                }
                            ]}
                        >
                            <PatientDetailScreen
                                visible={showPatientDetail}
                                animation={patientDetailOpacity}
                                onClose={handleClosePatientDetail}
                                patient={selectedDetailPatient}
                                userId={user?.id}
                                onUpdateSuccess={triggerPatientListUpdate}
                            />
                        </Animated.View>
                    )}

                    {/* 6. Authentication Overlay (Placed here for highest Z-Index) */}
                    {(showLogin || showForgotPassword || showOTPVerification || showResetPassword || showSuccessScreen) && (
                        <AuthScreen
                            showLogin={showLogin}
                            loginOpacity={loginOpacity}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            rememberMe={rememberMe}
                            setRememberMe={setRememberMe}
                            email={email}
                            setEmail={(text) => {
                                setEmail(text);
                                if (emailError) setEmailError(false);
                            }}
                            password={password}
                            setPassword={(text) => {
                                setPassword(text);
                                if (passwordError) setPasswordError(false);
                            }}
                            handleLogin={handleLogin}
                            // Registration
                            regName={regName}
                            setRegName={setRegName}
                            regEmail={regEmail}
                            setRegEmail={setRegEmail}
                            regPhone={regPhone}
                            setRegPhone={setRegPhone}
                            regPassword={regPassword}
                            setRegPassword={setRegPassword}
                            handleRegister={handleRegister}
                            emailError={emailError}
                            passwordError={passwordError}
                            shakeTrigger={authErrorTrigger}
                            otpTimer={otpTimer}
                            // Forgot / OTP / Reset
                            showForgotPassword={showForgotPassword}
                            forgotPasswordOpacity={forgotPasswordOpacity}
                            handleForgotPassword={handleForgotPassword}
                            handleSendOTP={handleSendOTP}
                            showOTPVerification={showOTPVerification}
                            otpVerificationOpacity={otpVerificationOpacity}
                            handleCloseOTP={handleCloseOTP}
                            otpCode={otpCode}
                            otpSelection={otpSelection}
                            setOtpSelection={setOtpSelection}
                            inputRefs={inputRefs as any}
                            handleOtpChange={handleOtpChange}
                            showResetPassword={showResetPassword}
                            resetPasswordOpacity={resetPasswordOpacity}
                            handleCloseResetPassword={handleCloseResetPassword}
                            handleSaveNewPassword={handleSaveNewPassword}
                            showSuccessScreen={showSuccessScreen}
                            successScreenOpacity={successScreenOpacity}
                            handleCloseSuccessScreen={handleCloseSuccessScreen}
                            isProfileFlow={otpContext === 'update'}
                            // Sinkronisasi state kata sandi baru
                            newPass={newPass}
                            setNewPass={setNewPass}
                            confirmNewPass={confirmNewPass}
                            setConfirmNewPass={setConfirmNewPass}
                        />
                    )}
                </Animated.View>

                {/* Custom Pseudo Splash Overlay (Premium Design with Animations) */}
                <Animated.View
                    pointerEvents="none"
                    style={[
                        StyleSheet.absoluteFillObject,
                        {
                            backgroundColor: '#4285F4',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 9999,
                            opacity: splashOpacity,
                            overflow: 'hidden',
                        }
                    ]}
                >
                    <Animated.View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', opacity: splashContentOpacity }}>
                        {/* Decorative Background Circles (Slide-in) - Ring Profile for Exact Match */}

                        {/* Top Right Group - Single Ring Match */}
                        <Animated.View
                            style={{
                                position: 'absolute',
                                top: -200,
                                right: -200,
                                transform: [{ translateX: splashTopRightXY.x }, { translateY: splashTopRightXY.y }],
                            }}
                        >
                            {/* Single Outer Ring */}
                            <View
                                style={{
                                    width: 400,
                                    height: 400,
                                    borderRadius: 200,
                                    borderWidth: 45,
                                    borderColor: 'rgba(255,255,255,0.06)',
                                }}
                            />
                        </Animated.View>

                        {/* Bottom Left Group - Single Ring Match */}
                        <Animated.View
                            style={{
                                position: 'absolute',
                                bottom: -175,
                                left: -175,
                                transform: [{ translateX: splashBottomLeftXY.x }, { translateY: splashBottomLeftXY.y }],
                            }}
                        >
                            {/* Single Outer Ring */}
                            <View
                                style={{
                                    width: 350,
                                    height: 350,
                                    borderRadius: 175,
                                    borderWidth: 40,
                                    borderColor: 'rgba(255,255,255,0.06)',
                                }}
                            />
                        </Animated.View>

                        {/* Center Decorative Circle (Zoom-in) - Simplified but exact */}
                        <Animated.View
                            style={{
                                position: 'absolute',
                                width: 240,
                                height: 240,
                                borderRadius: 120,
                                backgroundColor: 'rgba(255,255,255,0.02)',
                                transform: [{ scale: splashLogoScale }]
                            }}
                        />

                        {/* Logo Animation (Zoom-in) */}
                        <Animated.View style={{ transform: [{ scale: splashLogoScale }], alignItems: 'center' }}>
                            <Image
                                source={require('./assets/images/logo.png')}
                                style={{ width: 140, height: 140, marginBottom: 20 }}
                                contentFit="contain"
                            />
                            <Text style={{ fontSize: 38, fontWeight: '900', color: '#fff', letterSpacing: 2 }}>SIIP-RS</Text>
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
