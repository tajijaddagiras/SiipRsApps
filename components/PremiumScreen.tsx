import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Colors } from '../styles/theme';
import AppHeader from './AppHeader';

const { width } = Dimensions.get('window');

interface PremiumScreenProps {
    isVisible: boolean;
    opacity: Animated.Value;
    onClose: () => void;
    onOpenPaymentVA?: (amount: string, type: 'food' | 'premium') => void;
}

const PremiumScreen: React.FC<PremiumScreenProps> = ({
    isVisible,
    opacity,
    onClose,
    onOpenPaymentVA
}) => {
    const [view, setView] = React.useState<'OFFER' | 'PAYMENT'>('OFFER');
    const subViewOpacity = React.useRef(new Animated.Value(1)).current;

    // Reset view and opacity when closing
    React.useEffect(() => {
        if (!isVisible) {
            setView('OFFER');
            subViewOpacity.setValue(1);
        }
    }, [isVisible]);

    const switchView = (newView: 'OFFER' | 'PAYMENT') => {
        Animated.timing(subViewOpacity, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setView(newView);
            Animated.timing(subViewOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleBack = () => {
        if (view === 'PAYMENT') {
            switchView('OFFER');
        } else {
            onClose();
        }
    };

    const handleUpgrade = () => {
        switchView('PAYMENT');
    };

    const renderOfferView = () => (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#4285F4' }} edges={['top']}>
            <AppHeader
                title="Premium"
                showBack
                onBack={handleBack}
                align="center"
                variant="default"
                containerStyle={{
                    backgroundColor: '#4285F4',
                    borderBottomWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0
                }}
                contentColor="#fff"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={styles.scrollContent}
                style={{ backgroundColor: '#F8FAFC' }}
            >
                <View style={styles.heroSection}>
                    <View style={styles.heroContent}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="crown" size={48} color="#fff" />
                        </View>
                        <Text style={styles.heroTitle}>Tingkatkan Premium</Text>
                        <Text style={styles.heroSubtitle}>Pilih paket yang sesuai kebutuhan anda</Text>
                    </View>
                </View>

                <View style={styles.cardsContainer}>
                    <View style={styles.basicCard}>
                        <Text style={styles.cardTitleBasic}>Basic</Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceBasic}>Gratis</Text>
                            <Text style={styles.durationBasic}> Selamanya</Text>
                        </View>

                        <View style={styles.featuresList}>
                            <FeatureItem label="Akses aplikasi dasar" active />
                            <FeatureItem label="1 perangkat" active />
                            <FeatureItem label="Rekomendasi makanan harian" active />
                            <FeatureItem label="Tidak termasuk konsultasi ahli gizi" active={false} />
                            <FeatureItem label="Tidak bisa chat personal" active={false} />
                            <FeatureItem label="Tanpa pendampingan pola makan" active={false} />
                        </View>

                        <View style={styles.currentPlanBtn}>
                            <Text style={styles.currentPlanText}>Paket saat ini</Text>
                        </View>
                    </View>

                    <View style={styles.premiumCard}>
                        <Text style={styles.cardTitlePremium}>Premium</Text>
                        <Text style={styles.pricePremium}>Rp 50.000 / Bulan</Text>

                        <View style={styles.featuresList}>
                            <FeatureItem label="Chat langsung dengan ahli gizi" active variant="premium" />
                            <FeatureItem label="Rekomendasi menu harian lebih spesifik" active variant="premium" />
                            <FeatureItem label="Panduan makanan berdasarkan kondisi tubuh" active variant="premium" />
                        </View>

                        <TouchableOpacity
                            style={styles.upgradeBtn}
                            activeOpacity={0.9}
                            onPress={handleUpgrade}
                        >
                            <Text style={styles.upgradeBtnText}>Upgrade ke Premium</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );

    const renderPaymentView = () => (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>
            <AppHeader
                title="Pilih Metode Pembayaran"
                showBack
                onBack={handleBack}
                align="center"
                containerStyle={{
                    backgroundColor: '#fff',
                    borderBottomWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0
                }}
            />

            <ScrollView
                style={{ flex: 1, backgroundColor: '#F8FAFC' }}
                contentContainerStyle={{ padding: 20 }}
            >
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.summaryPrice}>Rp 50.000</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Paket Premium</Text>
                        </View>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Biaya Layanan</Text>
                        <Text style={styles.summaryValue}>Rp 5.000</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>TOTAL AKHIR</Text>
                        <Text style={styles.totalValue}>Rp 55.000</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.paymentMethodCard}
                    onPress={() => onOpenPaymentVA?.('Rp 55.000', 'premium')}
                >
                    <View style={styles.paymentMethodLeft}>
                        <Ionicons name="card-outline" size={24} color="#64748B" />
                        <Text style={styles.paymentMethodText}>Transfer Bank (VA)</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.container,
                {
                    opacity: opacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    backgroundColor: view === 'OFFER' ? '#4285F4' : '#F8FAFC',
                }
            ]}
        >
            <Animated.View
                renderToHardwareTextureAndroid={true}
                style={{ flex: 1, opacity: subViewOpacity }}
            >
                {view === 'OFFER' ? renderOfferView() : renderPaymentView()}
            </Animated.View>
        </Animated.View>
    );
};

const FeatureItem = ({ label, active, variant = 'basic' }: { label: string, active: boolean, variant?: 'basic' | 'premium' }) => {
    const isPremium = variant === 'premium';
    let iconName: any = active ? 'checkmark-circle' : 'close-circle';
    let iconColor = active ? '#4CAF50' : '#CBD5E1'; // Green : Grey

    if (isPremium) {
        iconColor = '#86EFAC'; // Light green
    }

    const textColor = isPremium ? '#fff' : (active ? '#1E293B' : '#64748B');

    return (
        <View style={styles.featureItem}>
            <Ionicons name={iconName} size={20} color={iconColor} style={{ marginRight: 8 }} />
            <Text style={[styles.featureText, { color: textColor }]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#F8FAFC',
        zIndex: 2000,
    },
    scrollContent: {
        paddingBottom: 40,
    },

    heroSection: {
        backgroundColor: '#4285F4',
        paddingBottom: 60, // Space for overlap
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: 10,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    heroContent: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        textAlign: 'center',
    },
    cardsContainer: {
        marginTop: -40, // Overlap header
        paddingHorizontal: 20,
        gap: 20,
    },
    basicCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    cardTitleBasic: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 20,
    },
    priceBasic: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1E293B',
    },
    durationBasic: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '500',
    },
    featuresList: {
        gap: 12,
        marginBottom: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    featureText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    currentPlanBtn: {
        backgroundColor: '#E2E8F0',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    currentPlanText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#64748B',
    },
    premiumCard: {
        backgroundColor: '#4285F4', // Solid blue
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000', // Changed to black for visibility consistency
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15, // Reduced since it's black
        shadowRadius: 15,
        elevation: 8,
        marginBottom: 20,
    },
    cardTitlePremium: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    pricePremium: {
        fontSize: 20,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 20,
    },
    upgradeBtn: {
        backgroundColor: '#fff',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    upgradeBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4285F4',
    },
    // Payment View Styles
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    summaryPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4285F4',
    },
    badge: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 100,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#16A34A',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 16,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4285F4',
    },
    paymentMethodCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    paymentMethodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    paymentMethodText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
});

export default React.memo(PremiumScreen);
