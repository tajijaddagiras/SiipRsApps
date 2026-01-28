import * as React from 'react';
import { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../styles/theme';
import AppHeader from './AppHeader';
import CancelOrderModal from './CancelOrderModal';

interface MealActivityScreenProps {
    isVisible: boolean;
    opacity: Animated.Value;
    onClose: () => void;
    onOpenReview?: () => void;
    onOrderAgain?: (meal: any) => void;
    onViewOrderDetails?: (orderId: string | number) => void;
    onConfirmCancel?: () => void;
}

interface MealItem {
    id: number;
    name: string;
    price: string;
    image: any;
    paymentMethod: string;
    hasReview: boolean;
    rating?: number;
    calories?: string;
    time?: string;
}

const mockMeals: MealItem[] = [
    {
        id: 1,
        name: 'Cauliflower Rice Bowl',
        price: 'Rp 35.000',
        image: require('../assets/images/insight_nutrition.png'),
        paymentMethod: 'Transfer Bank (VA)',
        hasReview: false,
        calories: '280 Kcal',
        time: '20 menit',
    },
    {
        id: 2,
        name: 'Tofu Stir Fry',
        price: 'Rp 42.000',
        image: require('../assets/images/insight_lifestyle.png'),
        paymentMethod: 'Tunai',
        hasReview: true,
        rating: 5,
        calories: '320 Kcal',
        time: '25 menit',
    },
];

interface InProgressItem {
    id: number;
    name: string;
    price: string;
    image: any;
    calories?: string;
    time?: string;
}

const mockInProgressMeals: InProgressItem[] = [
    {
        id: 1,
        name: 'Cauliflower Rice Bowl',
        price: 'Rp 35.000',
        image: require('../assets/images/insight_nutrition.png'),
        calories: '280 Kcal',
        time: '20 menit',
    },
];

const MealActivityScreen: React.FC<MealActivityScreenProps> = ({
    isVisible,
    opacity,
    onClose,
    onOpenReview,
    onOrderAgain,
    onViewOrderDetails,
    onConfirmCancel,
}) => {
    const [activeTab, setActiveTab] = useState<'Riwayat' | 'Dalam Proses'>('Riwayat');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const cancelModalOpacity = useRef(new Animated.Value(0)).current;

    const handleOpenCancelModal = () => {
        setShowCancelModal(true);
        Animated.timing(cancelModalOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseCancelModal = () => {
        Animated.timing(cancelModalOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowCancelModal(false);
        });
    };

    const handleConfirmCancel = () => {
        // Implement cancellation logic here
        handleCloseCancelModal();
        if (onConfirmCancel) onConfirmCancel();
    };

    const renderStars = (rating: number) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                        key={star}
                        name="star"
                        size={16}
                        color={star <= rating ? '#FBBF24' : '#E2E8F0'}
                    />
                ))}
            </View>
        );
    };

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.container,
                {
                    opacity: opacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                },
            ]}
        >
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {/* Header */}
                <AppHeader
                    title="Aktifitas Meals"
                    showBack
                    onBack={onClose}
                    align="center"
                    containerStyle={{
                        backgroundColor: '#fff',
                        borderBottomWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0
                    }}
                />

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Riwayat' && styles.activeTab]}
                        onPress={() => setActiveTab('Riwayat')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Riwayat' && styles.activeTabText]}>
                            Riwayat
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Dalam Proses' && styles.activeTab]}
                        onPress={() => setActiveTab('Dalam Proses')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Dalam Proses' && styles.activeTabText]}>
                            Dalam Proses
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {activeTab === 'Riwayat' ? (
                        mockMeals.map((meal) => (
                            <View key={meal.id} style={styles.mealCard}>
                                <View style={styles.mealHeader}>
                                    <Image source={meal.image} style={styles.mealImage} />
                                    <View style={styles.mealInfo}>
                                        <Text style={styles.mealName}>{meal.name}</Text>
                                        <Text style={styles.mealPrice}>{meal.price}</Text>
                                    </View>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.paymentRow}>
                                    <View>
                                        <Text style={styles.paymentLabel}>Metode Pembayaran</Text>
                                        <Text style={styles.paymentMethod}>{meal.paymentMethod}</Text>
                                    </View>
                                    {meal.hasReview && meal.rating && renderStars(meal.rating)}
                                </View>

                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={styles.orderAgainButton}
                                        onPress={() => onOrderAgain && onOrderAgain(meal)}
                                    >
                                        <Text style={styles.orderAgainText}>Pesan Lagi</Text>
                                    </TouchableOpacity>
                                    {!meal.hasReview && (
                                        <TouchableOpacity style={styles.reviewButton} onPress={onOpenReview}>
                                            <Text style={styles.reviewButtonText}>Beri Ulasan</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))
                    ) : (
                        mockInProgressMeals.map((meal) => (
                            <View key={meal.id} style={styles.mealCard}>
                                <View style={styles.mealHeader}>
                                    <Image source={meal.image} style={styles.mealImage} />
                                    <View style={styles.mealInfo}>
                                        <Text style={styles.mealName}>{meal.name}</Text>
                                        <Text style={styles.mealPrice}>{meal.price}</Text>
                                    </View>
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={styles.orderNumberButton}
                                        onPress={() => onViewOrderDetails && onViewOrderDetails(meal.id)}
                                    >
                                        <Text style={styles.orderNumberText}>Nomor Pesanan</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.cancelOrderButton}
                                        onPress={handleOpenCancelModal}
                                    >
                                        <Text style={styles.cancelOrderText}>Batalkan Pesanan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            </SafeAreaView>

            <CancelOrderModal
                isVisible={showCancelModal}
                opacity={cancelModalOpacity}
                onCancel={handleCloseCancelModal}
                onConfirm={handleConfirmCancel}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        zIndex: 1000,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    tab: {
        marginRight: 24,
        paddingBottom: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94A3B8',
    },
    activeTabText: {
        color: Colors.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    mealCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    mealHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mealImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
    },
    mealInfo: {
        marginLeft: 12,
        flex: 1,
    },
    mealName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 4,
    },
    mealPrice: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 16,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
    },
    paymentLabel: {
        fontSize: 12,
        color: '#94A3B8',
        marginBottom: 4,
    },
    paymentMethod: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    orderAgainButton: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    orderAgainText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    reviewButton: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#94A3B8',
        marginTop: 16,
    },
    orderNumberButton: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    orderNumberText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    cancelOrderButton: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelOrderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
});

export default MealActivityScreen;
