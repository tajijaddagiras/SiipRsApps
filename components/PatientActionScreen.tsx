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
    ScrollView,
    Platform,
    Modal,
    Alert,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../constants/config';

const { width } = Dimensions.get('window');

interface PatientActionScreenProps {
    showPatientAction: boolean;
    patientActionOpacity: Animated.Value;
    onClose: () => void;
    onConfirm: () => void;
    patientData: any;
    userId?: string;
}

const PatientActionScreen: React.FC<PatientActionScreenProps> = ({
    showPatientAction,
    patientActionOpacity,
    onClose,
    onConfirm,
    patientData,
    userId
}) => {
    const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const procedures = [
        { id: '1', title: 'Pemberian Obat', icon: <MaterialCommunityIcons name="pill" size={24} color="#4285F4" />, bgColor: '#EEF4FF' },
        { id: '2', title: 'Ambil Sampel Lab', icon: <MaterialCommunityIcons name="flask-outline" size={24} color="#A855F7" />, bgColor: '#F5F3FF' },
        { id: '3', title: 'Tindakan Invasif', icon: <FontAwesome5 name="syringe" size={20} color="#EF4444" />, bgColor: '#FEF2F2' },
    ];

    const handleConfirmPress = async () => {
        if (!selectedProcedure) {
            Alert.alert('Peringatan', 'Silakan pilih prosedur');
            return;
        }

        const procedure = procedures.find(p => p.id === selectedProcedure);

        try {
            const response = await fetch(`${BASE_URL}/logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    patientId: patientData.id,
                    type: 'ACTION',
                    description: `${procedure?.title}: ${notes || 'Tanpa catatan tambahan'}`
                }),
            });

            if (response.ok) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    onConfirm();
                }, 2000);
            } else {
                Alert.alert('Gagal', 'Gagal mencatat tindakan');
            }
        } catch (error) {
            console.error('Action error:', error);
            Alert.alert('Kesalahan Koneksi', 'Tidak dapat terhubung ke server');
        }
    };


    return (
        <Animated.View
            pointerEvents={showPatientAction ? 'auto' : 'none'}
            style={[
                styles.overlay,
                { opacity: patientActionOpacity }
            ]}
        >
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tindakan Pasien</Text>
                    <View style={styles.headerPlaceholder} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ flex: 1 }}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                                keyboardShouldPersistTaps="handled"
                            >
                                {/* Patient Info Card */}
                                <View style={styles.patientCard}>
                                    <View style={styles.patientCardHeader}>
                                        <View style={styles.verifiedBadge}>
                                            <Text style={styles.verifiedText}>TERVERIFIKASI</Text>
                                        </View>
                                        <View style={styles.patientAvatar}>
                                            <Ionicons name="person" size={24} color="#4285F4" />
                                        </View>
                                    </View>

                                    <Text style={styles.patientName}>{patientData?.name || 'Pasien'}</Text>
                                    <Text style={styles.patientRM}>RM: {patientData?.mrn || '-'}</Text>

                                    <View style={styles.patientDetailsRow}>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>TGL LAHIR</Text>
                                            <Text style={styles.detailValue}>{patientData?.dob || '-'}</Text>
                                        </View>
                                        <View style={styles.detailItem}>
                                            <Text style={styles.detailLabel}>RUANGAN</Text>
                                            <Text style={styles.detailValue}>{patientData?.room || '-'}</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Procedure Selection */}
                                <Text style={styles.sectionTitle}>Pilih Prosedur</Text>
                                <View style={styles.procedureList}>
                                    {procedures.map((proc) => (
                                        <TouchableOpacity
                                            key={proc.id}
                                            style={[
                                                styles.procedureCard,
                                                selectedProcedure === proc.id && styles.procedureCardSelected
                                            ]}
                                            onPress={() => setSelectedProcedure(proc.id)}
                                        >
                                            <View style={[styles.iconBox, { backgroundColor: proc.bgColor }]}>
                                                {proc.icon}
                                            </View>
                                            <Text style={styles.procedureTitle}>{proc.title}</Text>
                                            <View style={styles.radioOuter}>
                                                {selectedProcedure === proc.id && <View style={styles.radioInner} />}
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* Staff Notes */}
                                <Text style={styles.notesLabel}>CATATAN PETUGAS</Text>
                                <View style={styles.notesWrapper}>
                                    <TextInput
                                        style={styles.notesInput}
                                        placeholder="Tulis detail tindakan..."
                                        placeholderTextColor="#CBD5E1"
                                        multiline
                                        textAlignVertical="top"
                                        value={notes}
                                        onChangeText={setNotes}
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>

                {/* Footer Button (Outside KeyboardAvoidingView for Android) */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPress}>
                        <Text style={styles.confirmButtonText}>Konfirmasi Tindakan</Text>
                    </TouchableOpacity>
                </View>

                {/* Success Modal */}
                <Modal
                    visible={showSuccess}
                    transparent
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.successModal}>
                            <View style={styles.successIconCircle}>
                                <Ionicons name="checkmark" size={32} color="#fff" />
                            </View>
                            <Text style={styles.successText}>Tindakan Berhasil di kirim</Text>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
        zIndex: 4000,
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
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    patientCard: {
        backgroundColor: '#2563EB',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    patientCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    verifiedBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.5)',
    },
    verifiedText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#4ADE80',
    },
    patientAvatar: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    patientName: {
        fontSize: 22,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 4,
    },
    patientRM: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 20,
    },
    patientDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 16,
    },
    procedureList: {
        gap: 12,
        marginBottom: 24,
    },
    procedureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
    procedureCardSelected: {
        borderColor: '#4285F4',
        backgroundColor: '#F8FAFF',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    procedureTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4285F4',
    },
    notesLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: '#94A3B8',
        marginBottom: 10,
    },
    notesWrapper: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D0D0D0', // Standardized Border Color
        borderRadius: 16, // Keeping 16 as it matches the card style in this screen
        height: 80,
        padding: 12,
    },
    notesInput: {
        fontSize: 15,
        color: '#1E293B',
        fontWeight: '500',
        height: '100%',
    },
    footer: {
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 10 : 20,
    },
    confirmButton: {
        backgroundColor: '#60A5FA',
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    confirmButtonText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#fff',
    },
    // Success Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successModal: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 30,
        paddingHorizontal: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 25,
        elevation: 15,
    },
    successIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#60A5FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    successText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#60A5FA',
        textAlign: 'center',
    },
});

export default PatientActionScreen;
