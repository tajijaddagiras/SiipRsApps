import * as React from 'react';
import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TextInput,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../styles/theme';
import { BASE_URL } from '../constants/config';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import RegistrationSuccessScreen from './RegistrationSuccessScreen';

const { width, height } = Dimensions.get('window');

interface PatientRegistrationScreenProps {
    show: boolean;
    animation: Animated.Value;
    onClose: () => void;
    onComplete?: () => void;
    userId?: string;
}

const PatientRegistrationScreen: React.FC<PatientRegistrationScreenProps> = ({
    show,
    animation,
    onClose,
    onComplete,
    userId
}) => {
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [mrn, setMrn] = useState('');
    const [status, setStatus] = useState<'Laki laki' | 'Perempuan' | null>(null);
    const [category, setCategory] = useState<'Rawat Jalan' | 'Rawat Inap' | 'IGD' | null>(null);
    const [room, setRoom] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Success Screen State
    const [showSuccess, setShowSuccess] = useState(false);
    const successOpacity = React.useRef(new Animated.Value(0)).current;

    // Date Picker State
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);

        if (selectedDate) {
            const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
            setDob(formattedDate);
        }
    };

    // Fix: Always reset to form when the screen is opened
    React.useEffect(() => {
        if (show) {
            setShowSuccess(false);
            successOpacity.setValue(0);
        }
    }, [show]);

    const handleDaftar = async () => {
        if (!name || !mrn || !dob || !status || !category || !room) {
            Alert.alert('Peringatan', 'Silakan lengkapi semua data');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/patients/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    mrn,
                    dob,
                    gender: status,
                    category,
                    userId,
                    room
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setShowSuccess(true);
                Animated.timing(successOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }).start();
            } else {
                Alert.alert('Pendaftaran Gagal', data.message || 'Gagal mendaftarkan pasien');
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Kesalahan Koneksi', 'Tidak dapat terhubung ke server');
        }
    };

    const handleEditData = () => {
        Animated.timing(successOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setShowSuccess(false));
    };

    const handleFinalClose = () => {
        // Reset and close everything
        onComplete?.();
        onClose();
        setTimeout(() => {
            setShowSuccess(false);
            successOpacity.setValue(0);
        }, 500);
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
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <View style={{ width: 40 }} />
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Logo & RS Name */}
                        <View style={styles.logoSection}>
                            <View style={styles.logoContainer}>
                                <Image
                                    source={require('../assets/images/logo.png')}
                                    style={styles.logo}
                                    contentFit="contain"
                                />
                            </View>
                            <Text style={styles.rsName}>RS Esa Unggul</Text>
                        </View>

                        {/* Titles */}
                        <View style={styles.titleSection}>
                            <Text style={styles.mainTitle}>Form Pendaftaran Pasien</Text>
                            <Text style={styles.subTitle}>Daftarkan sebagai pasien di RS Esa Unggul</Text>
                        </View>

                        {/* Form Fields */}
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nama Lengkap</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={name}
                                        onChangeText={setName}
                                        placeholder={focusedField === 'name' ? '' : "Nama Lengkap"}
                                        placeholderTextColor="#94A3B8"
                                        onFocus={() => {
                                            setFocusedField('name');
                                        }}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Tanggal Lahir</Text>
                                <View style={styles.inputWrapper}>
                                    <TouchableOpacity
                                        onPress={() => setShowPicker(true)}
                                        activeOpacity={0.7}
                                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                                    >
                                        <Ionicons name="calendar-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                        <TextInput
                                            style={[styles.input, { flex: 1 }]}
                                            value={dob}
                                            editable={false}
                                            pointerEvents="none"
                                            placeholder="dd/mm/yyyy"
                                            placeholderTextColor="#94A3B8"
                                        />
                                    </TouchableOpacity>
                                    {showPicker && (
                                        <DateTimePicker
                                            value={date}
                                            mode="date"
                                            display="default"
                                            onChange={onDateChange}
                                            maximumDate={new Date()}
                                        />
                                    )}
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>No. Rekam Medis</Text>
                                <View style={styles.inputWrapper}>
                                    <MaterialCommunityIcons name="folder-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={mrn}
                                        onChangeText={setMrn}
                                        placeholder={focusedField === 'mrn' ? '' : "123456"}
                                        placeholderTextColor="#94A3B8"
                                        keyboardType="number-pad"
                                        onFocus={() => {
                                            setFocusedField('mrn');
                                        }}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Ruangan / Bed</Text>
                                <View style={styles.inputWrapper}>
                                    <MaterialCommunityIcons name="bed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        value={room}
                                        onChangeText={setRoom}
                                        placeholder={focusedField === 'room' ? '' : "Contoh: ICU Bed 04-A"}
                                        placeholderTextColor="#94A3B8"
                                        onFocus={() => {
                                            setFocusedField('room');
                                        }}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </View>
                            </View>

                            {/* Jenis Kelamin */}
                            <View style={styles.radioGroup}>
                                <Text style={styles.label}>Jenis Kelamin:</Text>
                                <View style={styles.radioRow}>
                                    <TouchableOpacity
                                        style={styles.radioItem}
                                        onPress={() => setStatus('Laki laki')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.radioButton, status === 'Laki laki' && styles.radioButtonActive]}>
                                            {status === 'Laki laki' && <View style={styles.radioInner} />}
                                        </View>
                                        <Text style={styles.radioLabel}>Laki laki</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.radioItem}
                                        onPress={() => setStatus('Perempuan')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.radioButton, status === 'Perempuan' && styles.radioButtonActive]}>
                                            {status === 'Perempuan' && <View style={styles.radioInner} />}
                                        </View>
                                        <Text style={styles.radioLabel}>Perempuan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Status Pasien / Kategori */}
                            <View style={styles.radioGroup}>
                                <Text style={styles.label}>Status Pasien:</Text>
                                <View style={styles.radioRow}>
                                    <TouchableOpacity
                                        style={styles.radioItem}
                                        onPress={() => setCategory('Rawat Jalan')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.radioButton, category === 'Rawat Jalan' && styles.radioButtonActive]}>
                                            {category === 'Rawat Jalan' && <View style={styles.radioInner} />}
                                        </View>
                                        <Text style={styles.radioLabel}>Rawat Jalan</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.radioItem}
                                        onPress={() => setCategory('Rawat Inap')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.radioButton, category === 'Rawat Inap' && styles.radioButtonActive]}>
                                            {category === 'Rawat Inap' && <View style={styles.radioInner} />}
                                        </View>
                                        <Text style={styles.radioLabel}>Rawat Inap</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.radioItem}
                                        onPress={() => setCategory('IGD')}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.radioButton, category === 'IGD' && styles.radioButtonActive]}>
                                            {category === 'IGD' && <View style={styles.radioInner} />}
                                        </View>
                                        <Text style={styles.radioLabel}>IGD</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.submitButton} activeOpacity={0.8} onPress={handleDaftar}>
                            <Text style={styles.submitButtonText}>Daftar</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>

                {/* Success Screen Overlay */}
                <RegistrationSuccessScreen
                    show={showSuccess}
                    animation={successOpacity}
                    onClose={handleFinalClose}
                    onEdit={handleEditData}
                    onDownload={onComplete}
                    patientData={{
                        name,
                        dob,
                        mrn,
                        room,
                        status: status || '',
                        category: category || ''
                    }}
                />
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
        zIndex: 1000,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
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
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 120,
        alignItems: 'center',
    },
    logoSection: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 24,
    },
    logoContainer: {
        width: 100,
        height: 100,
        backgroundColor: '#4285F4',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
    },
    logo: {
        width: 70,
        height: 70,
    },
    rsName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    mainTitle: {
        fontSize: 26,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 8,
    },
    subTitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 40,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
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
        height: 56,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1E293B',
        fontWeight: '600',
    },
    radioGroup: {
        marginBottom: 20,
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
        width: 22,
        height: 22,
        borderRadius: 11,
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
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4285F4',
    },
    radioLabel: {
        fontSize: 15,
        color: '#1E293B',
        fontWeight: '600',
    },
    submitButton: {
        width: '100%',
        height: 60,
        backgroundColor: '#4285F4',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
});

export default PatientRegistrationScreen;
