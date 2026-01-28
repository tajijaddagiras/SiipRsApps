import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Animated,
    Dimensions,
    Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../styles/theme';
import AppHeader from './AppHeader';

const { width, height } = Dimensions.get('window');

interface EditProfileScreenProps {
    isVisible: boolean;
    opacity: Animated.Value;
    onClose: () => void;
    onSave: () => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
    isVisible,
    opacity,
    onClose,
    onSave,
}) => {
    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.container,
                {
                    opacity: opacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                },
            ]}
        >
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <AppHeader
                    title="Edit Profil"
                    showBack
                    onBack={onClose}
                    align="center"
                    containerStyle={{
                        backgroundColor: '#fff',
                        borderBottomWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0
                    }}
                />

                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 140 }}
                >
                    {/* Profile Photo */}
                    <View style={styles.photoSection}>
                        <View style={styles.photoContainer}>
                            <Image
                                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                                style={styles.photo}
                            />
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.form}>
                        <InputLabel label="Nama Lengkap" />
                        <TextInput style={styles.input} placeholder="Kelompok" defaultValue="Kelompok" />

                        <InputLabel label="Nomor Telepon" />
                        <View style={styles.phoneInputContainer}>
                            <TouchableOpacity style={styles.countryCode}>
                                <Image
                                    source={{ uri: 'https://flagcdn.com/w40/id.png' }}
                                    style={styles.flag}
                                />
                                <Ionicons name="chevron-down" size={14} color="#64748B" />
                            </TouchableOpacity>
                            <View style={styles.phoneDivider} />
                            <TextInput
                                style={styles.phoneInput}
                                placeholder="(+62) 8978936712"
                                defaultValue="(+62) 8978936712"
                                keyboardType="phone-pad"
                            />
                        </View>

                        <InputLabel label="Berat Badan" />
                        <TextInput style={styles.input} placeholder="Masukan berat badan" />

                        <InputLabel label="Tinggi Badan" />
                        <TextInput style={styles.input} placeholder="Masukan tinggi badan" />

                        <InputLabel label="Usia" />
                        <TextInput style={styles.input} placeholder="Masukan usia" keyboardType="numeric" />

                        <InputLabel label="Golongan Darah" />
                        <TextInput style={styles.input} placeholder="Masukan golongan darah" />

                        <InputLabel label="Target Kalori" />
                        <TextInput style={styles.input} placeholder="Masukan target kalori" keyboardType="numeric" />
                    </View>
                </ScrollView>

            </SafeAreaView>

            {/* Footer Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                    <Text style={styles.cancelButtonText}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={onSave}>
                    <Text style={styles.saveButtonText}>Simpan</Text>
                </TouchableOpacity>
            </View>
        </Animated.View >
    );
};

const InputLabel = ({ label }: { label: string }) => (
    <Text style={styles.label}>{label}</Text>
);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        zIndex: 1000,
    },
    content: {
        flex: 1,
    },
    photoSection: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    photoContainer: {
        width: 100,
        height: 100,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#3B82F6',
        padding: 2,
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    changePhotoText: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    form: {
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        height: 56,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#1E293B',
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        borderRadius: 12,
    },
    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 8,
    },
    flag: {
        width: 24,
        height: 16,
        borderRadius: 2,
    },
    phoneDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#F1F5F9',
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#1E293B',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        paddingTop: 16,
        backgroundColor: '#fff',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    button: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#60A5FA',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    saveButton: {
        backgroundColor: '#60A5FA',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default EditProfileScreen;
