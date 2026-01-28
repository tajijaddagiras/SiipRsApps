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
    Keyboard
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
}

const AuthScreen: React.FC<AuthScreenProps> = (props: AuthScreenProps) => {
    const {
        loginOpacity, showLogin, activeTab, setActiveTab,
        showPassword, setShowPassword, rememberMe, setRememberMe,
        handleLogin, forgotPasswordOpacity, showForgotPassword,
        handleForgotPassword, handleSendOTP, otpVerificationOpacity,
        showOTPVerification, handleCloseOTP, otpCode, otpSelection, setOtpSelection,
        inputRefs, handleOtpChange, resetPasswordOpacity,
        showResetPassword, handleCloseResetPassword, handleSaveNewPassword,
        successScreenOpacity, showSuccessScreen, handleCloseSuccessScreen,
        isProfileFlow
    } = props;

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
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                            <View style={styles.logoContainer}>
                                <Image
                                    source={require('../assets/images/logo.png')}
                                    style={styles.logo}
                                    contentFit="contain"
                                />
                            </View>

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
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Email</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="kelompok123@gmail.com"
                                            placeholderTextColor="#A0A0A0"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Kata Sandi</Text>
                                        <View style={styles.passwordContainer}>
                                            <TextInput
                                                style={styles.passwordInput}
                                                placeholder="**********"
                                                placeholderTextColor="#A0A0A0"
                                                secureTextEntry={!showPassword}
                                            />
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#A0A0A0" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

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
                                        <View style={styles.iconInputContainer}>
                                            <Ionicons name="person-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
                                            <TextInput
                                                style={styles.iconInput}
                                                placeholder="kelompok"
                                                placeholderTextColor="#A0A0A0"
                                                autoCapitalize="words"
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Email</Text>
                                        <View style={styles.iconInputContainer}>
                                            <Ionicons name="person-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
                                            <TextInput
                                                style={styles.iconInput}
                                                placeholder="kelompok123@gmail.com"
                                                placeholderTextColor="#A0A0A0"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
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
                                            <TextInput
                                                style={styles.phoneInput}
                                                placeholder="(+62)"
                                                placeholderTextColor="#000"
                                                keyboardType="phone-pad"
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Kata Sandi</Text>
                                        <View style={styles.iconInputContainer}>
                                            <Ionicons name="person-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
                                            <TextInput
                                                style={styles.iconInput}
                                                placeholder="**********"
                                                placeholderTextColor="#A0A0A0"
                                                secureTextEntry={!showPassword}
                                            />
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#A0A0A0" />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.helperText}>Panjangnya minimal 8 karakter!</Text>
                                    </View>
                                </>
                            )}

                            <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleLogin}>
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
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => handleForgotPassword(false)} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Lupa Kata Sandi Anda</Text>
                        <View style={{ width: 40, marginLeft: 16 }} />
                    </View>

                    <View style={styles.forgotPasswordContent}>
                        <Text style={styles.forgotPasswordDesc}>
                            Kami siap membantu Anda, Masukkan email terdaftar Anda untuk mengatur ulang kata sandi Anda, Kami akan mengirimkan kode OTP ke email Anda untuk langkah selanjutnya
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <View style={styles.iconInputContainer}>
                                <Ionicons name="person-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.iconInput}
                                    placeholder="kelompok123@gmail.com"
                                    placeholderTextColor="#A0A0A0"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleSendOTP}>
                            <Text style={styles.loginButtonText}>Kirim Kode OTP</Text>
                        </TouchableOpacity>
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
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleCloseOTP} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Masukkan Kode OTP</Text>
                        <View style={{ width: 40, marginLeft: 16 }} />
                    </View>

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.forgotPasswordContent}>
                            <Text style={styles.forgotPasswordDesc}>
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
                                Anda dapat mengirim ulang kode dalam <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>56</Text> detik
                            </Text>

                            <TouchableOpacity>
                                <Text style={styles.resendLink}>Kirim ulang kode</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
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
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleCloseResetPassword} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Amankan Akun Anda</Text>
                        <View style={{ width: 40, marginLeft: 16 }} />
                    </View>

                    <View style={styles.forgotPasswordContent}>
                        <Text style={styles.forgotPasswordDesc}>
                            Hampir selesai! Buat kata sandi baru untuk akun Smartify Anda agar tetap aman. Ingatlah untuk memilih kata sandi yang kuat dan unik.
                        </Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Kata Sandi Baru</Text>
                            <View style={styles.iconInputContainer}>
                                <Ionicons name="person-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.iconInput}
                                    placeholder="**********"
                                    placeholderTextColor="#A0A0A0"
                                    secureTextEntry={true}
                                />
                                <Ionicons name="eye-off-outline" size={20} color="#A0A0A0" />
                            </View>
                            <Text style={styles.helperText}>Panjangnya minimal 8 karakter!</Text>
                        </View>

                        <View style={[styles.inputContainer, { marginTop: 16 }]}>
                            <Text style={styles.inputLabel}>Konfirmasi Kata Sandi Baru</Text>
                            <View style={styles.iconInputContainer}>
                                <Ionicons name="person-outline" size={20} color="#A0A0A0" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.iconInput}
                                    placeholder="**********"
                                    placeholderTextColor="#A0A0A0"
                                    secureTextEntry={true}
                                />
                                <Ionicons name="eye-off-outline" size={20} color="#A0A0A0" />
                            </View>
                            <Text style={styles.helperText}>Panjangnya minimal 8 karakter!</Text>
                        </View>

                        <View style={{ flex: 1 }} />
                        <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleSaveNewPassword}>
                            <Text style={styles.loginButtonText}>Simpan Kata Sandi Baru</Text>
                        </TouchableOpacity>
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
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, width: '100%' }}>
                        <View style={styles.successIcon}>
                            <Ionicons name="checkmark" size={50} color="#fff" />
                        </View>
                        <Text style={styles.successTitle}>Anda Sudah Siap!</Text>
                        <Text style={styles.successSubtitle}>Kata sandi Anda telah berhasil diubah</Text>
                    </View>
                    <View style={{ paddingHorizontal: 24, width: '100%', paddingBottom: 0 }}>
                        <TouchableOpacity style={styles.loginButton} activeOpacity={0.8} onPress={handleCloseSuccessScreen}>
                            <Text style={styles.loginButtonText}>{isProfileFlow ? 'Selesai' : 'Buka Beranda'}</Text>
                        </TouchableOpacity>
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
        width: 120,
        height: 120,
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
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#000',
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
});

export default React.memo(AuthScreen);
