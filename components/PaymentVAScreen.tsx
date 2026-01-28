import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    Platform,
    Clipboard,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from './AppHeader';
import { Colors } from '../styles/theme';

const { width } = Dimensions.get('window');

interface PaymentVAScreenProps {
    isVisible: boolean;
    onClose: () => void;
    amount: string;
    vaOpacity?: Animated.Value;
}

const PaymentVAScreen: React.FC<PaymentVAScreenProps> = ({
    isVisible,
    onClose,
    amount = 'Rp 38.000',
    vaOpacity = new Animated.Value(0)
}) => {
    const [timeLeft, setTimeLeft] = useState(1799); // 29:59 in seconds
    const vaNumber = "112 0896 6798";

    // useEffect(() => {
    //     if (!isVisible) return;

    //     const timer = setInterval(() => {
    //         setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    //     }, 1000);

    //     return () => clearInterval(timer);
    // }, [isVisible]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const copyToClipboard = () => {
        Clipboard.setString(vaNumber.replace(/\s/g, ''));
        Alert.alert('Berhasil', 'Nomor Virtual Account disalin ke clipboard');
    };

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: vaOpacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    zIndex: 2700,
                }
            ]}
        >
            <SafeAreaView style={styles.container}>
                <AppHeader
                    title="Pembayaran"
                    showBack
                    onBack={onClose}
                    align="center"
                    variant="popup"
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Summary Card */}
                    <View style={styles.amountCard}>
                        <View style={styles.amountHeader}>
                            <Text style={styles.vaLabel}>Metode Pembayaran</Text>
                            <View style={styles.timerContainer}>
                                <Text style={styles.timerLabel}>Batas Waktu Bayar</Text>
                                <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
                            </View>
                        </View>

                        <View style={styles.vaMainInfo}>
                            <Text style={styles.vaType}>Virtual Account</Text>
                        </View>

                        <View style={styles.amountRow}>
                            <Text style={styles.amountLabel}>Jumlah yang harus Dibayar:</Text>
                            <Text style={styles.amountValue}>{amount}</Text>
                        </View>
                    </View>

                    {/* VA Number Card */}
                    <View style={styles.vaNumberCard}>
                        <Text style={styles.vaNumberTitle}>NOMOR VIRTUAL ACCOUNT</Text>
                        <View style={styles.vaNumberRow}>
                            <Text style={styles.vaNumberText}>{vaNumber}</Text>
                            <TouchableOpacity onPress={copyToClipboard} style={styles.copyBtn}>
                                <Ionicons name="copy-outline" size={24} color="#4285F4" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Warning Box */}
                    <View style={styles.warningBox}>
                        <View style={styles.warningIconBg}>
                            <Ionicons name="alert-circle-outline" size={24} color="#F97316" />
                        </View>
                        <Text style={styles.warningText}>
                            Silahkan melakukan transfer melalui ATM, Mobile Banking, atau Internet Banking BCA sebelum batas waktu berakhir
                        </Text>
                    </View>

                    {/* Instructions */}
                    <View style={styles.instructionsCard}>
                        <Text style={styles.instructionsTitle}>Rincian Pembayaran</Text>

                        <View style={styles.stepItem}>
                            <Text style={styles.stepText}>1. Pilih M-Transfer {'>'} BCA Virtual Account</Text>
                        </View>
                        <View style={styles.stepItem}>
                            <Text style={styles.stepText}>2. Masukan nomor VA di atas</Text>
                        </View>
                        <View style={styles.stepItem}>
                            <Text style={styles.stepText}>3. Konfirmasi nominal & PIN</Text>
                        </View>
                        <View style={styles.stepItem}>
                            <Text style={styles.stepText}>4. Simpan bukti transaksi</Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    amountCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    amountHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    vaLabel: {
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: '500',
    },
    timerContainer: {
        alignItems: 'flex-end',
    },
    timerLabel: {
        fontSize: 10,
        color: '#EF4444',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    timerValue: {
        fontSize: 22,
        fontWeight: '900',
        color: '#EF4444',
    },
    vaMainInfo: {
        marginBottom: 24,
    },
    vaType: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E293B',
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    amountLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
        flex: 1,
        marginTop: 6, // Vertical alignment with wrapped text
    },
    amountValue: {
        flex: 1,
        fontSize: 24,
        fontWeight: '900',
        color: '#4285F4',
        textAlign: 'right',
        flexWrap: 'wrap',
    },
    vaNumberCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        alignItems: 'center',
        marginBottom: 20,
    },
    vaNumberTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#64748B',
        letterSpacing: 1,
        marginBottom: 16,
    },
    vaNumberRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vaNumberText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: 2,
    },
    copyBtn: {
        marginLeft: 16,
    },
    warningBox: {
        flexDirection: 'row',
        backgroundColor: '#FFF7ED',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FED7AA',
        marginBottom: 20,
    },
    warningIconBg: {
        marginRight: 12,
        marginTop: 2,
    },
    warningText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 20,
        color: '#F97316',
        fontWeight: '500',
    },
    instructionsCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    instructionsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 20,
    },
    stepItem: {
        marginBottom: 16,
    },
    stepText: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 22,
        fontWeight: '500',
    },
});

export default React.memo(PaymentVAScreen);
