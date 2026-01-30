import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Animated,
    Platform
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Alert, ActivityIndicator } from 'react-native';
import { BASE_URL } from '../constants/config';

const { width, height } = Dimensions.get('window');

interface EditProfileScreenProps {
    visible: boolean;
    animation: Animated.Value;
    onClose: () => void;
    user: any;
    onSave: (updatedData: any) => Promise<void>;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
    visible,
    animation,
    onClose,
    user,
    onSave
}) => {
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Sync state when user prop changes
    React.useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setAvatar(user.avatar || '');
        }
    }, [user]);

    const handleImagePick = async () => {
        Alert.alert(
            'Ganti Foto Profil',
            'Pilih sumber foto',
            [
                {
                    text: 'Galeri',
                    onPress: () => pickImage('gallery')
                },
                {
                    text: 'Kamera',
                    onPress: () => pickImage('camera')
                },
                {
                    text: 'Batal',
                    style: 'cancel'
                }
            ]
        );
    };

    const pickImage = async (mode: 'gallery' | 'camera') => {
        let result;
        if (mode === 'gallery') {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });
        } else {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Izin Ditolak', 'Izin kamera diperlukan untuk mengambil foto.');
                return;
            }
            result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });
        }

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        setLoading(true);
        const formData = new FormData();
        const filename = uri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('image', {
            uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
            name: filename,
            type,
        } as any);

        try {
            const response = await fetch(`${BASE_URL}/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = await response.json();
            if (response.ok) {
                // Ensure BASE_URL is prepended if the server returns a relative path
                const newAvatarUrl = data.url.startsWith('http') ? data.url : `${BASE_URL}${data.url}`;
                setAvatar(newAvatarUrl);
            } else {
                Alert.alert('Gagal', data.message || 'Gagal mengunggah foto');
            }
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Kesalahan', 'Terjadi kesalahan saat mengunggah foto');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await onSave({ name, phone, avatar });
            onClose();
        } catch (error) {
            console.error('Save profile error:', error);
            Alert.alert('Gagal', 'Gagal menyimpan profil');
        } finally {
            setLoading(false);
        }
    };

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
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.content}>
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                                style={styles.avatar}
                                contentFit="cover"
                            />
                            {loading && (
                                <View style={styles.avatarLoadingOverlay}>
                                    <ActivityIndicator color="#fff" />
                                </View>
                            )}
                        </View>
                        <TouchableOpacity onPress={handleImagePick}>
                            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nama Lengkap</Text>
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

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nomor Telepon</Text>
                            <View style={styles.phoneInputContainer}>
                                <View style={styles.countryCodeContainer}>
                                    <Image
                                        source={{ uri: 'https://flagcdn.com/w40/id.png' }}
                                        style={styles.flag}
                                    />
                                    <Ionicons name="chevron-down" size={16} color="#64748B" />
                                </View>
                                <Text style={styles.countryCodeText}>(+62)</Text>
                                <TextInput
                                    style={styles.phoneInput}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    placeholder={focusedField === 'phone' ? '' : "8123456789"}
                                    placeholderTextColor="#94A3B8"
                                    onFocus={() => {
                                        setFocusedField('phone');
                                    }}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.buttonCancel} onPress={onClose} disabled={loading}>
                        <Text style={styles.buttonCancelText}>Batal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.buttonSave, loading && { opacity: 0.7 }]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Text style={styles.buttonSaveText}>{loading ? 'Menyimpan...' : 'Simpan'}</Text>
                    </TouchableOpacity>
                </View>
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
        zIndex: 100, // Ensure it's above everything
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
        fontWeight: 'bold',
        color: '#1E293B',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 24,
        marginBottom: 12,
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        backgroundColor: '#fff',
        padding: 4,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    avatarLoadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    changePhotoText: {
        color: '#4285F4',
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    formContainer: {
        gap: 20,
    },
    inputGroup: {
        marginBottom: 4,
    },
    label: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D0D0D0', // Standardized Border Color
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14, // Standardized Padding
        fontSize: 16,
        color: '#1E293B',
        backgroundColor: '#fff',
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D0D0D0', // Standardized Border Color
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4, // Added vertical padding for better spacing
        backgroundColor: '#fff',
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
        paddingRight: 8,
    },
    flag: {
        width: 24,
        height: 16,
        borderRadius: 2,
        marginRight: 4,
    },
    countryCodeText: {
        fontSize: 16,
        color: '#64748B',
        marginRight: 8,
    },
    phoneInput: {
        flex: 1,
        fontSize: 16,
        color: '#1E293B',
    },
    footer: {
        paddingVertical: 24,
        paddingHorizontal: 24,
        flexDirection: 'row',
        gap: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    buttonCancel: {
        flex: 1,
        height: 52,
        backgroundColor: '#F1F5F9',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonSave: {
        flex: 1,
        height: 52,
        backgroundColor: '#4285F4',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonCancelText: {
        color: '#64748B',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonSaveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default EditProfileScreen;
