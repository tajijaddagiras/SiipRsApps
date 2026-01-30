import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions,
    StatusBar,
    ScrollView,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../constants/config';

const { width } = Dimensions.get('window');

interface Patient {
    id: string;
    name: string;
    mrn: string; // Medical Record Number
    gender: 'Laki laki' | 'Perempuan';
    category: 'IGD' | 'Rawat Inap' | 'Rawat Jalan';
    dob: string;
    room: string;
    createdAt: string;
    // Helper fields for UI
    initials?: string;
    initialsColor?: string;
}

interface PatientListScreenProps {
    onBack: () => void;
    onPatientPress?: (patient: Patient) => void;
    userId?: string;
    updateTrigger?: number;
}

const PatientListScreen: React.FC<PatientListScreenProps> = ({ onBack, onPatientPress, userId, updateTrigger }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const filters = ['Semua', 'Rawat Inap', 'Rawat Jalan', 'IGD'];

    const getInitials = (name: string) => {
        const names = name.split(' ');
        let initials = names[0].substring(0, 1).toUpperCase();
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    };

    const getRandomColor = (name: string) => {
        const colors = ['#DBEAFE', '#F3E8FF', '#DCFCE7', '#FEF3C7', '#FEE2E2'];
        const index = name.length % colors.length;
        return colors[index];
    };

    const fetchPatients = useCallback(async (query: string = '') => {
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const url = query
                ? `${BASE_URL}/patients?userId=${userId}&query=${encodeURIComponent(query)}`
                : `${BASE_URL}/patients?userId=${userId}`;

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                // Process data to add UI helpers
                const processedData = data.map((p: any) => ({
                    ...p,
                    initials: getInitials(p.name),
                    initialsColor: getRandomColor(p.name)
                }));
                // Only showing patients for this user is handled by backend now
                setPatients(processedData);
            } else {
                setPatients([]);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            setPatients([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userId]);

    // Initial load
    useEffect(() => {
        fetchPatients();
    }, [fetchPatients, updateTrigger]);

    // Search debounce could be added here, for now simple effect
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPatients(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, fetchPatients]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPatients(searchQuery);
    }, [fetchPatients, searchQuery]);

    const getBadgeStyle = (category: string) => {
        switch (category) {
            case 'IGD':
                return {
                    bg: '#FEE2E2', // Light Red
                    text: '#EF4444' // Red
                };
            case 'Rawat Inap':
                return {
                    bg: '#F3E8FF', // Light Purple
                    text: '#A855F7' // Purple
                };
            case 'Rawat Jalan':
                return {
                    bg: '#DCFCE7', // Light Green
                    text: '#22C55E' // Green
                };
            default:
                return {
                    bg: '#E0E7FF',
                    text: '#4285F4'
                };
        }
    };

    // Filter logic on frontend for category
    const filteredPatients = patients.filter(p => {
        if (activeFilter === 'Semua') return true;
        return p.category === activeFilter;
    });

    const renderPatientCard = ({ item }: { item: Patient }) => {
        const badgeStyle = getBadgeStyle(item.category);
        const formattedDate = new Date(item.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });

        return (
            <TouchableOpacity style={styles.card} onPress={() => onPatientPress?.(item)}>
                {/* Header Row: Initials, Name, Badge */}
                <View style={styles.cardHeader}>
                    <View style={styles.headerLeft}>
                        <View style={[styles.initialsContainer, { backgroundColor: item.initialsColor }]}>
                            <Text style={styles.initialsText}>{item.initials}</Text>
                        </View>
                        <View style={styles.nameContainer}>
                            <Text style={styles.patientName}>{item.name}</Text>
                            <Text style={styles.mrnText}>RM: {item.mrn}</Text>
                        </View>
                    </View>
                    <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
                        <Text style={[styles.badgeText, { color: badgeStyle.text }]}>{item.category}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Info Row */}
                <View style={styles.infoRow}>
                    <View>
                        <Text style={styles.infoLabel}>TGL MASUK</Text>
                        <Text style={styles.infoValue}>{formattedDate}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.infoLabel}>RUANGAN</Text>
                        <Text style={styles.infoValue}>{item.room || '-'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header - Simplified */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Daftar Pasien</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#94A3B8" style={{ marginRight: 10 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari Nama atau No. RM..."
                        placeholderTextColor="#94A3B8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filters */}
                <View style={{ height: 50, marginBottom: 10 }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterContainer}
                    >
                        {filters.map((filter) => (
                            <TouchableOpacity
                                key={filter}
                                style={[
                                    styles.filterChip,
                                    activeFilter === filter && styles.filterChipActive
                                ]}
                                onPress={() => setActiveFilter(filter)}
                            >
                                <Text style={[
                                    styles.filterText,
                                    activeFilter === filter && styles.filterTextActive
                                ]}>
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* List */}
                {loading && !refreshing ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color="#4285F4" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredPatients}
                        renderItem={renderPatientCard}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4285F4']} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="people-outline" size={48} color="#CBD5E1" />
                                <Text style={styles.emptyText}>Tidak ada data pasien</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    content: {
        flex: 1,
        backgroundColor: '#F8F9FA',
        paddingTop: 0, // Removed padding top as header is separate now
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 20,
        paddingHorizontal: 16,
        height: 52,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1E293B',
    },
    filterContainer: {
        paddingHorizontal: 20,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#fff',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: '#4285F4',
        borderColor: '#4285F4',
    },
    filterText: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    initialsContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    initialsText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#4285F4',
    },
    nameContainer: {
        flex: 1,
    },
    patientName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 4,
    },
    mrnText: {
        fontSize: 12,
        color: '#4285F4',
        fontWeight: '600',
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '700',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 14,
        color: '#334155',
        fontWeight: '600',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '600'
    }
});

export default PatientListScreen;
