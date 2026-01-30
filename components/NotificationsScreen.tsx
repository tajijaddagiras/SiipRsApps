import * as React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BASE_URL } from '../constants/config';

const { width } = Dimensions.get('window');

interface NotificationsScreenProps {
    showNotifications: boolean;
    notificationsOpacity: Animated.Value;
    onClose: () => void;
    logs: any[];
    onMarkAsRead: () => void;
    userId: string;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
    showNotifications,
    notificationsOpacity,
    onClose,
    logs,
    onMarkAsRead,
    userId
}) => {
    const handleNotificationPress = async (log: any) => {
        if (!log.isRead && userId) {
            try {
                // Call API to mark as read
                await fetch(`${BASE_URL}/logs/mark-as-read/${log.id}`, {
                    method: 'PUT'
                });
                // Trigger refresh in parent
                onMarkAsRead();
            } catch (error) {
                console.error('Error marking notification as read:', error);
            }
        }
    };

    return (
        <Animated.View
            pointerEvents={showNotifications ? 'auto' : 'none'}
            style={[
                styles.overlay,
                { opacity: notificationsOpacity }
            ]}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Ionicons name="arrow-back" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifikasi</Text>
                    <View style={styles.headerPlaceholder} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Hari Ini Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionLabel}>Aktivitas Terbaru</Text>
                        <View style={styles.sectionLine} />
                    </View>

                    {logs && logs.length > 0 ? (
                        logs.slice(0, 10).map((log, index) => (
                            <NotificationItem
                                key={log.id || index}
                                icon={log.type === 'REGISTER' ?
                                    <Ionicons name="person-add" size={24} color="#2563EB" /> :
                                    <MaterialCommunityIcons name="pill" size={24} color="#22C55E" />}
                                title={log.patient?.name || 'Pasien Umum'}
                                subtitle={log.description}
                                time={new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB'}
                                isUnread={!log.isRead}
                                onPress={() => handleNotificationPress(log)}
                            />
                        ))
                    ) : (
                        <View style={{ alignItems: 'center', marginTop: 40 }}>
                            <Text style={{ color: '#94A3B8' }}>Belum ada notifikasi</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </Animated.View>
    );
};

const NotificationItem = ({
    icon,
    title,
    subtitle,
    time,
    isUnread = false,
    onPress
}: {
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    time: string,
    isUnread?: boolean,
    onPress: () => void
}) => (
    <TouchableOpacity style={styles.notificationItem} onPress={onPress}>
        <View style={styles.iconContainer}>
            {icon}
        </View>
        <View style={styles.contentContainer}>
            <View style={styles.titleRow}>
                <Text style={styles.notificationTitle}>{title}</Text>
                {isUnread && <View style={styles.unreadDot} />}
                <Ionicons name="chevron-forward" size={20} color="#CBD5E1" style={styles.chevron} />
            </View>
            <Text style={styles.notificationSubtitle}>{subtitle}</Text>
            <Text style={styles.notificationTime}>{time}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
        zIndex: 2000,
    },
    container: {
        flex: 1,
        paddingTop: 50, // For notch
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 60,
    },
    backButton: {
        width: 44,
        height: 44,
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
    headerTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E293B',
    },
    headerPlaceholder: {
        width: 44,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    sectionLabel: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '600',
        marginRight: 10,
    },
    sectionLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#CBD5E1',
    },
    notificationItem: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    notificationTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        lineHeight: 22,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4285F4',
        marginHorizontal: 10,
    },
    chevron: {
        marginLeft: 5,
    },
    notificationSubtitle: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
        marginBottom: 6,
    },
    notificationTime: {
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: '500',
    },
});

export default NotificationsScreen;
