import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    Animated,
    Dimensions,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from './AppHeader';
import { Colors } from '../styles/theme';

const { width, height } = Dimensions.get('window');

interface CheckoutScreenProps {
    isVisible: boolean;
    onClose: () => void;
    foodData: any;
    checkoutOpacity?: Animated.Value;
    onOpenPaymentVA: (amountVal: string) => void;
    onPayCash: () => void;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
    isVisible,
    onClose,
    foodData,
    checkoutOpacity = new Animated.Value(0),
    onOpenPaymentVA,
    onPayCash
}) => {
    const [quantity, setQuantity] = useState(1);
    const [deliveryPartner, setDeliveryPartner] = useState<'Gojek' | 'Gofood'>('Gojek');
    const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'Transfer'>('Tunai');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');

    // Parse price from foodData string (e.g., "Rp 35.000" -> 35000)
    const getPriceValue = (priceStr: string | undefined) => {
        if (!priceStr) return 0;
        // Remove non-numeric characters except for formatting
        const numericString = priceStr.replace(/[^0-9]/g, '');
        return parseInt(numericString, 10) || 0;
    };

    const basePrice = getPriceValue(foodData?.price) || 35000;
    const ongkir = 3000;

    // Check if coming from Cart (multiple items bundled) - Logic depends on how App.tsx handles it
    // App.tsx currently sums total into 'price' string for bundle.
    // So parsing 'price' string works for both single item and cart bundle.
    // HOWEVER: For single item, quantity is local. For cart bundle, quantity is effectively 1 (bundle).
    const isBundle = foodData?.items && foodData.items.length > 0;
    const finalQuantity = isBundle ? 1 : quantity;

    const total = (basePrice * finalQuantity) + ongkir;

    const formatCurrency = (val: number) => {
        return `Rp ${val.toLocaleString('id-ID')}`;
    };

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: checkoutOpacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    zIndex: 2800
                }
            ]}
        >
            <SafeAreaView style={styles.container}>
                <AppHeader
                    title="Pesanan"
                    showBack
                    onBack={onClose}
                    align="center"
                    variant="popup"
                />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Pesanan Card */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Pesanan</Text>
                    </View>
                    <View style={styles.orderCard}>
                        <Image
                            source={foodData?.image || require('../assets/images/insight_nutrition.png')}
                            style={styles.orderImage}
                        />
                        <View style={styles.orderInfo}>
                            <Text style={styles.foodTitle} numberOfLines={1}>{foodData?.title || 'Cauliflower Rice Bowl'}</Text>
                            <Text style={styles.restaurantName}>{foodData?.restaurant || 'Healthy Kitchen'}</Text>

                            <View style={styles.quantityControl}>
                                <TouchableOpacity
                                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                    style={styles.qtyBtn}
                                >
                                    <Ionicons name="remove" size={18} color="#4285F4" />
                                </TouchableOpacity>
                                <View style={styles.qtyBadge}>
                                    <Text style={styles.qtyText}>{quantity}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setQuantity(quantity + 1)}
                                    style={styles.qtyBtn}
                                >
                                    <Ionicons name="add" size={18} color="#4285F4" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Delivery Options */}
                    <View style={styles.deliveryRow}>
                        <TouchableOpacity
                            style={[styles.deliveryTab, deliveryPartner === 'Gojek' && styles.activeDeliveryTab]}
                            onPress={() => setDeliveryPartner('Gojek')}
                        >
                            <Text style={[styles.deliveryTabText, deliveryPartner === 'Gojek' && styles.activeDeliveryTabText]}>Gojek</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.deliveryTab, deliveryPartner === 'Gofood' && styles.activeDeliveryTab]}
                            onPress={() => setDeliveryPartner('Gofood')}
                        >
                            <Text style={[styles.deliveryTabText, deliveryPartner === 'Gofood' && styles.activeDeliveryTabText]}>Gofood</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Payment Method */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Pilih Metode Pembayaran</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === 'Tunai' && styles.activePaymentOption]}
                        onPress={() => setPaymentMethod('Tunai')}
                    >
                        <View style={styles.paymentLeft}>
                            <View style={[styles.paymentIconBg, { backgroundColor: '#EFF6FF' }]}>
                                <Ionicons name="cash-outline" size={20} color="#4285F4" />
                            </View>
                            <Text style={styles.paymentName}>Tunai</Text>
                        </View>
                        <Ionicons
                            name={paymentMethod === 'Tunai' ? "checkmark-circle" : "ellipse-outline"}
                            size={22}
                            color={paymentMethod === 'Tunai' ? "#4285F4" : "#E2E8F0"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.paymentOption, paymentMethod === 'Transfer' && styles.activePaymentOption]}
                        onPress={() => setPaymentMethod('Transfer')}
                    >
                        <View style={styles.paymentLeft}>
                            <View style={[styles.paymentIconBg, { backgroundColor: '#F8FAFC' }]}>
                                <Ionicons name="card-outline" size={20} color="#64748B" />
                            </View>
                            <Text style={styles.paymentName}>Transfer Bank (VA)</Text>
                        </View>
                        <Ionicons
                            name={paymentMethod === 'Transfer' ? "checkmark-circle" : "ellipse-outline"}
                            size={22}
                            color={paymentMethod === 'Transfer' ? "#4285F4" : "#E2E8F0"}
                        />
                    </TouchableOpacity>

                    {/* Payment Details */}
                    <View style={styles.detailCard}>
                        <Text style={styles.detailTitle}>Detail Pembayaran</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Subtotal Produk</Text>
                            <Text style={styles.detailValue}>{formatCurrency(basePrice * quantity)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Ongkir</Text>
                            <Text style={styles.detailValue}>{formatCurrency(ongkir)}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Biaya Layanan</Text>
                            <Text style={styles.detailValue}>Rp 0</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Pembayaran</Text>
                            <Text style={[styles.totalValue, { flex: 1, textAlign: 'right', flexWrap: 'wrap' }]}>
                                {formatCurrency(total).toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    {/* Delivery Address */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Contoh: Jl. Setia Budi No 109.."
                            placeholderTextColor="#94A3B8"
                            value={address}
                            onChangeText={setAddress}
                            multiline
                        />
                    </View>

                    {/* Notes */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Catatan Pesanan (Opsional)</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Contoh: Tidak pakai sambel.."
                            placeholderTextColor="#94A3B8"
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                        />
                    </View>
                </ScrollView>

                {/* Footer Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.bayarBtn}
                        activeOpacity={0.8}
                        onPress={() => {
                            if (paymentMethod === 'Transfer') {
                                // onClose(); // REMOVED: Do not close checkout immediately to preventing flickering (revealing detail screen)
                                // Let App.tsx handle the cleanup when PaymentVA opens or finishes.
                                onOpenPaymentVA(formatCurrency(total));
                            } else {
                                // Cash Payment: Direct to loading
                                onPayCash();
                            }
                        }}
                    >
                        <Text style={styles.bayarBtnText}>Bayar Sekarang</Text>
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
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    sectionHeader: {
        marginTop: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    orderImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    orderInfo: {
        flex: 1,
        marginLeft: 16,
    },
    foodTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    restaurantName: {
        fontSize: 13,
        color: '#4285F4',
        fontWeight: '600',
        marginTop: 2,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    qtyBtn: {
        paddingHorizontal: 8,
    },
    qtyBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    qtyText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    deliveryRow: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 12,
    },
    deliveryTab: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeDeliveryTab: {
        backgroundColor: '#DBEAFE',
        borderColor: '#4285F4',
    },
    deliveryTabText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4285F4',
    },
    activeDeliveryTabText: {
        color: '#4285F4',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    activePaymentOption: {
        borderColor: '#4285F4',
        backgroundColor: '#F0F7FF',
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentIconBg: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    paymentName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
    },
    detailCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    detailTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    detailLabel: {
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Allow text to wrap and grow downwards
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
        marginTop: 4, // Align with the text if it wraps
    },
    totalValue: {
        flex: 1, // Take available space
        fontSize: 16,
        fontWeight: '900',
        color: '#1E293B',
        textAlign: 'right', // Align right
        flexWrap: 'wrap', // Enable wrapping
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    textInput: {
        fontSize: 14,
        color: '#334155',
        minHeight: 40,
        textAlignVertical: 'top',
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    bayarBtn: {
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
    bayarBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default React.memo(CheckoutScreen);
