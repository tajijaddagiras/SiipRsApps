import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../styles/theme';

const { width, height } = Dimensions.get('window');

interface TransactionLoadingScreenProps {
    isVisible: boolean;
    opacity?: Animated.Value;
}

const TransactionLoadingScreen: React.FC<TransactionLoadingScreenProps> = ({
    isVisible,
    opacity = new Animated.Value(0)
}) => {
    // ... animation comment ...

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: opacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                    zIndex: 2800, // Higher than VA screen
                }
            ]}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <ActivityIndicator size="large" color="#4285F4" style={styles.spinner} />
                    <Text style={styles.text}>Menyelesaikan Transaksi</Text>
                </View>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinner: {
        transform: [{ scale: 1.5 }], // Make it bigger as per design
        marginBottom: 24,
    },
    text: {
        fontSize: 16,
        color: '#1E293B',
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

export default React.memo(TransactionLoadingScreen);
