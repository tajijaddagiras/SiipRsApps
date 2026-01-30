import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Animated,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    useWindowDimensions
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthTab } from '../types';
import { Colors } from '../styles/theme';

interface AuthScreenProps {
    loginOpacity: Animated.Value;
    showLogin: boolean;
    activeTab: AuthTab;
    setActiveTab: (tab: AuthTab) => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    rememberMe: boolean;
    setRememberMe: (val: boolean) => void;
    email: string;
    setEmail: (text: string) => void;
    password: string;
    setPassword: (text: string) => void;
    handleLogin: () => void;
    // Forgot Password / OTP / Reset State
    forgotPasswordOpacity: Animated.Value;
    showForgotPassword: boolean;
    handleForgotPassword: (show: boolean) => void;
    handleSendOTP: () => void;
    otpVerificationOpacity: Animated.Value;
    showOTPVerification: boolean;
    handleCloseOTP: () => void;
    otpCode: string;
    otpSelection: { start: number, end: number };
    setOtpSelection: (sel: { start: number, end: number }) => void;
    inputRefs: React.RefObject<TextInput>[];
    handleOtpChange: (text: string) => void;
    resetPasswordOpacity: Animated.Value;
    showResetPassword: boolean;
    handleCloseResetPassword: () => void;
    handleSaveNewPassword: () => void;
    successScreenOpacity: Animated.Value;
    showSuccessScreen: boolean;
    handleCloseSuccessScreen: () => void;
    isProfileFlow?: boolean;
    // New Props for State Sync
    newPass: string;
    setNewPass: (val: string) => void;
    confirmNewPass: string;
    setConfirmNewPass: (val: string) => void;
    // Shake & Error Props
    emailError?: boolean;
    passwordError?: boolean;
    shakeTrigger?: number;
    // Registration Props
    regName: string;
    setRegName: (val: string) => void;
    regEmail: string;
    setRegEmail: (val: string) => void;
    regPhone: string;
    setRegPhone: (val: string) => void;
    regPassword: string;
    setRegPassword: (val: string) => void;
    handleRegister: () => void;
    regNameError?: boolean;
    regEmailError?: boolean;
    regPasswordError?: boolean;
    otpTimer?: number;
}

