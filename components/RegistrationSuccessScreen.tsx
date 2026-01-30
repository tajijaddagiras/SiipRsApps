import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Alert,
    ActivityIndicator,
    Platform
} from 'react-native';
import { useRef, useState } from 'react';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import QRCode from 'react-native-qrcode-svg';

const { width, height } = Dimensions.get('window');

interface RegistrationSuccessScreenProps {
    show: boolean;
    animation: Animated.Value;
    onClose: () => void;
    onEdit: () => void;
    onDownload?: () => void;
    patientData: {
        name: string;
        dob: string;
        mrn: string;
        status: string;
        category: string;
        room?: string;
    };
}

const RegistrationSuccessScreen: React.FC<RegistrationSuccessScreenProps> = ({
    show,
    animation,
    onClose,
    onEdit,
    onDownload,
    patientData
}) => {
    const viewShotRef = useRef<any>(null);
    const cardRef = useRef<any>(null);
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (downloading) return;
        setDownloading(true);

        try {
            if (Platform.OS === 'web') {
                try {
                    const html2canvas = require('html2canvas');
                    if (cardRef.current) {
                        const canvas = await html2canvas(cardRef.current, {
                            backgroundColor: '#ffffff',
                            scale: 2
                        });
                        const data = canvas.toDataURL('image/png');

                        // Access document safely via window for TS
                        // @ts-ignore
                        const dom = typeof document !== 'undefined' ? document : null;
                        if (dom) {
                            const link = dom.createElement('a');
                            link.href = data;
                            link.download = `kartu-pasien-${patientData.mrn}.png`;
                            dom.body.appendChild(link);
                            link.click();
                            dom.body.removeChild(link);

                            // Close modal after successful download on Web
                            onClose();
                        }
                    } else {
                        throw new Error('Card ref is null');
                    }
                } catch (e) {
                    console.error('Web capture failed:', e);
                    Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan kartu di web.');
                }
            } else {
                // Mobile capture
                console.log('Starting captureRef...');
                const uri = await captureRef(viewShotRef, {
                    format: 'png',
                    quality: 1,
                    result: 'data-uri'
                });

                // Mobile Sharing Logic
                if (!(await Sharing.isAvailableAsync())) {
                    Alert.alert('Gagal', 'Fitur berbagi tidak tersedia di perangkat ini.');
                    setDownloading(false);
                    return;
                }

                await Sharing.shareAsync(uri, {
                    mimeType: 'image/png',
                    dialogTitle: 'Simpan Kartu Pendaftaran',
                    UTI: 'public.png'
                });

                // Auto-navigate back on mobile
                onClose();
            }
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Gagal', 'Terjadi kesalahan saat memproses kartu.');
        } finally {
            setDownloading(false);
        }
    };

    if (!show && (animation as any)._value === 0) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: animation
                }
            ]}
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'bottom']}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Success Icon */}
                    <View style={styles.successIconContainer}>
                        <View style={styles.outerCircle}>
                            <View style={styles.innerCircle}>
                                <Ionicons name="checkmark" size={60} color="#22C55E" />
                            </View>
                        </View>
                        <Text style={styles.successTitle}>Data Berhasil Disimpan!</Text>
                    </View>

                    {/* Data Summary (Read Only) */}
                    <View style={styles.formSummary}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.label}>Nama Lengkap</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                <Text style={styles.summaryText}>{patientData.name}</Text>
                            </View>
                        </View>

                        <View style={styles.summaryItem}>
                            <Text style={styles.label}>Tanggal Lahir</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="calendar-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                <Text style={styles.summaryText}>{patientData.dob || '-'}</Text>
                            </View>
                        </View>

                        <View style={styles.summaryItem}>
                            <Text style={styles.label}>No. Rekam Medis</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="folder-account-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                <Text style={styles.summaryText}>{patientData.mrn}</Text>
                            </View>
                        </View>

                        <View style={styles.summaryItem}>
                            <Text style={styles.label}>Ruangan / Bed</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="bed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                <Text style={styles.summaryText}>{patientData.room || '-'}</Text>
                            </View>
                        </View>

                        {/* Status Group */}
                        <View style={styles.radioGroup}>
                            <Text style={styles.label}>Status Pasien:</Text>
                            <View style={styles.radioRow}>
                                <View style={styles.radioItem}>
                                    <View style={[styles.radioButton, patientData.status === 'Laki laki' && styles.radioButtonActive]}>
                                        {patientData.status === 'Laki laki' && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={styles.radioLabel}>Laki laki</Text>
                                </View>
                                <View style={styles.radioItem}>
                                    <View style={[styles.radioButton, patientData.status === 'Perempuan' && styles.radioButtonActive]}>
                                        {patientData.status === 'Perempuan' && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={styles.radioLabel}>Perempuan</Text>
                                </View>
                            </View>
                        </View>

                        {/* Category Group */}
                        <View style={styles.radioGroup}>
                            <Text style={styles.label}>Jenis Kelamin:</Text>
                            <View style={styles.radioRow}>
                                <View style={styles.radioItem}>
                                    <View style={[styles.radioButton, patientData.category === 'Rawat Jalan' && styles.radioButtonActive]}>
                                        {patientData.category === 'Rawat Jalan' && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={styles.radioLabel}>Rawat Jalan</Text>
                                </View>
                                <View style={styles.radioItem}>
                                    <View style={[styles.radioButton, patientData.category === 'Rawat Inap' && styles.radioButtonActive]}>
                                        {patientData.category === 'Rawat Inap' && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={styles.radioLabel}>Rawat Inap</Text>
                                </View>
                                <View style={styles.radioItem}>
                                    <View style={[styles.radioButton, patientData.category === 'IGD' && styles.radioButtonActive]}>
                                        {patientData.category === 'IGD' && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={styles.radioLabel}>IGD</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* QR Code Pass Section */}
                    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
                        <View ref={cardRef} collapsable={false} style={styles.passCard}>
                            <View style={styles.passBlueIndicator} />
                            <View style={styles.passContent}>
                                <View style={styles.passTextSection}>
                                    <View style={styles.rsBadge}>
                                        <Text style={styles.rsBadgeText}>RS Esa Unggul</Text>
                                    </View>
                                    <Text style={styles.passPatientName}>Nama: {patientData.name}</Text>
                                    <Text style={styles.passMrn}>No. RM: {patientData.mrn}</Text>
                                    <Text style={styles.passInfo}>Tgl Lahir: {patientData.dob}</Text>
                                    <Text style={styles.passInfo}>Ruang: {patientData.room || '-'}</Text>
                                </View>
                                <View style={styles.qrContainer}>
                                    <QRCode
                                        value={patientData.mrn}
                                        size={80}
                                        color="#000"
                                        backgroundColor="#fff"
                                    />
                                    <Text style={styles.qrInfo}>SCAN ME</Text>
                                </View>
                            </View>
                        </View>
                    </ViewShot>
                </ScrollView>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                        <Text style={styles.editButtonText}>Edit Data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.downloadButton, downloading && { opacity: 0.7 }]}
                        onPress={handleDownload}
                        disabled={downloading}
                    >
                        {downloading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.downloadButtonText}>Download</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
        zIndex: 2000,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 120,
    },
    successIconContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    outerCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    innerCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        borderWidth: 4,
        borderColor: '#22C55E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#475569',
        textAlign: 'center',
    },
    formSummary: {
        width: '100%',
        marginBottom: 24,
    },
    summaryItem: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '700',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 52,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    inputIcon: {
        marginRight: 12,
    },
    summaryText: {
        fontSize: 15,
        color: '#1E293B',
        fontWeight: '700',
    },
    radioGroup: {
        marginBottom: 16,
    },
    radioRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CBD5E1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    radioButtonActive: {
        borderColor: '#4285F4',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4285F4',
    },
    radioLabel: {
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '600',
    },
    passCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 20,
    },
    passBlueIndicator: {
        width: 8,
        backgroundColor: '#4285F4',
        borderRadius: 0,
        // Make it slightly wavy or curved if needed, but solid blue as per image
    },
    passContent: {
        flex: 1,
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    passTextSection: {
        flex: 1,
    },
    rsBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    rsBadgeText: {
        fontSize: 10,
        color: '#4285F4',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    passPatientName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    passMrn: {
        fontSize: 14,
        fontWeight: '800',
        color: '#4285F4',
        marginBottom: 4,
    },
    passInfo: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '600',
    },
    qrContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        alignItems: 'center',
    },
    qrInfo: {
        fontSize: 10,
        fontWeight: '800',
        color: '#CBD5E1',
        marginTop: 4,
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 12,
    },
    editButton: {
        flex: 1,
        height: 56,
        backgroundColor: '#F1F5F9',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#64748B',
    },
    downloadButton: {
        flex: 1,
        height: 56,
        backgroundColor: '#4285F4',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    downloadButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
    },
});

export default RegistrationSuccessScreen;
