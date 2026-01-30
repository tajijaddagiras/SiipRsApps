import * as React from 'react';
import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../constants/config';

const { width } = Dimensions.get('window');

interface ManualInputScreenProps {
    showManualInput: boolean;
    manualInputOpacity: Animated.Value;
    onClose: () => void;
    onSearch: (patient: any) => void;
}

const ManualInputScreen: React.FC<ManualInputScreenProps> = ({
    showManualInput,
    manualInputOpacity,
    onClose,
    onSearch
}) => {
    const [rekamMedis, setRekamMedis] = useState('');
    const [patientName, setPatientName] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!rekamMedis) {
            Alert.alert('Peringatan', 'Silakan masukkan nomor rekam medis');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/patients/search/${rekamMedis}`);
            const data = await response.json();

            if (response.ok) {
                onSearch(data);
            } else {
                Alert.alert('Pasien Tidak Ditemukan', data.message || 'Harap periksa kembali nomor rekam medis');
            }
        } catch (error) {
            console.error('Search error:', error);
            Alert.alert('Kesalahan Koneksi', 'Tidak dapat terhubung ke server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Animated.View
            pointerEvents={showManualInput ? 'auto' : 'none'}
            style={[
                styles.overlay,
                { opacity: manualInputOpacity }
            ]}
        >
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Identifikasi Manual</Text>
                    <View style={styles.headerPlaceholder} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Info Banner */}
                        <View style={styles.infoBanner}>
                            <Text style={styles.infoText}>
                                Sesuai standar keselamatan pasien (SKP 1), gunakan minimal dua penanda (Nama dan No. Rekam Medis) untuk verifikasi manual.
                            </Text>
                        </View>

                        {/* Input Group - Rekam Medis */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>NOMOR REKAM MEDIS</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={focusedField === 'rekamMedis' ? '' : "Contoh: 00-12-34-56"}
                                    placeholderTextColor="#CBD5E1"
                                    value={rekamMedis}
                                    onChangeText={setRekamMedis}
                                    onFocus={() => {
                                        setFocusedField('rekamMedis');
                                    }}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </View>
                        </View>

                        {/* Input Group - Patient Name */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>NAMA PASIEN / TGL LAHIR</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={focusedField === 'patientName' ? '' : "Sesuai KTP / Kartu Pasien"}
                                    placeholderTextColor="#CBD5E1"
                                    value={patientName}
                                    onChangeText={setPatientName}
                                    onFocus={() => {
                                        setFocusedField('patientName');
                                    }}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer Button */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.searchButton, loading && { opacity: 0.7 }]}
                            onPress={handleSearch}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.searchButtonText}>Cari Pasien</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
        zIndex: 3000,
    },
    container: {
        flex: 1,
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
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 40,
    },
    infoBanner: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#3B82F6',
        borderRadius: 12,
        padding: 16,
        marginBottom: 32,
    },
    infoText: {
        fontSize: 13,
        color: '#3B82F6',
        lineHeight: 18,
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#94A3B8',
        marginBottom: 10,
    },
    inputWrapper: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        height: 56,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    input: {
        fontSize: 16,
        color: '#1E293B',
        fontWeight: '600',
    },
    footer: {
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 10 : 24,
    },
    searchButton: {
        backgroundColor: '#60A5FA',
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    searchButtonText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#fff',
    },
});

export default ManualInputScreen;
