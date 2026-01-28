import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Animated,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/theme';

const { width, height } = Dimensions.get('window');

interface LogoutModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    opacity: Animated.Value;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isVisible, onClose, onConfirm, opacity }) => {
    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: opacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                }
            ]}
        >
            <Animated.View
                style={[
                    styles.backdrop,
                    {
                        opacity: opacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 0.5]
                        })
                    }
                ]}
            >
                <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />
            </Animated.View>

            <Animated.View
                style={[
                    styles.modalContainer,
                    {
                        opacity: opacity,
                        transform: [
                            {
                                scale: opacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.9, 1]
                                })
                            }
                        ]
                    }
                ]}
            >
                <View style={styles.iconContainer}>
                    <View style={styles.iconBackground}>
                        <Ionicons name="warning-outline" size={32} color="#EF4444" />
                    </View>
                </View>

                <Text style={styles.title}>Apakah anda yakin ingin keluar dari akun ini?</Text>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.cancelButtonText}>Batal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={onConfirm}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.confirmButtonText}>Yakin</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
    },
    modalContainer: {
        width: width * 0.85,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        marginBottom: 20,
    },
    iconBackground: {
        width: 72,
        height: 72,
        borderRadius: 16,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 26,
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748B',
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default LogoutModal;
