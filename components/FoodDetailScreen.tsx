import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions,
    Platform,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from './AppHeader';
import { Colors } from '../styles/theme';

const { width } = Dimensions.get('window');

interface FoodDetailScreenProps {
    isVisible: boolean;
    onClose: () => void;
    foodData: any;
    onOpenCheckout: (data: any) => void;
    detailOpacity?: Animated.Value;
    cartCount: number;
    onOpenCart: () => void;
    onAddToCart?: () => void;
}

const OTHER_MENUS = [
    { id: 1, title: 'Es Teh Manis', price: 'Rp 5.000', rating: '4.8', image: require('../assets/images/insight_nutrition.png'), restaurant: 'Healthy Kitchen' },
    { id: 2, title: 'Tofu Stir Fry', price: 'Rp 25.000', rating: '4.7', image: require('../assets/images/insight_lifestyle.png'), restaurant: 'Healthy Kitchen' },
    { id: 3, title: 'Vegetable Soup', price: 'Rp 20.000', rating: '4.9', image: require('../assets/images/insight_community.png'), restaurant: 'Healthy Kitchen' }
];

const REVIEWS = [
    { id: 1, name: 'Andi Pratama', rating: 5, text: 'Sangat enak dan sehat! Porsinya pas untuk makan siang.', time: '2 hari yang lalu', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'Siti Aminah', rating: 4, text: 'Rasanya segar sekali, tapi pengiriman agak lama.', time: '5 hari yang lalu', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }
];

