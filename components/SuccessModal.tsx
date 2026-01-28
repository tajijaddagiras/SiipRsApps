import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface SuccessModalProps {
    isVisible: boolean;
    opacity: Animated.Value;
    message?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    isVisible,
    opacity,
    message = 'Data Berhasil Tersimpan'
}) => {
    if (!isVisible) return null;

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: opacity,
                }
            ]}
        >
            <View style={styles.modal}>
                <View style={styles.iconCircle}>
                    <Ionicons name="checkmark-sharp" size={60} color="#fff" />
                </View>
                <Text style={styles.message}>{message}</Text>
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
        zIndex: 3000,
    },
    modal: {
        width: width * 0.8,
        backgroundColor: '#fff',
        borderRadius: 40,
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#445266',
        textAlign: 'center',
    },
});

export default React.memo(SuccessModal);
