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
    useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ProfileScreen from './ProfileScreen';
import { Colors } from '../styles/theme';
import { BASE_URL } from '../constants/config';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
    homeOpacity: Animated.Value;
    showHome: boolean;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onOpenNotifications: () => void;
    onOpenScanner: () => void;
    onOpenManualInput: () => void;
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
    onMealActivity: () => void;
    onOpenAddAddress: () => void;
    onOpenSecurityAccount: () => void;
    onLogout: () => void;
    onOpenPremium: () => void;
    onOpenPatientRegistration?: () => void;
    onPatientList?: () => void;
    onDetailPatientPress?: (patient: any) => void;
    logs: any[];
    user: any;
    stats: any;
    unreadCount: number;
    totalPatients?: number;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
    homeOpacity,
    showHome,
    activeTab,
    setActiveTab,
    onOpenNotifications,
    onOpenScanner,
    onOpenManualInput,
    onOpenEditProfile,
    onMealActivity,
    onOpenAddAddress,
    onOpenSecurityAccount,
    onLogout,
    onOpenPremium,
    onOpenPatientRegistration,
    onPatientList,
    onDetailPatientPress,
    logs,
    user,
    stats,
    unreadCount,
    totalPatients
}) => {
    const { width: windowWidth } = useWindowDimensions();
    const isDesktop = windowWidth > 768;

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
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>

                {/* Shared Header - Show on All Tabs */}
                <View style={styles.header}>
                    {activeTab === 'Profile' ? (
                        /* Profile Header Content */
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: '900', color: '#1E293B' }}>Profil Saya</Text>
                        </View>
                    ) : (
                        /* Standard Header Content */
                        <>
                            <View style={styles.headerLeft}>
                                <View style={styles.logoCircle}>
                                    <Image
                                        source={require('../assets/images/logo.png')}
                                        style={styles.headerLogo}
                                        contentFit="contain"
                                    />
                                </View>
                                <View style={styles.headerTitleGroup}>
                                    <View style={styles.siipRow}>
                                        <Text style={styles.siipText}>SIIP-RS</Text>
                                    </View>
                                    <Text style={styles.hospitalText}>RS ESA UNGGUL</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.notifButton} onPress={onOpenNotifications}>
                                <Ionicons name="notifications-outline" size={28} color="#000" />
                                {unreadCount > 0 && <View style={styles.notifBadge} />}
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {activeTab === 'Home' && (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {/* 2. Stats Section */}
                        <View style={styles.statsContainer}>
                            <View style={[styles.statCard, styles.statCardBlue]}>
                                <Text style={styles.statLabelBlue}>TOTAL PASIEN</Text>
                                <Text style={styles.statValueBlue}>{totalPatients || 0}</Text>
                            </View>
                            <View style={styles.statCardWhite}>
                                <Text style={styles.statLabelGray}>BERHASIL</Text>
                                <Text style={[styles.statValueGreen]}>{stats?.successCount || 0}</Text>
                            </View>
                            <View style={styles.statCardWhite}>
                                <Text style={styles.statLabelGray}>ALERT</Text>
                                <Text style={[styles.statValueRed]}>{stats?.alertCount || 0}</Text>
                            </View>
                        </View>

                        {/* 3. Aksi Cepat Section */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Aksi Cepat</Text>
                        </View>
                        {isDesktop ? (
                            /* Desktop: Row Layout like Stats Cards */
                            <View style={styles.actionRowDesktop}>
                                <TouchableOpacity style={styles.actionCardMainDesktop} onPress={onOpenScanner}>
                                    <View style={styles.actionIconContainerBlue}>
                                        <MaterialCommunityIcons name="view-grid-plus-outline" size={32} color="#fff" />
                                    </View>
                                    <Text style={styles.actionLabelWhite}>Scan Gelang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionCardSecondaryDesktop} onPress={onOpenManualInput}>
                                    <View style={styles.actionIconContainerLighter}>
                                        <MaterialCommunityIcons name="keyboard-outline" size={32} color="#4285F4" />
                                    </View>
                                    <Text style={styles.actionLabelGray}>Input Manual</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionCardSecondaryDesktop} onPress={onOpenPatientRegistration}>
                                    <View style={styles.actionIconContainerLighter}>
                                        <MaterialCommunityIcons name="account-plus-outline" size={32} color="#4285F4" />
                                    </View>
                                    <Text style={styles.actionLabelGray}>Pendaftaran Pasien</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            /* Mobile: Horizontal Scroll */
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.actionScrollContent}
                            >
                                <TouchableOpacity style={styles.actionCardMain} onPress={onOpenScanner}>
                                    <View style={styles.actionIconContainerBlue}>
                                        <MaterialCommunityIcons name="view-grid-plus-outline" size={32} color="#fff" />
                                    </View>
                                    <Text style={styles.actionLabelWhite}>Scan Gelang</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionCardSecondary} onPress={onOpenManualInput}>
                                    <View style={styles.actionIconContainerLighter}>
                                        <MaterialCommunityIcons name="keyboard-outline" size={32} color="#4285F4" />
                                    </View>
                                    <Text style={styles.actionLabelGray}>Input Manual</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionCardSecondary} onPress={onOpenPatientRegistration}>
                                    <View style={styles.actionIconContainerLighter}>
                                        <MaterialCommunityIcons name="account-plus-outline" size={32} color="#4285F4" />
                                    </View>
                                    <Text style={styles.actionLabelGray}>Pendaftaran Pasien</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        )}

                        {/* 4. Log Terbaru Section */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Log Terbaru</Text>
                            <TouchableOpacity>
                                <Text style={styles.lihatSemua}>Lihat Semua</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.logList}>
                            {logs && logs.length > 0 ? (
                                logs.slice(0, 5).map((log, index) => (
                                    <TouchableOpacity
                                        key={log.id || index}
                                        style={styles.logCard}
                                        onPress={() => log.patient && onDetailPatientPress?.(log.patient)}
                                    >
                                        <View style={[
                                            styles.logIconContainerGreen,
                                            log.type === 'REGISTER' && { backgroundColor: '#DBEAFE' }
                                        ]}>
                                            <Ionicons
                                                name={log.type === 'REGISTER' ? "person-add" : "checkmark"}
                                                size={24}
                                                color={log.type === 'REGISTER' ? "#2563EB" : "#22C55E"}
                                            />
                                        </View>
                                        <View style={styles.logContent}>
                                            <Text style={styles.logPatientName}>
                                                {log.patient?.name || 'Pasien Umum'}
                                            </Text>
                                            <Text style={styles.logAction}>
                                                {log.description}  •  {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </View>
                                        <Text style={styles.logId}>{log.patient?.mrn || 'N/A'}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={[styles.logCard, { justifyContent: 'center', borderStyle: 'dashed' }]}>
                                    <Text style={{ color: '#94A3B8', fontWeight: 'bold' }}>Belum ada aktivitas terbaru</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                )}

                {/* Tindakan Tab - Unverified Identity State */}
                {activeTab === 'Tindakan' && (
                    <View style={styles.tindakanContainer}>
                        {/* Unverified State Content */}
                        <View style={styles.unverifiedContent}>
                            <View style={styles.unverifiedIconContainer}>
                                <Ionicons name="person-circle-outline" size={80} color="#A0C4FF" />
                            </View>
                            <Text style={styles.unverifiedTitle}>Identitas Belum Terverifikasi</Text>
                            <Text style={styles.unverifiedDescription}>
                                Wajib memverifikasi identitas pasien melalui menu{'\n'}scan atau input manual sebelum melakukan{'\n'}Tindakan.
                            </Text>

                            {/* Action Buttons */}
                            <View style={styles.actionButtonsRow}>
                                <TouchableOpacity style={styles.scanBarcodeButton} onPress={onOpenScanner}>
                                    <Text style={styles.scanBarcodeText}>Scan Barcode</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.inputManualButton} onPress={onOpenManualInput}>
                                    <Text style={styles.inputManualText}>Input Manual</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Orders Tab */}
                {activeTab === 'Orders' && (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {logs && logs.length > 0 ? (
                            logs.map((log, index) => (
                                <TouchableOpacity
                                    key={log.id || index}
                                    style={styles.orderCard}
                                    onPress={() => log.patient && onDetailPatientPress?.(log.patient)}
                                >
                                    <View style={[
                                        styles.orderIndicator,
                                        { backgroundColor: log.type === 'REGISTER' ? '#10B981' : '#4285F4' }
                                    ]} />
                                    <View style={styles.orderContent}>
                                        <View style={styles.orderHeaderRow}>
                                            <Text style={styles.orderType}>
                                                {log.type === 'REGISTER' ? 'PENDAFTARAN' : 'TINDAKAN'}
                                            </Text>
                                            <Text style={styles.orderTime}>
                                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </View>
                                        <Text style={styles.orderPatientName}>{log.patient?.name || 'Pasien Umum'}</Text>
                                        <Text style={styles.orderDescription}>{log.description}</Text>
                                        <View style={styles.orderGroupRow}>
                                            <View style={styles.orderGroupBadge}>
                                                <Text style={styles.orderGroupText}>{user?.name || 'Petugas'}</Text>
                                            </View>
                                            {log.patient?.mrn && (
                                                <Text style={styles.orderIdText}>RM: {log.patient.mrn}</Text>
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={{ alignItems: 'center', marginTop: 100 }}>
                                <Text style={{ color: '#94A3B8', fontWeight: 'bold' }}>Belum ada data tindakan</Text>
                            </View>
                        )}
                    </ScrollView>
                )}

                {/* Profile Tab */}
                {activeTab === 'Profile' && (
                    <ProfileScreen
                        onEditProfile={onOpenEditProfile}
                        onMealActivity={onMealActivity}
                        onAddAddress={onOpenAddAddress}
                        onSecurityAccount={onOpenSecurityAccount}
                        onLogout={onLogout}
                        onOpenPremium={onOpenPremium}
                        onPatientList={onPatientList}
                        userData={user}
                    />
                )}

                {/* Bottom Tab Bar */}
                <View style={styles.bottomTabBar}>
                    {[
                        { icon: 'home', label: 'Home', activeValue: 'Home' },
                        { icon: 'clipboard', label: 'Tindakan', activeValue: 'Tindakan' },
                        { icon: 'time', label: 'Orders', activeValue: 'Orders' },
                        { icon: 'person', label: 'Profile', activeValue: 'Profile' },
                    ].map((tab, i) => {
                        const isSelected = activeTab === tab.activeValue;
                        return (
                            <TouchableOpacity
                                key={i}
                                style={[styles.tabItem, isSelected && styles.tabItemActive]}
                                onPress={() => setActiveTab(tab.activeValue)}
                            >
                                <Ionicons
                                    name={(isSelected ? tab.icon : tab.icon + '-outline') as any}
                                    size={isSelected ? 30 : 28}
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
        backgroundColor: '#fff',
        zIndex: 100,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 160,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoCircle: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 6,
    },
    headerLogo: {
        width: 40,
        height: 40,
    },
    headerTitleGroup: {
        justifyContent: 'center',
    },
    siipRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    siipText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#4285F4',
    },
    rsText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#4285F4',
    },
    hospitalText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '700',
        marginTop: -2,
    },
    notifButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notifBadge: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#EF4444',
        borderWidth: 2,
        borderColor: '#fff',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    statCard: {
        flex: 1.1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    statCardBlue: {
        backgroundColor: '#4285F4',
    },
    statCardWhite: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    statLabelBlue: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '800',
        marginBottom: 4,
    },
    statLabelGray: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '800',
        marginBottom: 4,
    },
    statValueBlue: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '900',
    },
    statValueGreen: {
        fontSize: 24,
        color: '#22C55E',
        fontWeight: '900',
    },
    statValueRed: {
        fontSize: 24,
        color: '#EF4444',
        fontWeight: '900',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#000',
    },
    actionScrollContent: {
        paddingRight: 24, // Space for last card
        gap: 16,
        paddingBottom: 24, // Shadow space
    },
    actionCardMain: {
        width: 135,
        height: 145,
        backgroundColor: '#4285F4',
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    actionCardSecondary: {
        width: 135,
        height: 145,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    // Desktop Styles for Action Cards
    actionRowDesktop: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    actionCardMainDesktop: {
        flex: 1.1,
        backgroundColor: '#4285F4',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    actionCardSecondaryDesktop: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    actionIconContainerBlue: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionIconContainerLighter: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#EEF4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionLabelWhite: {
        fontSize: 13,
        color: '#fff',
        fontWeight: '800',
        textAlign: 'center',
        marginTop: 6,
    },
    actionLabelGray: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '800',
        textAlign: 'center',
        marginTop: 6,
    },
    lihatSemua: {
        fontSize: 14,
        color: '#4285F4',
        fontWeight: '700',
    },
    logList: {
        gap: 12,
    },
    logCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
    logIconContainerGreen: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    logIconContainerRed: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    logContent: {
        flex: 1,
    },
    logPatientName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 2,
    },
    logTitleError: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 2,
    },
    logAction: {
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: '500',
    },
    logId: {
        fontSize: 12,
        color: '#CBD5E1',
        fontWeight: '600',
    },
    alarmText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#EF4444',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#F8F9FE',
    },
    placeholderText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1E293B',
        marginTop: 20,
        marginBottom: 8,
    },
    placeholderSubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
    },
    bottomTabBar: {
        position: 'absolute',
        bottom: 25,
        left: 24,
        right: 24,
        height: 100,
        backgroundColor: '#fff',
        borderRadius: 40,
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
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    tabItemActive: {
        backgroundColor: '#4285F4',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 5,
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 12,
        marginTop: 2,
    },
    // Tindakan Tab Styles
    tindakanContainer: {
        flex: 1,
        backgroundColor: '#F8F9FE',
    },
    tindakanHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    unverifiedContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 16,
        paddingBottom: 180,
    },
    unverifiedIconContainer: {
        marginBottom: 20,
    },
    unverifiedTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 12,
        textAlign: 'center',
    },
    unverifiedDescription: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    scanBarcodeButton: {
        backgroundColor: '#60A5FA',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
    },
    scanBarcodeText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 15,
    },
    inputManualButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    inputManualText: {
        color: '#1E293B',
        fontWeight: '700',
        fontSize: 15,
    },
    // Orders Tab Styles
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    orderIndicator: {
        width: 6,
        height: '100%',
    },
    orderContent: {
        flex: 1,
        padding: 16,
    },
    orderHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    orderType: {
        fontSize: 12,
        fontWeight: '800',
        color: '#64748B',
        textTransform: 'uppercase',
    },
    orderTime: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    orderPatientName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 4,
    },
    orderStatus: {
        fontSize: 12,
        fontWeight: '800',
        marginBottom: 12,
    },
    orderDescription: {
        fontSize: 14,
        color: '#94A3B8',
        fontStyle: 'italic',
        marginBottom: 12,
    },
    orderGroupRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderGroupBadge: {
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    orderGroupText: {
        color: '#2563EB',
        fontSize: 10,
        fontWeight: '800',
    },
    orderIdText: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
    },
});

export default React.memo(HomeScreen);
