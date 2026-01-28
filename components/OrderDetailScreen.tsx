import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from './AppHeader';
import { Colors } from '../styles/theme';

const { width } = Dimensions.get('window');

interface OrderDetailScreenProps {
    isVisible: boolean;
    opacity: Animated.Value;
    onClose: () => void;
    orderData?: {
        id: string | number;
        invoiceNumber: string;
        shippingMethod: string;
        shippingAddress: string;
        estimation: string;
        paymentMethod: string;
        total: string;
    };
}

const OrderDetailScreen: React.FC<OrderDetailScreenProps> = ({
    isVisible,
    opacity,
    onClose,
    orderData = {
        invoiceNumber: 'INV875278512',
        shippingMethod: 'Gojek',
        shippingAddress: 'Jl. Setia Budi No 109',
        estimation: '15-20 menit',
        paymentMethod: 'Transfer Bank (VA)',
        total: 'Rp 35.000'
    }
}) => {
    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: opacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    zIndex: 2900,
                }
            ]}
        >
            <SafeAreaView style={styles.container} edges={['top']}>
                <AppHeader
                    title="Nomor Pesanan"
                    showBack={true}
                    onBack={onClose}
                    align="center"
                    variant="popup"
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Status Header - Matching OrderSuccessScreen style */}
                    <View style={styles.headerSection}>
                        <View style={styles.statusIconCircle}>
                            <Ionicons name="time-outline" size={48} color={Colors.primary} />
                        </View>
                        <Text style={styles.statusTitle}>Pesanan Sedang Diproses</Text>
                        <Text style={styles.statusSubtitle}>Silakan tunggu pesanan Anda tiba</Text>
                    </View>

                    {/* Order Number Card */}
                    <View style={styles.orderNumberCard}>
                        <Text style={styles.orderNumberLabel}>Nomor Pesanan</Text>
                        <Text style={styles.orderNumberValue}>{orderData.invoiceNumber}</Text>
                    </View>

                    {/* Order Details Card */}
                    <View style={styles.detailsCard}>
                        {/* Shipping */}
                        <View style={styles.detailRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="location-outline" size={20} color={Colors.primary} />
                            </View>
                            <View style={styles.detailTextContainer}>
                                <Text style={styles.detailTitle}>{orderData.shippingMethod}</Text>
                                <Text style={styles.detailSubtitle}>{orderData.shippingAddress}</Text>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        {/* Estimation */}
                        <View style={styles.detailRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="time-outline" size={20} color={Colors.primary} />
                            </View>
                            <View style={styles.detailTextContainer}>
                                <Text style={styles.detailTitle}>Estimasi Waktu</Text>
                                <Text style={styles.detailSubtitle}>{orderData.estimation}</Text>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        {/* Payment Method */}
                        <View style={styles.detailRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="wallet-outline" size={20} color={Colors.primary} />
                            </View>
                            <View style={styles.detailTextContainer}>
                                <Text style={styles.detailTitle}>Metode Pembayaran</Text>
                                <Text style={styles.detailSubtitle}>{orderData.paymentMethod}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Total Card */}
                    <View style={styles.totalCard}>
                        <Text style={styles.totalLabel}>Total Pembayaran</Text>
                        <Text style={styles.totalValue}>{orderData.total}</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 40,
        alignItems: 'center',
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    statusIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 8,
    },
    statusSubtitle: {
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
        borderLeftColor: Colors.primary,
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
        color: Colors.primary,
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
        marginLeft: 52,
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
});

export default React.memo(OrderDetailScreen);