const AuthScreen: React.FC<AuthScreenProps> = (props: AuthScreenProps) => {
    const {
        loginOpacity, showLogin, activeTab, setActiveTab,
        showPassword, setShowPassword, rememberMe, setRememberMe,
        email, setEmail, password, setPassword,
        handleLogin, forgotPasswordOpacity, showForgotPassword,
        handleForgotPassword, handleSendOTP, otpVerificationOpacity,
        showOTPVerification, handleCloseOTP, otpCode, otpSelection, setOtpSelection,
        inputRefs, handleOtpChange, resetPasswordOpacity,
        showResetPassword, handleCloseResetPassword, handleSaveNewPassword,
        successScreenOpacity, showSuccessScreen, handleCloseSuccessScreen,
        isProfileFlow,
        newPass, setNewPass, confirmNewPass, setConfirmNewPass,
        emailError, passwordError, shakeTrigger,
        regName, setRegName, regEmail, setRegEmail,
        regPhone, setRegPhone, regPassword, setRegPassword,
        handleRegister,
        regNameError, regEmailError, regPasswordError,
        otpTimer
    } = props;

    const { width, height } = useWindowDimensions();
    const isDesktop = width > 768;

    const shakeAnim = React.useRef(new Animated.Value(0)).current;

    const shake = () => {
        shakeAnim.setValue(0);
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    React.useEffect(() => {
        if (shakeTrigger && shakeTrigger > 0) {
            shake();
        }
    }, [shakeTrigger]);

    const [forgotEmail, setForgotEmail] = React.useState('');
    const [focusedField, setFocusedField] = React.useState<string | null>(null);

    // Auto-focus the hidden input only when the OTP screen is shown
    React.useEffect(() => {
        if (showOTPVerification) {
            // Small delay to ensure the screen is starting to animate in
            const timer = setTimeout(() => {
                inputRefs[0].current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [showOTPVerification]);

    return (
        <>
            {/* === LOGIN SCREEN === */}
            <Animated.View
                renderToHardwareTextureAndroid={true}
                style={[
                    styles.loginOverlay,
                    {
                        opacity: loginOpacity,
                        zIndex: showLogin ? 20 : -1,
                        pointerEvents: showLogin ? 'auto' : 'none'
                    }
                ]}
            >
                <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right'] as any}>
                    <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}>
                        {isDesktop && (
                            <View style={styles.desktopLeftPanel}>
                                <View style={styles.desktopBranding}>
                                    <Image
                                        source={require('../assets/images/logo.png')}
                                        style={styles.desktopLogo}
                                        contentFit="contain"
                                    />
                                    <Text style={styles.desktopBrandName}>SIIP-RS</Text>
                                    <Text style={styles.desktopBrandTagline}>Sistem Informasi Identitas Pasien{'\n'}Rumah Sakit Terintegrasi</Text>
                                </View>
                                <View style={styles.desktopDecorCircle} />
                            </View>
                        )}
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={{ flex: 1 }}
                        >
                            <ScrollView
                                contentContainerStyle={[
                                    styles.scrollContent,
                                    isDesktop && {
                                        flex: 1,
                                        justifyContent: 'center',
                                        maxWidth: 600,
                                        alignSelf: 'center',
                                        width: '100%',
                                        paddingHorizontal: 60
                                    }
                                ]}
                                showsVerticalScrollIndicator={false}
                            >
                                {!isDesktop && (
                                    <View style={styles.logoContainer}>
                                        <Image
                                            source={require('../assets/images/logo.png')}
                                            style={styles.logo}
                                            contentFit="contain"
                                        />
                                        <Text style={styles.logoText}>SIIP-RS</Text>
                                    </View>
                                )}

                                <Text style={styles.loginTitle}>Mulailah sekarang</Text>
                                <Text style={styles.loginSubtitle}>
                                    Buat akun atau masuk untuk{'\n'}menjelajahi aplikasi kami
                                </Text>

                                <View style={styles.tabContainer}>
                                    <TouchableOpacity
                                        style={[styles.tab, activeTab === 'Masuk' && styles.activeTab]}
                                        onPress={() => setActiveTab('Masuk')}
                                    >
                                        <Text style={[styles.tabText, activeTab === 'Masuk' && styles.tabTextActive]}>Masuk</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.tab, activeTab === 'Daftar' && styles.activeTab]}
                                        onPress={() => setActiveTab('Daftar')}
                                    >
                                        <Text style={[styles.tabText, activeTab === 'Daftar' && styles.tabTextActive]}>Daftar</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* === FORM INPUTS === */}
                                {activeTab === 'Masuk' ? (
                                    <>
                                        <Animated.View style={[
                                            styles.inputContainer,
                                            { transform: [{ translateX: shakeAnim }] }
                                        ]}>
                                            <Text style={styles.inputLabel}>Email</Text>
                                            <TextInput
                                                style={[styles.input, emailError && styles.inputError]}
                                                placeholder={focusedField === 'loginEmail' ? '' : 'Masukkan email'}
                                                placeholderTextColor="#A0A0A0"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                value={email}
                                                onChangeText={setEmail}
                                                onFocus={() => {
                                                    setFocusedField('loginEmail');
                                                }}
                                                onBlur={() => setFocusedField(null)}
                                            />
                                        </Animated.View>

                                        <Animated.View style={[
                                            styles.inputContainer,
                                            { transform: [{ translateX: shakeAnim }] }
                                        ]}>
                                            <Text style={styles.inputLabel}>Kata Sandi</Text>
                                            <View style={[styles.passwordContainer, passwordError && styles.inputError]}>
                                                <TextInput
                                                    style={styles.passwordInput}
                                                    placeholder={focusedField === 'loginPassword' ? '' : '**********'}
                                                    placeholderTextColor="#A0A0A0"
                                                    secureTextEntry={!showPassword}
                                                    value={password}
                                                    onChangeText={setPassword}
                                                    onFocus={() => {
                                                        setFocusedField('loginPassword');
                                                    }}
                                                    onBlur={() => setFocusedField(null)}
                                                />
                                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#A0A0A0" />
                                                </TouchableOpacity>
                                            </View>
                                        </Animated.View>

                                        <View style={styles.optionsRow}>
                                            <TouchableOpacity
                                                style={styles.checkboxContainer}
                                                onPress={() => setRememberMe(!rememberMe)}
                                            >
                                                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                                    {rememberMe && <Ionicons name="checkmark" size={12} color="#fff" />}
                                                </View>
                                                <Text style={styles.checkboxLabel}>Ingat saya</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleForgotPassword(true)}>
                                                <Text style={styles.forgotPassword}>Lupa Kata Sandi?</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>Nama Lengkap</Text>
                                            <View style={[styles.iconInputContainer, regNameError && styles.inputError]}>
                                                <Ionicons name="person-outline" size={20} color={regNameError ? '#EF4444' : '#A0A0A0'} style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.iconInput}
                                                    placeholder={focusedField === 'regName' ? '' : 'Nama Lengkap'}
                                                    placeholderTextColor="#A0A0A0"
                                                    autoCapitalize="words"
                                                    value={regName}
                                                    onChangeText={setRegName}
                                                    onFocus={() => {
                                                        setFocusedField('regName');
                                                    }}
                                                    onBlur={() => setFocusedField(null)}
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>Email</Text>
                                            <View style={[styles.iconInputContainer, regEmailError && styles.inputError]}>
                                                <Ionicons name="mail-outline" size={20} color={regEmailError ? '#EF4444' : '#A0A0A0'} style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.iconInput}
                                                    placeholder={focusedField === 'regEmail' ? '' : 'Masukkan email'}
                                                    placeholderTextColor="#A0A0A0"
                                                    keyboardType="email-address"
                                                    autoCapitalize="none"
                                                    value={regEmail}
                                                    onChangeText={setRegEmail}
                                                    onFocus={() => {
                                                        setFocusedField('regEmail');
                                                    }}
                                                    onBlur={() => setFocusedField(null)}
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>Nomor Telepon</Text>
                                            <View style={styles.phoneContainer}>
                                                <View style={styles.flagContainer}>
                                                    <View style={styles.flagIconCircle}>
                                                        <View style={{ width: 24, height: 12, backgroundColor: '#FF0000', position: 'absolute', top: 0 }} />
                                                        <View style={{ width: 24, height: 12, backgroundColor: '#FFFFFF', position: 'absolute', bottom: 0 }} />
                                                    </View>
                                                    <Ionicons name="chevron-down" size={12} color="#666" style={{ marginLeft: 4 }} />
                                                </View>
                                                <Text style={{ fontSize: 16, color: '#000', marginLeft: 8, marginRight: 2 }}>(+62)</Text>
                                                <TextInput
                                                    style={styles.phoneInput}
                                                    placeholder={focusedField === 'regPhone' ? '' : '8123456789'}
                                                    placeholderTextColor="#A0A0A0"
                                                    keyboardType="phone-pad"
                                                    value={regPhone}
                                                    onChangeText={setRegPhone}
                                                    onFocus={() => {
                                                        setFocusedField('regPhone');
                                                    }}
                                                    onBlur={() => setFocusedField(null)}
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <Text style={styles.inputLabel}>Kata Sandi</Text>
                                            <View style={[styles.iconInputContainer, regPasswordError && styles.inputError]}>
                                                <Ionicons name="lock-closed-outline" size={20} color={regPasswordError ? '#EF4444' : '#A0A0A0'} style={styles.inputIcon} />
                                                <TextInput
                                                    style={styles.iconInput}
                                                    placeholder={focusedField === 'regPassword' ? '' : '**********'}
                                                    placeholderTextColor="#A0A0A0"
                                                    secureTextEntry={!showPassword}
                                                    value={regPassword}
                                                    onChangeText={setRegPassword}
                                                    onFocus={() => {
                                                        setFocusedField('regPassword');
                                                    }}
                                                    onBlur={() => setFocusedField(null)}
                                                />
                                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={regPasswordError ? '#EF4444' : '#A0A0A0'} />
                                                </TouchableOpacity>
                                            </View>
                                            <Text style={styles.helperText}>Panjangnya minimal 8 karakter!</Text>
                                        </View>
                                    </>
                                )}

                                <TouchableOpacity
                                    style={styles.loginButton}
                                    activeOpacity={0.8}
                                    onPress={activeTab === 'Masuk' ? handleLogin : handleRegister}
                                >
                                    <Text style={styles.loginButtonText}>
                                        {activeTab === 'Masuk' ? 'Masuk' : 'Daftar'}
                                    </Text>
                                </TouchableOpacity>

                                {activeTab === 'Masuk' && (
                                    <>
                                        <View style={styles.dividerContainer}>
                                            <View style={styles.dividerLine} />
                                            <Text style={styles.dividerText}>Atau masuk dengan</Text>
                                            <View style={styles.dividerLine} />
                                        </View>

                                        <View style={styles.socialRow}>
                                            <TouchableOpacity style={styles.socialButton}>
                                                <Image
                                                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png' }}
                                                    style={{ width: 24, height: 24 }}
                                                    contentFit="contain"
                                                />
                                                <Text style={styles.socialButtonText}>Google</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.socialButton}>
                                                <Ionicons name="logo-apple" size={24} color="#000" />
                                                <Text style={styles.socialButtonText}>Apple</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                )}
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </SafeAreaView>
            </Animated.View>

            {/* === FORGOT PASSWORD SCREEN === */}
            <Animated.View
                style={[
                    styles.loginOverlay,
                    {
                        opacity: forgotPasswordOpacity,
                        zIndex: showForgotPassword ? 3000 : -1,
                        pointerEvents: showForgotPassword ? 'auto' : 'none'
                    }
                ]}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}>
                        {isDesktop && (
                            <View style={styles.desktopLeftPanel}>
                                <View style={styles.desktopBranding}>
                                    <View style={styles.desktopIconBg}>
                                        <Ionicons name="lock-open" size={60} color="#fff" />
                                    </View>
                                    <Text style={styles.desktopBrandName}>Pemulihan</Text>
                                    <Text style={styles.desktopBrandTagline}>Amankan kembali akun Anda{'\n'}dengan langkah mudah</Text>
                                </View>
                                <View style={styles.desktopDecorCircle} />
                            </View>
                        )}
                        <View style={{ flex: 1, justifyContent: isDesktop ? 'center' : 'flex-start' }}>
                            <View style={[styles.header, isDesktop && { borderBottomWidth: 0, paddingHorizontal: 40 }]}>
                                <TouchableOpacity onPress={() => handleForgotPassword(false)} style={styles.backButton}>
                                    <Ionicons name="arrow-back" size={24} color="#000" />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>Lupa Kata Sandi Anda</Text>
                                <View style={{ width: 40, marginLeft: 16 }} />
                            </View>

                            <View style={[
                                styles.forgotPasswordContent,
                                isDesktop && {
                                    maxWidth: 500,
                                    alignSelf: 'center',
                                    width: '100%',
                                    paddingHorizontal: 40
                                }
                            ]}>
                                <Text style={[styles.forgotPasswordDesc, isDesktop && { textAlign: 'left', fontSize: 16 }]}>
                                    Kami siap membantu Anda, Masukkan email terdaftar Anda untuk mengatur ulang kata sandi Anda, Kami akan mengirimkan kode OTP ke email Anda untuk langkah selanjutnya
                                </Text>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Email</Text>
                                    <View style={styles.iconInputContainer}>
                                        <Ionicons name="person-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.iconInput}
                                            placeholder="Masukkan email"
                                            placeholderTextColor="#A0A0A0"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            value={forgotEmail}
                                            onChangeText={setForgotEmail}
                                            onFocus={() => {
                                                setFocusedField('forgotEmail');
                                            }}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                    </View>
                                </View>
                                {!isDesktop && <View style={{ flex: 1 }} />}
                                <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleSendOTP}>
                                    <Text style={styles.loginButtonText}>Kirim Kode OTP</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Animated.View>

            {/* === OTP SCREEN === */}
            <Animated.View
                style={[
                    styles.loginOverlay,
                    {
                        opacity: otpVerificationOpacity,
                        zIndex: showOTPVerification ? 4000 : -1,
                        pointerEvents: showOTPVerification ? 'auto' : 'none'
                    }
                ]}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}>
                        {isDesktop && (
                            <View style={styles.desktopLeftPanel}>
                                <View style={styles.desktopBranding}>
                                    <View style={styles.desktopIconBg}>
                                        <Ionicons name="chatbubble-ellipses" size={60} color="#fff" />
                                    </View>
                                    <Text style={styles.desktopBrandName}>Verifikasi</Text>
                                    <Text style={styles.desktopBrandTagline}>Masukkan kode yang kami kirim{'\n'}untuk memverifikasi identitas Anda</Text>
                                </View>
                                <View style={styles.desktopDecorCircle} />
                            </View>
                        )}
                        <View style={{ flex: 1, justifyContent: isDesktop ? 'center' : 'flex-start' }}>
                            <View style={[styles.header, isDesktop && { borderBottomWidth: 0, paddingHorizontal: 40 }]}>
                                <TouchableOpacity onPress={handleCloseOTP} style={styles.backButton}>
                                    <Ionicons name="arrow-back" size={24} color="#000" />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>Masukkan Kode OTP</Text>
                                <View style={{ width: 40, marginLeft: 16 }} />
                            </View>

                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View style={[
                                    styles.forgotPasswordContent,
                                    isDesktop && {
                                        maxWidth: 500,
                                        alignSelf: 'center',
                                        width: '100%',
                                        paddingHorizontal: 40
                                    }
                                ]}>
                                    <Text style={[styles.forgotPasswordDesc, isDesktop && { textAlign: 'left', fontSize: 16 }]}>
                                        Silakan periksa kotak masuk email Anda untuk melihat pesan dari Smartify. Masukkan kode verifikasi sekali pakai di bawah ini.
                                    </Text>

                                    <View style={styles.otpContainer}>
                                        {/* Hidden Main Input */}
                                        <TextInput
                                            ref={inputRefs[0] as any}
                                            style={styles.hiddenInput}
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            value={otpCode}
                                            onChangeText={handleOtpChange}
                                            selection={otpSelection}
                                            onSelectionChange={(e) => setOtpSelection(e.nativeEvent.selection)}
                                        />

                                        {/* 6 Visual Boxes */}
                                        {[0, 1, 2, 3, 4, 5].map((index) => {
                                            const isFocused = otpSelection.start === index;
                                            const char = otpCode[index] || '';
                                            return (
                                                <TouchableOpacity
                                                    key={index}
                                                    activeOpacity={0.7}
                                                    onPress={() => {
                                                        setOtpSelection({ start: index, end: index });
                                                        inputRefs[0].current?.focus();
                                                    }}
                                                    style={[
                                                        styles.otpBox,
                                                        isFocused && styles.otpBoxFocused,
                                                        char !== '' && styles.otpBoxFilled
                                                    ]}
                                                >
                                                    <Text style={styles.otpText}>{char}</Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>

                                    <Text style={styles.timerText}>
                                        Waktu tersisa: <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>{Math.floor((otpTimer || 0) / 60)}:{(otpTimer || 0) % 60 < 10 ? `0${(otpTimer || 0) % 60}` : (otpTimer || 0) % 60}</Text>
                                    </Text>

                                    <TouchableOpacity>
                                        <Text style={styles.resendLink}>Kirim ulang kode</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </SafeAreaView>
            </Animated.View>

            {/* === RESET PASSWORD SCREEN === */}
            <Animated.View
                style={[
                    styles.loginOverlay,
                    {
                        opacity: resetPasswordOpacity,
                        zIndex: showResetPassword ? 5000 : -1,
                        pointerEvents: showResetPassword ? 'auto' : 'none'
                    }
                ]}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}>
                        {isDesktop && (
                            <View style={styles.desktopLeftPanel}>
                                <View style={styles.desktopBranding}>
                                    <View style={styles.desktopIconBg}>
                                        <Ionicons name="shield-checkmark" size={60} color="#fff" />
                                    </View>
                                    <Text style={styles.desktopBrandName}>Keamanan</Text>
                                    <Text style={styles.desktopBrandTagline}>Lindungi akun Anda dengan{'\n'}kata sandi baru yang kuat</Text>
                                </View>
                                <View style={styles.desktopDecorCircle} />
                            </View>
                        )}
                        <View style={{ flex: 1, justifyContent: isDesktop ? 'center' : 'flex-start' }}>
                            <View style={[styles.header, isDesktop && { borderBottomWidth: 0, paddingHorizontal: 40 }]}>
                                <TouchableOpacity onPress={handleCloseResetPassword} style={styles.backButton}>
                                    <Ionicons name="arrow-back" size={24} color="#000" />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>Amankan Akun Anda</Text>
                                <View style={{ width: 40, marginLeft: 16 }} />
                            </View>

                            <View style={[
                                styles.forgotPasswordContent,
                                isDesktop && {
                                    maxWidth: 500,
                                    alignSelf: 'center',
                                    width: '100%',
                                    paddingHorizontal: 40
                                }
                            ]}>
                                <Text style={[styles.forgotPasswordDesc, isDesktop && { textAlign: 'left', fontSize: 16 }]}>
                                    Hampir selesai! Buat kata sandi baru untuk akun Smartify Anda agar tetap aman. Ingatlah untuk memilih kata sandi yang kuat dan unik.
                                </Text>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Kata Sandi Baru</Text>
                                    <View style={styles.iconInputContainer}>
                                        <Ionicons name="lock-closed-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.iconInput}
                                            placeholder={focusedField === 'newPassword' ? '' : '**********'}
                                            placeholderTextColor="#A0A0A0"
                                            secureTextEntry={true}
                                            value={newPass}
                                            onChangeText={setNewPass}
                                            onFocus={() => {
                                                setFocusedField('newPassword');
                                            }}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                        <Ionicons name="eye-off-outline" size={20} color="#A0A0A0" />
                                    </View>
                                    <Text style={styles.helperText}>Panjangnya minimal 8 karakter!</Text>
                                </View>

                                <View style={[styles.inputContainer, { marginTop: 16 }]}>
                                    <Text style={styles.inputLabel}>Konfirmasi Kata Sandi Baru</Text>
                                    <View style={styles.iconInputContainer}>
                                        <Ionicons name="lock-closed-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.iconInput}
                                            placeholder={focusedField === 'confirmPassword' ? '' : '**********'}
                                            placeholderTextColor="#A0A0A0"
                                            secureTextEntry={true}
                                            value={confirmNewPass}
                                            onChangeText={setConfirmNewPass}
                                            onFocus={() => {
                                                setFocusedField('confirmPassword');
                                            }}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                        <Ionicons name="eye-off-outline" size={20} color="#A0A0A0" />
                                    </View>
                                    <Text style={styles.helperText}>Panjangnya minimal 8 karakter!</Text>
                                </View>

                                {!isDesktop && <View style={{ flex: 1 }} />}
                                <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleSaveNewPassword}>
                                    <Text style={styles.loginButtonText}>Simpan Kata Sandi Baru</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Animated.View>

            {/* === SUCCESS SCREEN === */}
            <Animated.View
                style={[
                    styles.loginOverlay,
                    {
                        opacity: successScreenOpacity,
                        zIndex: showSuccessScreen ? 6000 : -1,
                        pointerEvents: showSuccessScreen ? 'auto' : 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }
                ]}
            >
                <SafeAreaView style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={[
                        { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, width: '100%' },
                        isDesktop && { maxWidth: 500, alignSelf: 'center' }
                    ]}>
                        <View style={styles.successIcon}>
                            <Ionicons name="checkmark" size={50} color="#fff" />
                        </View>
                        <Text style={styles.successTitle}>Anda Sudah Siap!</Text>
                        <Text style={[styles.successSubtitle, isDesktop && { fontSize: 18, lineHeight: 26 }]}>
                            Kata sandi Anda telah berhasil diubah
                        </Text>

                        <View style={{ width: '100%', marginTop: 40 }}>
                            <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleCloseSuccessScreen}>
                                <Text style={styles.loginButtonText}>{isProfileFlow ? 'Selesai' : 'Buka Beranda'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    loginOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
    },
    desktopLeftPanel: {
        flex: 1,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    desktopBranding: {
        alignItems: 'center',
        zIndex: 2,
    },
    desktopLogo: {
        width: 150,
        height: 150,
        marginBottom: 24,
    },
    desktopBrandName: {
        fontSize: 48,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 2,
        marginBottom: 12,
    },
    desktopBrandTagline: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: 28,
    },
    desktopDecorCircle: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: 'rgba(255,255,255,0.05)',
        top: -100,
        right: -100,
    },
    desktopIconBg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    logo: {
        width: 100,
        height: 100,
    },
    logoText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#4285F4',
        marginTop: 12,
        letterSpacing: 1,
    },
    loginTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        marginBottom: 8,
    },
    loginSubtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F5F6FA',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 16,
        color: '#888',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
        // @ts-ignore - Web specific
        outlineStyle: 'none',
    },
    inputError: {
        borderColor: '#EF4444',
        borderWidth: 1.5,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#000',
        borderWidth: 0,
        // @ts-ignore - Web specific
        outlineStyle: 'none',
    },
    iconInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    iconInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#000',
        borderWidth: 0,
        // @ts-ignore - Web specific
        outlineStyle: 'none',
    },
    inputIcon: {
        marginRight: 12,
    },
    helperText: {
        marginTop: 6,
        fontSize: 12,
        color: '#888',
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: 12,
        overflow: 'hidden',
    },
    flagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 14,
        borderRightWidth: 1,
        borderRightColor: '#F0F0F0',
        backgroundColor: '#fff',
    },
    flagIconCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginRight: 4,
    },
    phoneInput: {
        flex: 1,
        paddingLeft: 2,
        paddingRight: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#000',
        borderWidth: 0,
        // @ts-ignore - Web specific
        outlineStyle: 'none',
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: '#888',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    checkboxChecked: {
        backgroundColor: '#666',
        borderColor: '#666',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#666',
    },
    forgotPassword: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#888',
        fontSize: 14,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    socialButtonText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        flex: 1,
        textAlign: 'center',
    },
    forgotPasswordContent: {
        paddingHorizontal: 24,
        paddingBottom: 0,
        flex: 1,
    },
    forgotPasswordDesc: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 10,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    otpBox: {
        width: 48,
        height: 56,
        borderRadius: 12,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    otpBoxFocused: {
        borderColor: Colors.primary,
        backgroundColor: '#fff',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    otpBoxFilled: {
        borderColor: Colors.primary,
        backgroundColor: '#fff',
    },
    otpText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        textAlign: 'center',
    },
    hiddenInput: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0,
        zIndex: 1,
    },
    timerText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        marginBottom: 8,
    },
    resendLink: {
        textAlign: 'center',
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    successIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    successTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center'
    }
} as any);

export default React.memo(AuthScreen);
