import * as React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/theme';
import AppHeader from './AppHeader';

const { width } = Dimensions.get('window');

interface NotificationItemProps {
    icon: string;
    title: string;
    description: string;
    time: string;
    isUnread?: boolean;
    iconColor?: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    icon,
    title,
    description,
    time,
    isUnread,
    iconColor = '#000'
}) => (
    <TouchableOpacity style={styles.notificationItem}>
        <View style={styles.iconContainer}>
            <Ionicons name={icon as any} size={24} color={iconColor} />
            {isUnread && <View style={styles.unreadDot} />}
        </View>
        <View style={styles.contentContainer}>
            <View style={styles.titleRow}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </View>
            <Text style={styles.itemDescription}>{description}</Text>
            <Text style={styles.itemTime}>{time}</Text>
        </View>
    </TouchableOpacity>
);

interface NotificationScreenProps {
    showNotifications: boolean;
    notificationsOpacity: Animated.Value;
    onClose: () => void;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({
    showNotifications,
    notificationsOpacity,
    onClose
}) => {
    return (
        <Animated.View
            style={[
                styles.overlay,
                {
                    opacity: notificationsOpacity,
                    pointerEvents: showNotifications ? 'auto' : 'none',
                    zIndex: 2000,
                }
            ]}
        >
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <AppHeader
                    title="Notifikasi"
                    showBack
                    onBack={onClose}
                    align="center"
                    variant="popup"
                />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Hari ini */}
                    <View style={styles.sectionDivider}>
                        <Text style={styles.sectionLabel}>Hari ini</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <NotificationItem
                        icon="restaurant"
                        title="Pesanan Anda sedang di proses"
                        description="Estimasi waktu 15 - 20 menit."
                        time="09:00 WIB"
                        isUnread={true}
                    />

                    {/* Kemarin */}
                    <View style={styles.sectionDivider}>
                        <Text style={styles.sectionLabel}>Kemarin</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <NotificationItem
                        icon="notifications-outline"
                        title="Pembaruan Sistem Tersedia"
                        description="Pembaruan sistem baru siap dipasang. Pembaruan ini mencakup peningkatan kinerja dan perbaikan bug."
                        time="08:00 WIB"
                    />

                    <NotificationItem
                        icon="shield-checkmark-outline"
                        title="Reset Kata Sandi Berhasil"
                        description="Kata sandi Anda telah berhasil diatur ulang. Jika Anda tidak meminta perubahan ini, harap segera hubungi dukungan."
                        time="07:00 WIB"
                    />
                </ScrollView>
            </SafeAreaView>
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
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 140, // Standardized bottom clearance
    },
    sectionDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    sectionLabel: {
        fontSize: 14,
        color: '#888',
        marginRight: 10,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#F0F0F0',
    },
    notificationItem: {
        flexDirection: 'row',
        marginBottom: 25,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    unreadDot: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4285F4',
        borderWidth: 2,
        borderColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        marginLeft: 15,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#445266',
        flex: 1,
    },
    itemDescription: {
        fontSize: 14,
        color: '#8894A8',
        lineHeight: 20,
        marginTop: 4,
    },
    itemTime: {
        fontSize: 12,
        color: '#A0B0C4',
        marginTop: 8,
    },
});

export default NotificationScreen;
