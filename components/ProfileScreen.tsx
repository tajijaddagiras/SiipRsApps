import * as React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AppHeader from './AppHeader';
import { Colors } from '../styles/theme';

const { width } = Dimensions.get('window');

interface ProfileScreenProps {
    onEditProfile?: () => void;
    onMealActivity?: () => void;
    onAddAddress?: () => void;
    onSecurityAccount?: () => void;
    onLogout?: () => void;
    onOpenPremium?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
    onEditProfile,
    onMealActivity,
    onAddAddress,
    onSecurityAccount,
    onLogout,
    onOpenPremium
}) => {
    const xpCurrent = 850;
    const xpMax = 1000;
    const xpProgress = xpCurrent / xpMax;

    return (
        <View style={styles.container}>
            {/* Global Header */}
            <AppHeader
                title="Profil Saya"
                subtitle="Informasi dan pengaturan akun"
                titleStyle={{ fontSize: 24 }}
            />

            <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                            style={styles.avatarImage}
                            transition={300}
                        />
                    </View>
                    <Text style={styles.userName}>Kelompok</Text>
                    <Text style={styles.userLevel}>Level 12 Pro Member</Text>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconBg, { backgroundColor: '#F97316' }]}>
                            <Ionicons name="flame" size={24} color="#fff" />
                        </View>
                        <Text style={styles.statLabel}>STREAK</Text>
                        <Text style={styles.statValue}>14 Hari</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconBg, { backgroundColor: '#3B82F6' }]}>
                            <MaterialCommunityIcons name="target" size={24} color="#fff" />
                        </View>
                        <Text style={styles.statLabel}>TARGET</Text>
                        <Text style={styles.statValue}>95%</Text>
                    </View>
                </View>

                {/* XP Progress */}
                <View style={styles.xpContainer}>
                    <Text style={styles.xpLabel}>PROGRESS LEVEL</Text>
                    <View style={styles.xpRow}>
                        <Text style={styles.xpValue}>{xpCurrent} / {xpMax.toLocaleString('id-ID')} XP</Text>
                        <TouchableOpacity>
                            <Text style={styles.xpLink}>{xpMax - xpCurrent} XP KE LEVEL 13</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.xpBarBg}>
                        <View style={[styles.xpBarFill, { width: `${xpProgress * 100}%` }]} />
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    <MenuItem icon="person-outline" label="Informasi Pribadi" onPress={onEditProfile} />
                    <MenuItem icon="time-outline" label="Aktifitas Meals" onPress={onMealActivity} />
                    <MenuItem icon="location-outline" label="Lokasi" onPress={onAddAddress} />
                    <MenuItem icon="shield-checkmark-outline" label="Keamanan Akun" onPress={onSecurityAccount} />
                    <MenuItem icon="log-out-outline" label="Keluar" onPress={onLogout} />
                </View>

                {/* Premium Banner - Orange Gradient */}
                <LinearGradient
                    colors={['#FBBF24', '#F97316']}
                    style={styles.premiumBanner}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.premiumContent}>
                        <View style={styles.premiumTextArea}>
                            <Text style={styles.premiumTitle}>Tingkatkan ke Premium</Text>
                            <Text style={styles.premiumDesc}>
                                Dapatkan dukungan ahli gizi kapan pun Anda butuhkan untuk hidup lebih sehat bersama diabetes.
                            </Text>
                        </View>
                        <View style={styles.crownContainer}>
                            <FontAwesome5 name="crown" size={36} color="#fff" />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.premiumBtn} onPress={onOpenPremium}>
                        <Text style={styles.premiumBtnText}>Lihat Paket Premium</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </ScrollView>
        </View>
    );
};

const MenuItem = ({ icon, label, onPress }: { icon: string, label: string, onPress?: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuIconContainer}>
            <Ionicons name={icon as any} size={22} color="#3B82F6" />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
        <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FE',
    },
    scrollContent: {
        flex: 1,
        paddingTop: 20,
    },
    profileCard: {
        backgroundColor: '#1E293B',
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 24,
        borderWidth: 4,
        borderColor: '#3B82F6',
        padding: 2,
        backgroundColor: '#fff',
        overflow: 'hidden',
        marginBottom: 16,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 18,
    },
    userName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 4,
    },
    userLevel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 16,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    statIconBg: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 1,
        marginBottom: 6,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1E293B',
    },
    xpContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    xpLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.5,
        marginBottom: 10,
    },
    xpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    xpValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1E293B',
    },
    xpLink: {
        fontSize: 12,
        fontWeight: '700',
        color: '#3B82F6',
    },
    xpBarBg: {
        height: 10,
        backgroundColor: '#F1F5F9',
        borderRadius: 5,
        overflow: 'hidden',
    },
    xpBarFill: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 5,
    },
    menuSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
    },
    premiumBanner: {
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 24,
    },
    premiumContent: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    premiumTextArea: {
        flex: 1,
        paddingRight: 12,
    },
    premiumTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 10,
    },
    premiumDesc: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.95)',
        lineHeight: 20,
    },
    crownContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    premiumBtn: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    premiumBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#F97316',
    },
});

export default ProfileScreen;
