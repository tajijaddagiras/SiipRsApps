import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface CancelOrderModalProps {
    isVisible: boolean;
    opacity: Animated.Value;
    onCancel: () => void;
    onConfirm: () => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
    isVisible,
    opacity,
    onCancel,
    onConfirm,
}) => {
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
            <View style={styles.modalContainer}>
                {/* Shield Icon Section */}
                <View style={styles.iconContainer}>
                    <Image
                        source={require('../assets/images/cancel_shield.png')}
                        style={styles.shieldImage}
                        contentFit="contain"
                        priority="high"
                        transition={0}
                    />
                </View>

                {/* Text Content */}
                <View style={styles.contentSection}>
                    <Text style={styles.titleText}>
                        Apakah Anda Yakin Ingin batalkan pesanan ini?
                    </Text>
                </View>

                <View style={styles.divider} />

                {/* Footer Buttons */}
                <View style={styles.footerRow}>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={onCancel}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.secondaryButtonText}>Batal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onConfirm}
                        activeOpacity={0.8}
                        style={{ flex: 1 }}
                    >
                        <LinearGradient
                            colors={['#FF8A00', '#FF4D00']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.primaryButton}
                        >
                            <Text style={styles.primaryButtonText}>Ya Batalkan</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5000,
    },
    modalContainer: {
        width: width * 0.82,
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingTop: 32,
        overflow: 'hidden',
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 20,
    },
    shieldImage: {
        width: 80,
        height: 100,
    },
    contentSection: {
        paddingHorizontal: 32,
        marginBottom: 24,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#334155',
        textAlign: 'center',
        lineHeight: 24,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#F1F5F9',
    },
    footerRow: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        width: '100%',
    },
    secondaryButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    primaryButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default React.memo(CancelOrderModal);
