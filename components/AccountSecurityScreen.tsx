import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import AppHeader from './AppHeader';

const { width } = Dimensions.get('window');

interface AccountSecurityScreenProps {
    isVisible: boolean;
    opacity: Animated.Value;
    onClose: () => void;
    onEditPassword?: () => void;
}

const AccountSecurityScreen: React.FC<AccountSecurityScreenProps> = ({
    isVisible,
    opacity,
    onClose,
    onEditPassword
}) => {
    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: opacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    zIndex: 2700,
                }
            ]}
        >
            <SafeAreaView style={styles.container} edges={['top']}>
                <AppHeader
                    title="Akun"
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
                    {/* Email Section */}
                    <View style={styles.fieldSection}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.fieldValueContainer}>
                            <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.fieldIcon} />
                            <Text style={styles.fieldText}>kelompok123@gmail.com</Text>
                        </View>
                    </View>

                    {/* Password Section */}
                    <View style={styles.fieldSection}>
                        <Text style={styles.label}>Kata Sandi</Text>
                        <View style={styles.fieldValueContainer}>
                            <Text style={styles.fieldText}>********</Text>
                            <TouchableOpacity style={styles.editIcon} onPress={onEditPassword}>
                                <Feather name="edit-3" size={20} color="#94A3B8" />
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
        marginBottom: 24,
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
    fieldIcon: {
        marginRight: 12,
    },
    fieldText: {
        flex: 1,
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '500',
    },
    editIcon: {
        padding: 4,
    },
});

export default React.memo(AccountSecurityScreen);
