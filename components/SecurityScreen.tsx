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
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface SecurityScreenProps {
    visible: boolean;
    animation: Animated.Value;
    onClose: () => void;
    onEditPassword?: () => void;
    user: any;
}

const SecurityScreen: React.FC<SecurityScreenProps> = ({
    visible,
    animation,
    onClose,
    onEditPassword,
    user
}) => {
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState(user?.passwordMask || '********');

    // Sync state when user prop changes
    React.useEffect(() => {
        if (user) {
            setEmail(user.email || '');
            setPassword(user.passwordMask || '********');
        }
    }, [user]);

    // In a real app, clicking edit would toggle a mode or open a modal. 
    // For this UI implementation, we'll just show the button.
    const handleEditPassword = () => {
        if (onEditPassword) {
            onEditPassword();
        } else {
            console.log("Edit Password Pressed");
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
                    <Text style={styles.headerTitle}>Akun</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Email Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.readOnlyInputContainer}>
                            <Ionicons name="person-outline" size={20} color="#94A3B8" style={{ marginRight: 12 }} />
                            <Text style={styles.readOnlyText}>{email}</Text>
                        </View>
                    </View>

                    {/* Password Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kata Sandi</Text>
                        <View style={styles.readOnlyInputContainer}>
                            <Text style={[styles.readOnlyText, { letterSpacing: 2, flex: 1 }]}>{password}</Text>
                            <TouchableOpacity onPress={handleEditPassword}>
                                <Ionicons name="create-outline" size={20} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>
                    </View>
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
        zIndex: 100,
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
        gap: 24, // Space between inputs
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        color: '#1E293B', // Darker color for label as per image "Email"
        fontWeight: '600',
    },
    readOnlyInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 52,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    readOnlyText: {
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '600',
    },
});

export default SecurityScreen;
