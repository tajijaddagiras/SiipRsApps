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
    onPatientList?: () => void;
    userData: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
    onEditProfile,
    onMealActivity,
    onAddAddress,
    onSecurityAccount,
    onLogout,
    onOpenPremium,
    onPatientList,
    userData
}) => {

    return (
        <View style={styles.container}>
            {/* Shared Header is now handled in HomeScreen */}

            <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 180 }}
            >
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: userData?.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                            style={styles.avatarImage}
                            transition={300}
                        />
                    </View>
                    <Text style={styles.userName}>{userData?.name || 'User'}</Text>
                    <Text style={styles.userEmail}>{userData?.email || 'email@example.com'}</Text>
                </View>

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    <MenuItem icon="person-outline" label="Informasi Pribadi" onPress={onEditProfile} />
                    <MenuItem icon="people-outline" label="Daftar Pasien" onPress={onPatientList} />
                    <MenuItem icon="shield-checkmark-outline" label="Keamanan Akun" onPress={onSecurityAccount} />
                    <MenuItem icon="log-out-outline" label="Keluar" onPress={onLogout} />
                </View>
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
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
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
});

export default ProfileScreen;