const FoodDetailScreen: React.FC<FoodDetailScreenProps> = ({
    isVisible,
    onClose,
    foodData,
    onOpenCheckout,
    detailOpacity = new Animated.Value(0),
    cartCount,
    onOpenCart,
    onAddToCart
}) => {
    const [mainQuantity, setMainQuantity] = useState(1);
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    const updateOtherQuantity = (id: number, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) + delta)
        }));
    };

    const handleOrder = () => {
        // ... handleOrder logic ...
        let checkoutItem = { ...foodData, quantity: mainQuantity };
        const isRestaurant = foodData?.verified === true || foodData?.type === 'Resto' || foodData?.price === 'Restoran Terverifikasi';
        if (isRestaurant) {
            checkoutItem = { ...foodData, name: foodData.name || 'Paket Nasi Padang', title: foodData.name || 'Paket Nasi Padang', price: 'Rp 38.000', restaurant: foodData.name, image: foodData.image, type: 'Resto', quantity: mainQuantity };
        }
        onOpenCheckout(checkoutItem);
    };

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: detailOpacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    zIndex: 2500,
                }
            ]}
        >
            <View
                key={foodData?.id || foodData?.title || 'empty'}
                style={styles.container}
            >
                {foodData ? (
                    <>
                        {/* Header (Floating) */}
                        <View style={[styles.headerFloating, { paddingTop: Platform.OS === 'ios' ? 50 : 40 }]}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 }}>
                                <TouchableOpacity style={styles.headerPopupIcon} onPress={onClose}>
                                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.headerPopupIcon} onPress={onOpenCart}>
                                    <Ionicons name="cart-outline" size={24} color="#1E293B" />
                                    {cartCount > 0 && (
                                        <View style={{
                                            position: 'absolute',
                                            top: -6,
                                            right: -6,
                                            backgroundColor: '#EF4444',
                                            borderRadius: 10,
                                            width: 18,
                                            height: 18,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderWidth: 2,
                                            borderColor: '#fff'
                                        }}>
                                            <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{cartCount}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {/* Hero Image */}
                            <Image
                                source={foodData?.image}
                                style={styles.heroImage}
                            />

                            <View style={styles.contentCard}>
                                <View style={styles.titleRow}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.foodTitle}>{foodData?.title || 'Cauliflower Rice Bowl'}</Text>
                                        <Text style={styles.restaurantName}>{foodData?.restaurant || 'Healthy Kitchen'}</Text>
                                    </View>
                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="star" size={17} color="#FFB800" />
                                        <Text style={styles.ratingValue}>4.9</Text>
                                    </View>
                                </View>

                                <Text style={styles.description}>
                                    Campuran lezat dari kembang kol yang dicincang halus sebagai pengganti nasi, disajikan dengan berbagai sayuran segar dan saus spesial yang rendah gula.
                                </Text>

                                {/* Price & Counter */}
                                {foodData?.price !== 'Restoran Terverifikasi' && (
                                    <View style={styles.priceRow}>
                                        <Text style={styles.priceText}>{foodData?.price || 'Rp 35.000'}</Text>
                                        <View style={styles.counter}>
                                            <TouchableOpacity
                                                onPress={() => setMainQuantity(Math.max(1, mainQuantity - 1))}
                                                style={styles.counterBtn}
                                            >
                                                <Ionicons name="remove" size={20} color="#4285F4" />
                                            </TouchableOpacity>
                                            <View style={styles.quantityDisplay}>
                                                <Text style={styles.quantityText}>{mainQuantity}</Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => setMainQuantity(mainQuantity + 1)}
                                                style={styles.counterBtn}
                                            >
                                                <Ionicons name="add" size={20} color="#4285F4" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                {/* Menu Lainnya Section */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Menu Lainnya</Text>
                                    {OTHER_MENUS.map((menu) => (
                                        <View key={menu.id} style={styles.otherMenuCard}>
                                            <Image
                                                source={menu.image}
                                                style={styles.otherMenuImg}
                                            />
                                            <View style={styles.otherMenuInfo}>
                                                <Text style={styles.otherMenuTitle}>{menu.title}</Text>
                                                <Text style={styles.otherMenuSub}>{menu.restaurant}</Text>
                                                <View style={styles.miniRating}>
                                                    <Ionicons name="star" size={17} color="#FFB800" />
                                                    <Text style={styles.miniRatingText}>{menu.rating}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.otherMenuRight}>
                                                <View style={styles.miniCounter}>
                                                    <TouchableOpacity onPress={() => updateOtherQuantity(menu.id, -1)}>
                                                        <Ionicons name="remove-circle-outline" size={24} color="#4285F4" />
                                                    </TouchableOpacity>
                                                    <View style={styles.miniQuantity}>
                                                        <Text style={styles.miniQuantityText}>{quantities[menu.id] || 0}</Text>
                                                    </View>
                                                    <TouchableOpacity onPress={() => updateOtherQuantity(menu.id, 1)}>
                                                        <Ionicons name="add-circle" size={24} color="#4285F4" />
                                                    </TouchableOpacity>
                                                </View>
                                                <Text style={styles.otherPrice}>{menu.price}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>

                                {/* Reviews Section */}
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Ulasan & Rating</Text>
                                    <View style={styles.ratingOverview}>
                                        <View style={styles.ratingLeft}>
                                            <Text style={styles.bigRatingText}>4.9</Text>
                                            <View style={styles.starRow}>
                                                {[1, 2, 3, 4, 5].map(s => <Ionicons key={s} name="star" size={16} color="#FFB800" />)}
                                            </View>
                                            <Text style={styles.globalRatingText}>Rating Global</Text>
                                        </View>
                                        <View style={styles.ratingBars}>
                                            {[5, 4, 3, 2, 1].map((star) => (
                                                <View key={star} style={styles.barItem}>
                                                    <Text style={styles.barNumber}>{star}</Text>
                                                    <Ionicons name="star" size={10} color="#FFB800" style={{ marginHorizontal: 4 }} />
                                                    <View style={styles.barBg}>
                                                        <View style={[styles.barFill, { width: star === 5 ? '85%' : star === 4 ? '12%' : '3%' }]} />
                                                    </View>
                                                    <Text style={styles.barCount}>{star === 5 ? '120' : star === 4 ? '29' : '1'}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>

                                    {REVIEWS.map((review) => (
                                        <View key={review.id} style={styles.reviewCard}>
                                            <View style={styles.reviewHeader}>
                                                <Image
                                                    source={{ uri: review.avatar }}
                                                    style={styles.reviewerAvatar}
                                                />
                                                <View style={{ flex: 1, marginLeft: 12 }}>
                                                    <Text style={styles.reviewerName}>{review.name}</Text>
                                                    <View style={styles.starRow}>
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <Ionicons
                                                                key={s}
                                                                name={s <= review.rating ? "star" : "star-outline"}
                                                                size={14}
                                                                color="#FFB800"
                                                            />
                                                        ))}
                                                    </View>
                                                </View>
                                            </View>
                                            <Text style={styles.reviewText}>{review.text}</Text>
                                            <Text style={styles.reviewTime}>{review.time}</Text>
                                        </View>
                                    ))}

                                    <TouchableOpacity style={styles.seeAllReviewsBtn}>
                                        <Text style={styles.seeAllReviewsText}>Lihat Semua Review</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>

                        {/* Bottom Action Bar */}
                        <View style={[styles.bottomBar, { paddingBottom: Platform.OS === 'ios' ? 34 : 20 }]}>
                            <TouchableOpacity style={styles.miniCartBtn} onPress={onAddToCart}>
                                <Ionicons name="cart-outline" size={24} color="#4285F4" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.orderBtn}
                                activeOpacity={0.8}
                                onPress={handleOrder}
                            >
                                <Text style={styles.orderBtnText}>Order Now</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : null}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
    },
    headerFloating: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    headerPopupIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 5,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    heroImage: {
        width: width,
        height: 400,
        resizeMode: 'cover',
    },
    contentCard: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -30,
        paddingHorizontal: 20,
        paddingTop: 32,
    },
    scrollContent: {
        paddingBottom: 160,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    foodTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1E293B',
    },
    restaurantName: {
        fontSize: 14,
        color: '#4285F4',
        fontWeight: '600',
        marginTop: 4,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    ratingValue: {
        fontSize: 14,
        fontWeight: '800',
        marginLeft: 4,
        color: '#FFB800',
    },
    description: {
        fontSize: 16,
        color: '#64748B',
        lineHeight: 24,
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    priceText: {
        fontSize: 22,
        fontWeight: '900',
        color: '#4285F4',
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 30,
        padding: 4,
    },
    counterBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityDisplay: {
        paddingHorizontal: 16,
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    section: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 20,
    },
    otherMenuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    otherMenuImg: {
        width: 80,
        height: 80,
        borderRadius: 16,
    },
    otherMenuInfo: {
        flex: 1,
        marginLeft: 16,
    },
    otherMenuTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    otherMenuSub: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 4,
    },
    miniRating: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    miniRatingText: {
        fontSize: 14,
        fontWeight: '800',
        marginLeft: 4,
        color: '#FFB800',
    },
    otherMenuRight: {
        alignItems: 'flex-end',
    },
    miniCounter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    miniQuantity: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    miniQuantityText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    otherPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4285F4',
    },
    ratingOverview: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
    },
    ratingLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 20,
        borderRightWidth: 1,
        borderRightColor: '#E2E8F0',
    },
    bigRatingText: {
        fontSize: 48,
        fontWeight: '900',
        color: '#1E293B',
    },
    starRow: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    globalRatingText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    ratingBars: {
        flex: 1,
        paddingLeft: 20,
        justifyContent: 'center',
    },
    barItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    barNumber: {
        fontSize: 12,
        color: '#64748B',
        width: 10,
    },
    barBg: {
        flex: 1,
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        marginHorizontal: 8,
    },
    barFill: {
        height: '100%',
        backgroundColor: '#FFB800',
        borderRadius: 3,
    },
    barCount: {
        fontSize: 11,
        color: '#64748B',
        width: 25,
        textAlign: 'right',
    },
    reviewCard: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    reviewerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    reviewerName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    reviewText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
        marginBottom: 8,
    },
    reviewTime: {
        fontSize: 12,
        color: '#94A3B8',
    },
    seeAllReviewsBtn: {
        marginTop: 24,
        height: 52,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    seeAllReviewsText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#4285F4',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    miniCartBtn: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    orderBtn: {
        flex: 1,
        height: 56,
        backgroundColor: '#4285F4',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    orderBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default FoodDetailScreen;
