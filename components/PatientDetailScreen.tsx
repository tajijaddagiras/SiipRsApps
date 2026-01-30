import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Animated,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRef, useState } from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { BASE_URL } from '../constants/config';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');

interface PatientDetailScreenProps {
    visible: boolean;
    animation: Animated.Value;
    onClose: () => void;
    patient: any;
    userId?: string;
    onUpdateSuccess?: () => void;
}

const PatientDetailScreen: React.FC<PatientDetailScreenProps> = ({
    visible,
    animation,
    onClose,
    patient,
    userId,
    onUpdateSuccess
}) => {
    const viewShotRef = useRef<any>(null);
    const cardRef = useRef<any>(null);
    const [downloading, setDownloading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Success Popup State
    const [showEditSuccess, setShowEditSuccess] = useState(false);
    const editSuccessOpacity = useRef(new Animated.Value(0)).current;

    // Edit states
    const [editName, setEditName] = useState('');
    const [editDob, setEditDob] = useState('');
    const [editMrn, setEditMrn] = useState('');
    const [editGender, setEditGender] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editRoom, setEditRoom] = useState('');

    // Date Picker State
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    // Initialize edit states when entering edit mode or when patient changes
    React.useEffect(() => {
        if (patient) {
            setEditName(patient.name);
            setEditDob(patient.dob);
            setEditMrn(patient.mrn);
            setEditGender(patient.gender);
            setEditCategory(patient.category);
            setEditRoom(patient.room || '');

            // Try to parse DOB for date picker
            if (patient.dob) {
                const parts = patient.dob.split('/');
                if (parts.length === 3) {
                    const parsedDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                    if (!isNaN(parsedDate.getTime())) {
                        setDate(parsedDate);
                    }
                }
            }
        }
    }, [patient, isEditing]);

    if (!patient) return null;

    const handleDownload = async () => {
        // ... (existing handleDownload code)
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
                            link.download = `barcode-pasien-${patient.mrn}.png`;
                            dom.body.appendChild(link);
                            link.click();
                            dom.body.removeChild(link);
                        }
                    } else {
                        throw new Error('Card ref is null');
                    }
                } catch (e) {
                    console.error('Web capture failed:', e);
                    Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan barcode di web.');
                }
            } else {
                // Mobile capture
                const uri = await captureRef(viewShotRef, {
                    format: 'png',
                    quality: 1,
                    result: 'data-uri',
                });

                // Mobile Sharing Logic
                if (!(await Sharing.isAvailableAsync())) {
                    Alert.alert('Gagal', 'Fitur berbagi tidak tersedia di perangkat ini.');
                    setDownloading(false);
                    return;
                }

                await Sharing.shareAsync(uri, {
                    mimeType: 'image/png',
                    dialogTitle: 'Simpan Barcode Pasien',
                    UTI: 'public.png'
                });
            }
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Gagal', 'Terjadi kesalahan saat memproses barcode.');
        } finally {
            setDownloading(false);
        }
    };

    const handleSave = async () => {
        if (!editName || !editMrn || !editDob || !editGender || !editCategory) {
            Alert.alert('Peringatan', 'Silakan lengkapi semua data wajib');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch(`${BASE_URL}/patients/${patient.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: editName,
                    mrn: editMrn,
                    dob: editDob,
                    gender: editGender,
                    category: editCategory,
                    room: editRoom,
                    userId: userId
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Show custom success popup
                setShowEditSuccess(true);
                Animated.timing(editSuccessOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }).start(() => {
                    // Wait 2 seconds then close
                    setTimeout(() => {
                        Animated.timing(editSuccessOpacity, {
                            toValue: 0,
                            duration: 300,
                            useNativeDriver: true,
                        }).start(() => {
                            setShowEditSuccess(false);
                            setIsEditing(false);
                            onUpdateSuccess?.(); // Notify parent of success
                            onClose();
                        });
                    }, 2000);
                });
            } else {
                Alert.alert('Gagal', data.message || 'Gagal memperbarui data pasien');
            }
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('Kesalahan Koneksi', 'Tidak dapat terhubung ke server');
        } finally {
            setSaving(false);
        }
    };

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);

        if (selectedDate) {
            const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
            setEditDob(formattedDate);
        }
    };

    const RadioButton = ({ label, selected, onPress }: { label: string, selected: boolean, onPress?: () => void }) => (
        <TouchableOpacity
            style={styles.radioContainer}
            onPress={onPress}
            disabled={!isEditing}
        >
            <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
                {selected && <View style={styles.radioButtonInner} />}
            </View>
            <Text style={styles.radioLabel}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <Animated.View
            pointerEvents={visible ? 'auto' : 'none'}
            style={[
                styles.overlay,
                { opacity: animation }
            ]}
        >
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Ionicons name="arrow-back" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Data Pasien</Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Nama Lengkap */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nama Lengkap</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#94A3B8" style={{ marginRight: 12 }} />
                            {isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    value={editName}
                                    onChangeText={setEditName}
                                    placeholder="Nama Lengkap"
                                />
                            ) : (
                                <Text style={styles.inputText}>{patient.name}</Text>
                            )}
                        </View>
                    </View>

                    {/* Tanggal Lahir */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tanggal Lahir</Text>
                        <TouchableOpacity
                            style={styles.inputContainer}
                            onPress={() => isEditing && setShowPicker(true)}
                            disabled={!isEditing}
                        >
                            <Ionicons name="calendar-outline" size={20} color="#94A3B8" style={{ marginRight: 12 }} />
                            <Text style={styles.inputText}>{isEditing ? editDob : (patient.dob || '01/01/2000')}</Text>
                        </TouchableOpacity>
                        {showPicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}
                    </View>

                    {/* No. Rekam Medis */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>No. Rekam Medis</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="briefcase-outline" size={20} color="#94A3B8" style={{ marginRight: 12 }} />
                            {isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    value={editMrn}
                                    onChangeText={setEditMrn}
                                    placeholder="No. Rekam Medis"
                                />
                            ) : (
                                <Text style={styles.inputText}>{patient.mrn}</Text>
                            )}
                        </View>
                    </View>

                    {/* Ruangan / Bed (New field added based on screenshot and requirements) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Ruangan / Bed</Text>
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="bed-outline" size={20} color="#94A3B8" style={{ marginRight: 12 }} />
                            {isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    value={editRoom}
                                    onChangeText={setEditRoom}
                                    placeholder="Contoh: Teratai 01"
                                />
                            ) : (
                                <Text style={styles.inputText}>{patient.room || '-'}</Text>
                            )}
                        </View>
                    </View>

                    {/* Status Pasien (Gender) */}
                    <View style={styles.radioSection}>
                        <Text style={styles.label}>Status Pasien:</Text>
                        <View style={styles.radioRow}>
                            <RadioButton
                                label="Laki laki"
                                selected={isEditing ? editGender === 'Laki laki' : patient.gender === 'Laki laki'}
                                onPress={() => setEditGender('Laki laki')}
                            />
                            <RadioButton
                                label="Perempuan"
                                selected={isEditing ? editGender === 'Perempuan' : patient.gender === 'Perempuan'}
                                onPress={() => setEditGender('Perempuan')}
                            />
                        </View>
                    </View>

                    {/* Jenis Kelamin (Category) */}
                    <View style={styles.radioSection}>
                        <Text style={styles.label}>Jenis Kelamin:</Text>
                        <View style={styles.radioRow}>
                            <RadioButton
                                label="Rawat Jalan"
                                selected={isEditing ? editCategory === 'Rawat Jalan' : patient.category === 'Rawat Jalan'}
                                onPress={() => setEditCategory('Rawat Jalan')}
                            />
                            <RadioButton
                                label="Rawat Inap"
                                selected={isEditing ? editCategory === 'Rawat Inap' : patient.category === 'Rawat Inap'}
                                onPress={() => setEditCategory('Rawat Inap')}
                            />
                            <RadioButton
                                label="IGD"
                                selected={isEditing ? editCategory === 'IGD' : patient.category === 'IGD'}
                                onPress={() => setEditCategory('IGD')}
                            />
                        </View>
                    </View>

                    {/* QR Card */}
                    {!isEditing && (
                        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
                            <View ref={cardRef} collapsable={false} style={styles.qrCard}>
                                <View style={styles.qrCardLeftLine} />
                                <View style={styles.qrCardContent}>
                                    <View style={styles.qrInfo}>
                                        <Text style={styles.qrName}>Nama: {patient.name}</Text>
                                        <Text style={styles.qrMrn}>No. RM: {patient.mrn}</Text>
                                    </View>
                                    <View style={styles.qrContainer}>
                                        <QRCode
                                            value={patient.mrn}
                                            size={70}
                                            color="#000"
                                            backgroundColor="#fff"
                                        />
                                    </View>
                                </View>
                            </View>
                        </ViewShot>
                    )}
                </ScrollView>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    {isEditing ? (
                        <>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setIsEditing(false)}
                                disabled={saving}
                            >
                                <Text style={styles.cancelButtonText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, saving && { opacity: 0.7 }]}
                                onPress={handleSave}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
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
                        </>
                    )}
                </View>

                {/* Custom Success Popup Overlay (Mimicking App.tsx design) */}
                {showEditSuccess && (
                    <Animated.View
                        style={{
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 10000,
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: editSuccessOpacity
                        }}
                    >
                        <View style={{
                            width: width - 80,
                            backgroundColor: '#fff',
                            borderRadius: 24,
                            padding: 30,
                            alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.2,
                            shadowRadius: 20,
                            elevation: 10,
                        }}>
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                backgroundColor: '#DCFCE7',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 20
                            }}>
                                <Ionicons name="checkmark-circle" size={50} color="#22C55E" />
                            </View>
                            <Text style={{ fontSize: 20, fontWeight: '900', color: '#1E293B', textAlign: 'center', marginBottom: 8 }}>Update Berhasil!</Text>
                            <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center' }}>Data pasien telah berhasil diperbarui!</Text>
                        </View>
                    </Animated.View>
                )}
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        zIndex: 5000,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
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
        fontWeight: '900',
        color: '#1E293B',
    },
    placeholder: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '700',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    inputText: {
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '800',
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '800',
        padding: 0,
    },
    radioSection: {
        marginBottom: 16,
    },
    radioRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 4,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#94A3B8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    radioButtonSelected: {
        borderColor: '#4285F4',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4285F4',
    },
    radioLabel: {
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '800',
    },
    qrCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        height: 100,
        flexDirection: 'row',
        marginTop: 10,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        overflow: 'hidden',
    },
    qrCardLeftLine: {
        width: 6,
        height: '60%',
        backgroundColor: '#60A5FA',
        borderRadius: 3,
        position: 'absolute',
        left: 4,
        top: '20%',
    },
    qrCardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingLeft: 24,
    },
    qrInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    qrName: {
        fontSize: 15,
        fontWeight: '800',
        color: '#64748B',
        marginBottom: 4,
    },
    qrMrn: {
        fontSize: 16,
        fontWeight: '900',
        color: '#4285F4',
    },
    qrContainer: {
        width: 70,
        height: 70,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        backgroundColor: '#fff',
    },
    editButton: {
        flex: 1,
        height: 52,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    editButtonText: {
        color: '#64748B',
        fontSize: 15,
        fontWeight: '800',
    },
    downloadButton: {
        flex: 1.2,
        height: 52,
        backgroundColor: '#4285F4',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    downloadButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '800',
    },
    saveButton: {
        flex: 1.5,
        height: 52,
        backgroundColor: '#4285F4',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '800',
    },
    cancelButton: {
        flex: 1,
        height: 52,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cancelButtonText: {
        color: '#64748B',
        fontSize: 15,
        fontWeight: '800',
    },
});

export default PatientDetailScreen;
