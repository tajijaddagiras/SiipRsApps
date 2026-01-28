import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Image,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from './AppHeader';
import { Colors } from '../styles/theme';

const { width } = Dimensions.get('window');

interface OrderSuccessScreenProps {
    isVisible: boolean;
    opacity?: Animated.Value;
    onClose: () => void;
    type?: 'food' | 'premium';
    amount?: string;
}

const OrderSuccessScreen: React.FC<OrderSuccessScreenProps> = ({
    isVisible,
    opacity = new Animated.Value(0),
    onClose,
    type = 'food',
    amount = 'Rp 38.000'
}) => {
    const isPremium = type === 'premium';
    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: opacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    zIndex: 2900, // Highest priority
                }
            ]}
        >
            <SafeAreaView style={styles.container}>
                {!isPremium && (
                    <AppHeader
                        title="Nomor Pesanan"
                        align="center"
                        showBack={false}
                        containerStyle={{
                            backgroundColor: '#fff',
                            borderBottomWidth: 0,
                            elevation: 0,
                            shadowOpacity: 0
                        }}
                    />
                )}

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.headerSection}>
                        <View style={[styles.successIconCircle, isPremium && styles.premiumIconCircle]}>
                            <Ionicons
                                name={isPremium ? "checkmark-sharp" : "checkmark-sharp"}
                                size={isPremium ? 56 : 48}
                                color={isPremium ? "#fff" : "#22C55E"}
                                style={{ fontWeight: 'bold' }}
                            />
                        </View>
                        <Text style={styles.successTitle}>Pembayaran Berhasil!</Text>
                        <Text style={[styles.successSubtitle, isPremium && styles.premiumSuccessSubtitle]}>
                            {isPremium ? "Premium Anda Aktif" : "Pesanan Anda sedang diproses"}
                        </Text>
                    </View>

                    {isPremium && (
                        <View style={styles.premiumStatusCard}>
                            <View style={styles.premiumStatusHeader}>
                                <View>
                                    <Text style={styles.statusLabel}>Status Akun</Text>
                                    <Text style={styles.statusValue}>Premium Member</Text>
                                </View>
                                <View style={styles.statusIconBg}>
                                    <MaterialCommunityIcons name="crown" size={32} color="#fff" />
                                </View>
                            </View>

                            <View style={styles.validityCard}>
                                <View style={styles.validityIndicator} />
                                <View style={styles.validityContent}>
                                    <Text style={styles.validityLabel}>Berlaku Hingga</Text>
                                    <Text style={styles.validityValue}>12 Februari 2026</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {!isPremium && (
                        <View style={styles.orderNumberCard}>
                            <Text style={styles.orderNumberLabel}>Nomor Pesanan</Text>
                            <Text style={styles.orderNumberValue}>INV875278512</Text>
                        </View>
                    )}

                    {/* Order Details Card - Only for Food */}
                    {!isPremium && (
                        <View style={styles.detailsCard}>
                            {/* Gojek */}
                            <View style={styles.detailRow}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="location-outline" size={20} color="#4285F4" />
                                </View>
                                <View style={styles.detailTextContainer}>
                                    <Text style={styles.detailTitle}>Gojek</Text>
                                    <Text style={styles.detailSubtitle}>Jl. Setia Budi No 109</Text>
                                </View>
                            </View>

                            <View style={styles.separator} />

                            {/* Estimasi */}
                            <View style={styles.detailRow}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="time-outline" size={20} color="#4285F4" />
                                </View>
                                <View style={styles.detailTextContainer}>
                                    <Text style={styles.detailTitle}>Estimasi Waktu</Text>
                                    <Text style={styles.detailSubtitle}>15-20 menit</Text>
                                </View>
                            </View>

                            <View style={styles.separator} />

                            {/* Payment Method */}
                            <View style={styles.detailRow}>
                                <View style={styles.iconContainer}>
                                    <Ionicons name="wallet-outline" size={20} color="#4285F4" />
                                </View>
                                <View style={styles.detailTextContainer}>
                                    <Text style={styles.detailTitle}>Metode Pembayaran</Text>
                                    <Text style={styles.detailSubtitle}>Transfer Bank (VA)</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {!isPremium && (
                        <View style={styles.totalCard}>
                            <Text style={styles.totalLabel}>Total Pembayaran</Text>
                            <Text style={styles.totalValue}>{amount}</Text>
                        </View>
                    )}
                </ScrollView>

                {/* Bottom Button outside ScrollView */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.homeBtn}
                        activeOpacity={0.8}
                        onPress={onClose}
                    >
                        <Text style={styles.homeBtnText}>Kembali Ke Beranda</Text>
                    </TouchableOpacity>
                </View>
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
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center', // Center vertically
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    successIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: '#22C55E',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 13,
        color: '#64748B',
    },
    orderNumberCard: {
        width: '100%',
        backgroundColor: '#F0F9FF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#BAE6FD',
        borderLeftWidth: 4,
        borderLeftColor: '#4285F4',
    },
    orderNumberLabel: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 4,
        fontWeight: '500',
    },
    orderNumberValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#4285F4',
    },
    detailsCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0F9FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 2,
    },
    detailSubtitle: {
        fontSize: 12,
        color: '#64748B',
    },
    separator: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 16,
        marginLeft: 52, // Align with text
    },
    totalCard: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        backgroundColor: '#fff',
    },
    totalLabel: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    homeBtn: {
        backgroundColor: '#4285F4',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    homeBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    premiumIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#22C55E',
        borderWidth: 0,
        shadowColor: '#22C55E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
        marginBottom: 24,
    },
    premiumSuccessSubtitle: {
        color: '#4285F4',
        fontWeight: 'bold',
        fontSize: 15,
    },
    premiumStatusCard: {
        width: '100%',
        backgroundColor: '#F0F7FF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E1EFFF',
        marginTop: 10,
    },
    premiumStatusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    statusLabel: {
        fontSize: 14,
        color: '#1E293B',
        marginBottom: 4,
    },
    statusValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4285F4',
    },
    statusIconBg: {
        width: 56,
        height: 56,
        backgroundColor: '#60A5FA',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    validityCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    validityIndicator: {
        width: 4,
        backgroundColor: '#4285F4',
    },
    validityContent: {
        padding: 12,
        flex: 1,
    },
    validityLabel: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 4,
    },
    validityValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4285F4',
    },
});

export default React.memo(OrderSuccessScreen);
