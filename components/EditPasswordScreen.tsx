import * as React from 'react';
import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from './AppHeader';
import { Colors } from '../styles/theme';

const { width } = Dimensions.get('window');

interface EditPasswordScreenProps {
    isVisible: boolean;
    opacity: Animated.Value;
    onClose: () => void;
    onSave: (passwords: { newPass: string, confirmPass: string }) => void;
}

const EditPasswordScreen: React.FC<EditPasswordScreenProps> = ({
    isVisible,
    opacity,
    onClose,
    onSave
}) => {
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: opacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    zIndex: 2800,
                }
            ]}
        >
            <SafeAreaView style={styles.container} edges={['top']}>
                <AppHeader
                    title="Edit Kata Sandi"
                    showBack={true}
                    onBack={onClose}
                    align="center"
                    containerStyle={{
                        backgroundColor: '#fff',
                        borderBottomWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0
                    }}
                />

                <View style={styles.content}>
                    {/* Email Read-only */}
                    <View style={styles.fieldSection}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.fieldValueContainer}>
                            <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.fieldIcon} />
                            <Text style={styles.readOnlyText}>kelompok123@gmail.com</Text>
                        </View>
                    </View>

                    {/* New Password */}
                    <View style={styles.fieldSection}>
                        <Text style={styles.label}>Kata Sandi Baru</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.fieldIcon} />
                            <TextInput
                                style={styles.input}
                                value={newPass}
                                onChangeText={setNewPass}
                                secureTextEntry={!showNewPass}
                                placeholder="**********"
                                placeholderTextColor="#94A3B8"
                            />
                            <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
                                <Ionicons
                                    name={showNewPass ? "eye-outline" : "eye-off-outline"}
                                    size={22}
                                    color="#94A3B8"
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.helperText}>Panjangnya minimal 8 karakter!</Text>
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.fieldSection}>
                        <Text style={styles.label}>Konfirmasi Kata Sandi Baru</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.fieldIcon} />
                            <TextInput
                                style={styles.input}
                                value={confirmPass}
                                onChangeText={setConfirmPass}
                                secureTextEntry={!showConfirmPass}
                                placeholder="**********"
                                placeholderTextColor="#94A3B8"
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
                                <Ionicons
                                    name={showConfirmPass ? "eye-outline" : "eye-off-outline"}
                                    size={22}
                                    color="#94A3B8"
                                />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.helperText}>Panjangnya minimal 8 karakter!</Text>
                    </View>
                </View>

                {/* Bottom Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => onSave({ newPass, confirmPass })}
                    >
                        <Text style={styles.saveButtonText}>Simpan Kata sandi</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    fieldSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#475569',
        marginBottom: 8,
    },
    fieldValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
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
    fieldIcon: {
        marginRight: 12,
    },
    readOnlyText: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '500',
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
    },
    helperText: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 6,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 34,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default React.memo(EditPasswordScreen);
