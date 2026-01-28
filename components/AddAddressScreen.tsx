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
import AppHeader from './AppHeader';
import { Colors } from '../styles/theme';

const { width } = Dimensions.get('window');

interface AddAddressScreenProps {
    isVisible: boolean;
    opacity: Animated.Value;
    onClose: () => void;
    onSave: (address: string) => void;
}

const AddAddressScreen: React.FC<AddAddressScreenProps> = ({
    isVisible,
    opacity,
    onClose,
    onSave
}) => {
    const [address, setAddress] = useState('Jl. Setia Budi No 109');

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: opacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    zIndex: 2600,
                }
            ]}
        >
            <SafeAreaView style={styles.container} edges={['top']}>
                <AppHeader
                    title="Tambah Alamat"
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
                    <Text style={styles.label}>Alamat Utama</Text>
                    <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Masukkan alamat lengkap"
                        placeholderTextColor="#94A3B8"
                    />
                </View>

                {/* Bottom Buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={onClose}
                    >
                        <Text style={styles.cancelButtonText}>Batal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.saveButton]}
                        onPress={() => onSave(address)}
                    >
                        <Text style={styles.saveButtonText}>Simpan</Text>
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
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#475569',
        marginBottom: 12,
    },
    input: {
        width: '100%',
        height: 56,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#1E293B',
        backgroundColor: '#fff',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 34,
        gap: 12,
    },
    button: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.primary,
        opacity: 0.8,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    saveButton: {
        backgroundColor: Colors.primary,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default React.memo(AddAddressScreen);
