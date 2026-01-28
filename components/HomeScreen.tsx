import * as React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Platform,
    Dimensions,
    Alert,
    TextInput
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BloodSugarGraph from './BloodSugarGraph';
import FoodScreen from './FoodScreen';
import ProfileScreen from './ProfileScreen';
import AppHeader from './AppHeader';
import { Colors } from '../styles/theme';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
    homeOpacity: Animated.Value;
    showHome: boolean;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onOpenNotifications: () => void;
    onOpenSearch: () => void;
    onOpenCheckBloodSugar: () => void;
    onOpenFoodInput: () => void;
    onOpenAnalysis: () => void;
    onOpenChat: () => void;
    onOpenInsightDetail: (insight: any) => void;
    onOpenFoodDetail: (food: any) => void;
    onJoinCommunity: () => void;
    cartCount: number;
    onOpenCart: () => void;
    onOpenEditProfile: () => void;
    onOpenMealActivity: () => void;
    onOpenAddAddress: () => void;
    onOpenSecurityAccount: () => void;
    onLogout: () => void;
    onOpenPremium: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
    homeOpacity,
    showHome,
    activeTab,
    setActiveTab,
    onOpenNotifications,
    onOpenSearch,
    onOpenCheckBloodSugar,
    onOpenFoodInput,
    onOpenAnalysis,
    onOpenChat,
    onOpenInsightDetail,
    onOpenFoodDetail,
    onJoinCommunity,
    cartCount,
    onOpenCart,
    onOpenEditProfile,
    onOpenMealActivity,
    onOpenAddAddress,
    onOpenSecurityAccount,
    onLogout,
    onOpenPremium
}) => {
    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.homeContainer,
                {
                    opacity: homeOpacity,
                    pointerEvents: showHome ? 'auto' : 'none',
                }
            ]}
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
                {/* Fixed Food Header (Explor Rasa) */}
                {activeTab === 'Food' && (
                    <AppHeader
                        title="Eksplor Rasa"
                        subtitle="Nutrisi tepat, gula darah terjaga"
                        titleStyle={{ fontSize: 24 }}
                        rightElement={
                            <TouchableOpacity style={styles.cartButton} onPress={onOpenCart}>
                                <Ionicons name="cart-outline" size={24} color="#64748B" />
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
                        }
                    />
                )}

                {/* Fixed Home Header (Avatar + Greeting + Icons) */}
                {activeTab === 'Home' && (
                    <AppHeader
                        leftElement={
                            <Image
                                source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
                                style={styles.avatarImage}
                                transition={200}
                                cachePolicy="memory-disk"
                            />
                        }
                        title="Selamat Datang"
                        subtitle="Kelompok"
                        titleStyle={styles.welcomeText}
                        subtitleStyle={styles.userNameText}
                        rightElement={
                            <View style={styles.headerRight}>
                                <TouchableOpacity
                                    style={styles.headerIconButton}
                                    onPress={onOpenSearch}
                                >
                                    <Ionicons name="search-outline" size={22} color="#000" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.headerIconButton} onPress={onOpenNotifications}>
                                    <Ionicons name="notifications-outline" size={22} color="#000" />
                                    <View style={styles.notificationBadge} />
                                </TouchableOpacity>
                            </View>
                        }
                    />
                )}

                {/* Profile Tab - Rendered separately, not inside ScrollView */}
                {activeTab === 'Profile' && (
                    <ProfileScreen
                        onEditProfile={onOpenEditProfile}
                        onMealActivity={onOpenMealActivity}
                        onAddAddress={onOpenAddAddress}
                        onSecurityAccount={onOpenSecurityAccount}
                        onLogout={onLogout}
                        onOpenPremium={onOpenPremium}
                    />
                )}

                {/* ScrollView only for Home and Food tabs */}
                {activeTab !== 'Profile' && (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Home Tab Content */}
                        {activeTab === 'Home' && (
                            <View style={styles.homeContent}>
                                {/* Blood Sugar Graph Component */}
                                <BloodSugarGraph onOpenAnalysis={onOpenAnalysis} />

                                {/* Quick Actions */}
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Tindakan Cepat</Text>
                                </View>
                                <View style={styles.quickActionsGrid}>
                                    {[
                                        { icon: 'pulse-outline', label: 'Cek Gula', color: '#4285F4', onPress: onOpenCheckBloodSugar },
                                        { icon: 'add-outline', label: 'Input Makan', color: '#FF9800', onPress: onOpenFoodInput },
                                        { icon: 'people-outline', label: 'Obrolan', color: '#4CAF50', onPress: onOpenChat },
                                    ].map((action, i) => (
                                        <TouchableOpacity key={i} style={styles.actionCard} onPress={action.onPress}>
                                            <View style={[styles.actionIconBg, { backgroundColor: action.color + '15' }]}>
                                                <Ionicons name={action.icon as any} size={28} color={action.color} />
                                            </View>
                                            <Text style={styles.actionLabel}>{action.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Insights Section */}
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Wawasan Baru</Text>
                                    <TouchableOpacity>
                                        <Text style={styles.seeAll}>Lihat Semua</Text>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.insightsScroll}
                                >
                                    {[
                                        { image: require('../assets/images/insight_nutrition.png'), title: 'Indeks Glikemik: Kunci Mengelola Gula Darah', tag: 'NUTRISI', tagColor: '#E6F7EF', textColor: '#00C853' },
                                        { image: require('../assets/images/insight_lifestyle.png'), title: 'Olahraga Aman dan Nyaman Bagi Penderita Diabetes', tag: 'LIFESTYLE', tagColor: '#FDF0F5', textColor: '#E91E63' },
                                    ].map((item, i) => (
                                        <TouchableOpacity
                                            key={i}
                                            style={styles.insightCard}
                                            onPress={() => onOpenInsightDetail(item)}
                                        >
                                            <Image
                                                source={item.image}
                                                style={styles.insightImage}
                                                transition={300}
                                                priority="normal"
                                            />
                                            <View style={styles.insightContent}>
                                                <View style={[styles.insightTag, { backgroundColor: item.tagColor }]}>
                                                    <Text style={[styles.insightTagText, { color: item.textColor }]}>{item.tag}</Text>
                                                </View>
                                                <Text style={styles.insightTitle} numberOfLines={2}>{item.title}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>

                                {/* Community Section - Exact as Reference */}
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Komunitas</Text>
                                </View>
                                <View style={styles.communityCard}>
                                    <Text style={styles.communityTitle} numberOfLines={1}>Pejuang Diabetes Indonesia</Text>
                                    <Text style={styles.communitySubtitle}>12,4k Anggota aktif saling mendukung.</Text>

                                    <View style={styles.avatarRow}>
                                        {[
                                            'https://randomuser.me/api/portraits/men/32.jpg',
                                            'https://randomuser.me/api/portraits/women/45.jpg',
                                            'https://randomuser.me/api/portraits/men/12.jpg',
                                            'https://randomuser.me/api/portraits/women/22.jpg'
                                        ].map((uri, i) => (
                                            <Image
                                                key={i}
                                                source={{ uri }}
                                                style={[styles.smallAvatar, { marginLeft: i === 0 ? 0 : -12 }]}
                                                transition={200}
                                            />
                                        ))}
                                        <View style={styles.moreAvatarsBadge}>
                                            <Text style={styles.moreAvatarsText}>+50</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={styles.gabungSekarangBtn}
                                        onPress={onJoinCommunity}
                                    >
                                        <Text style={styles.gabungSekarangText}>Gabung Sekarang</Text>
                                        <Ionicons name="arrow-forward" size={20} color={Colors.primary} style={{ marginLeft: 8 }} />
                                    </TouchableOpacity>

                                    {/* Background Decorator Circles */}
                                    <View style={[styles.decorCircle, { right: -20, bottom: -20, width: 120, height: 120, opacity: 0.1 }]} />
                                    <View style={[styles.decorCircle, { right: 40, bottom: -40, width: 80, height: 80, opacity: 0.05 }]} />
                                </View>
                            </View>
                        )}

                        {/* Food Tab Content */}
                        {activeTab === 'Food' && (
                            <FoodScreen
                                onOpenFoodInput={onOpenFoodInput}
                                onOpenFoodDetail={onOpenFoodDetail}
                                cartCount={cartCount}
                                onOpenCart={onOpenCart}
                            />
                        )}

                    </ScrollView>
                )}

                {/* Bottom Tab Bar */}
                <View style={styles.bottomTabBar}>
                    {[
                        { icon: 'home', label: 'Home' },
                        { icon: 'restaurant', label: 'Meals' },
                        { icon: 'person', label: 'Profile' },
                    ].map((tab, i) => {
                        const isSelected = activeTab === (tab.label === 'Meals' ? 'Food' : tab.label);
                        return (
                            <TouchableOpacity
                                key={i}
                                style={[styles.tabItem, isSelected && styles.tabItemActive]}
                                onPress={() => setActiveTab(tab.label === 'Meals' ? 'Food' : tab.label)}
                            >
                                <Ionicons
                                    name={(isSelected ? tab.icon : tab.icon + '-outline') as any}
                                    size={isSelected ? 20 : 26}
                                    color={isSelected ? '#fff' : '#A0A0A0'}
                                />
                                {isSelected && (
                                    <Text style={styles.activeTabText}>
                                        {tab.label}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    homeContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#F8F9FE',
        zIndex: 100,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E0E0E0',
    },
    greetingContainer: {
        marginLeft: 12,
    },
    welcomeText: {
        fontSize: 13,
        color: '#888',
        fontWeight: '400',
    },
    userNameText: {
        fontSize: 22,
        fontWeight: '900',
        color: '#000',
        marginTop: -2,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF5252',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    seeAll: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    actionCard: {
        width: (width - 48) / 3,
        alignItems: 'center',
        marginBottom: 16,
    },
    actionIconBg: {
        width: 64,
        height: 64,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionLabel: {
        fontSize: 12,
        color: '#000',
        fontWeight: '700',
    },
    insightsScroll: {
        paddingLeft: 24,
        paddingRight: 8,
        paddingBottom: 24,
    },
    insightCard: {
        width: 240,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginRight: 16,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    insightImage: {
        width: '100%',
        height: 140,
        borderRadius: 16,
    },
    insightContent: {
        padding: 12,
    },
    insightTag: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    insightTagText: {
        fontSize: 10,
        fontWeight: '900',
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        lineHeight: 22,
    },
    communityCard: {
        marginHorizontal: 24,
        backgroundColor: '#95C2FF', // Soft bright blue from reference
        borderRadius: 30,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
    },
    communityTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 8,
    },
    communitySubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 20,
    },
    avatarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    smallAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#95C2FF',
    },
    moreAvatarsBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -12,
        borderWidth: 2,
        borderColor: '#95C2FF',
    },
    moreAvatarsText: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: 'bold',
    },
    gabungSekarangBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    gabungSekarangText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    decorCircle: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 100,
    },
    bottomTabBar: {
        position: 'absolute',
        bottom: 25,
        left: 24,
        right: 24,
        height: 70,
        backgroundColor: '#fff',
        borderRadius: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        paddingHorizontal: 15,
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
    },
    tabItemActive: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 8,
    },
    cartButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    scrollContent: {
        paddingBottom: 140, // Increased unified clearance for premium feel
    },
    homeContent: {
        paddingTop: 20,
    },
    foodContent: {
        paddingTop: 20,
    },
    profileContent: {
        paddingTop: 20,
    },
});

export default React.memo(HomeScreen);
