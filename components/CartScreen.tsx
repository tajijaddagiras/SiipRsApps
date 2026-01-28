import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
    Animated
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from './AppHeader';
import { Colors } from '../styles/theme';

const { width } = Dimensions.get('window');

interface CartItem {
    id: number;
    title: string;
    restaurant: string;
    price: string;
    priceValue: number;
    quantity: number;
    image: any;
    selected: boolean;
}

interface CartScreenProps {
    isVisible: boolean;
    onClose: () => void;
    onCheckout: (items: any[]) => void;
    cartOpacity?: Animated.Value;
}

const CartScreen: React.FC<CartScreenProps> = ({ isVisible, onClose, onCheckout, cartOpacity = new Animated.Value(0) }) => {
    // Mock Data based on the user image
    const [cartItems, setCartItems] = useState<CartItem[]>([
        { id: 1, title: 'Cauliflower Rice Bowl', restaurant: 'Healthy Kitchen', price: 'Rp 25.000', priceValue: 25000, quantity: 1, image: require('../assets/images/insight_nutrition.png'), selected: true },
        { id: 2, title: 'Tofu Stir Fry', restaurant: 'Healthy Kitchen', price: 'Rp 25.000', priceValue: 25000, quantity: 1, image: require('../assets/images/insight_lifestyle.png'), selected: false },
        { id: 3, title: 'Buddha Bowl', restaurant: 'Healthy Kitchen', price: 'Rp 25.000', priceValue: 25000, quantity: 1, image: require('../assets/images/insight_community.png'), selected: false },
        { id: 4, title: 'Avocado Toast', restaurant: 'Healthy Kitchen', price: 'Rp 25.000', priceValue: 25000, quantity: 1, image: require('../assets/images/onboarding_background.jpg'), selected: false }
    ]);

    const [selectAll, setSelectAll] = useState(false);

    const toggleSelection = (id: number) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, selected: !item.selected } : item
        ));
    };

    const toggleSelectAll = () => {
        const newValue = !selectAll;
        setSelectAll(newValue);
        setCartItems(prev => prev.map(item => ({ ...item, selected: newValue })));
    };

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const totalSelected = cartItems.filter(i => i.selected).reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);
    const selectedCount = cartItems.filter(i => i.selected).length;

    const formatCurrency = (val: number) => {
        return `Rp ${val.toLocaleString('id-ID').replace(/,/g, '.')}`;
    };

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: cartOpacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    zIndex: 2700,
                }
            ]}
        >
            <SafeAreaView style={styles.container}>
                <AppHeader
                    title="Keranjang"
                    align="center"
                    onBack={onClose}
                    showBack
                    containerStyle={{ backgroundColor: '#fff', borderBottomWidth: 0, elevation: 0 }}
                />

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {cartItems.map((item) => (
                        <View key={item.id} style={styles.cartItem}>
                            {/* Checkbox */}
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => toggleSelection(item.id)}
                            >
                                <Ionicons
                                    name={item.selected ? "radio-button-on" : "radio-button-off"}
                                    size={24}
                                    color={item.selected ? "#4285F4" : "#94A3B8"}
                                />
                            </TouchableOpacity>

                            {/* Details */}
                            <View style={styles.itemCard}>
                                <Image
                                    source={item.image}
                                    style={styles.itemImage}
                                    transition={0}
                                />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemRestaurant}>{item.restaurant}</Text>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.itemPrice}>{item.price}</Text>

                                        {/* Qty Control */}
                                        <View style={styles.qtyControl}>
                                            <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                                                <Ionicons name="remove" size={18} color="#94A3B8" />
                                            </TouchableOpacity>
                                            <View style={styles.qtyBadge}>
                                                <Text style={styles.qtyText}>{item.quantity}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                                                <Ionicons name="add" size={18} color="#4285F4" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Bottom Bar */}
                <View style={styles.bottomBar}>
                    <View style={styles.bottomLeft}>
                        <TouchableOpacity style={styles.selectAllRow} onPress={toggleSelectAll}>
                            <Ionicons
                                name={selectAll ? "radio-button-on" : "radio-button-off"}
                                size={24}
                                color={selectAll ? "#4285F4" : "#94A3B8"}
                            />
                            <Text style={styles.selectAllText}>Semua</Text>
                        </TouchableOpacity>
                        <Text style={styles.totalPrice}>{formatCurrency(totalSelected)}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.checkoutBtn}
                        activeOpacity={0.8}
                        onPress={() => {
                            if (selectedCount > 0) {
                                const selectedItems = cartItems.filter(i => i.selected);
                                onCheckout(selectedItems);
                            }
                        }}
                    >
                        <Text style={styles.checkoutBtnText}>Beli Sekarang</Text>
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
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 100,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkboxContainer: {
        marginRight: 12,
    },
    itemCard: {
        flex: 1,
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 2,
    },
    itemRestaurant: {
        fontSize: 12,
        color: '#94A3B8',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4285F4',
    },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    qtyText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectAllRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    selectAllText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#64748B',
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginLeft: 10,
    },
    checkoutBtn: {
        backgroundColor: '#4285F4',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    checkoutBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    }
});

export default React.memo(CartScreen);
