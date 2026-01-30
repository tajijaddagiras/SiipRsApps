import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Platform,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BASE_URL } from '../constants/config';

const { width, height } = Dimensions.get('window');

interface ScannerScreenProps {
    showScanner: boolean;
    scannerOpacity: Animated.Value;
    onClose: () => void;
    onCapture: (patient: any) => void;
}

const ScannerScreen: React.FC<ScannerScreenProps> = ({
    showScanner,
    scannerOpacity,
    onClose,
    onCapture
}) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [flashlight, setFlashlight] = useState(false);
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const scanLineAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (showScanner) {
            // Request permission when screen is opened
            if (!permission || !permission.granted) {
                requestPermission();
            }

            Animated.loop(
                Animated.sequence([
                    Animated.timing(scanLineAnim, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scanLineAnim, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            scanLineAnim.stopAnimation();
        }
    }, [showScanner, permission]);

    const translateY = scanLineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 220],
    });

    // Handle initial permission state
    if (showScanner && !permission) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FACC15" />
            </View>
        );
    }

    // Handle denied permission
    if (showScanner && !permission?.granted) {
        return (
            <Animated.View style={[styles.overlay, { opacity: scannerOpacity, justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
                <Ionicons name="camera-outline" size={80} color="#FACC15" style={{ marginBottom: 20 }} />
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 10 }}>Akses Kamera Ditolak</Text>
                <Text style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 30 }}>Kami membutuhkan izin kamera Anda untuk memindai gelang pasien.</Text>
                <TouchableOpacity style={styles.shutterInner} onPress={requestPermission}>
                    <Text style={{ fontWeight: '900', color: '#1E293B' }}>BERI IZIN</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
                    <Text style={{ color: '#fff', fontWeight: '600' }}>KEMBALI</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    return (
        <Animated.View
            pointerEvents={showScanner ? 'auto' : 'none'}
            style={[
                styles.overlay,
                { opacity: scannerOpacity }
            ]}
        >
            {/* Real Camera View - No children to avoid warning */}
            {(showScanner && permission?.granted) && (
                <CameraView
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    enableTorch={flashlight}
                    onBarcodeScanned={scanned ? undefined : async ({ data }) => {
                        setScanned(true);
                        setLoading(true);
                        try {
                            const response = await fetch(`${BASE_URL}/patients/search/${data}`);
                            const patientData = await response.json();

                            if (response.ok) {
                                onCapture(patientData);
                            } else {
                                Alert.alert(
                                    'Pasien Tidak Ditemukan',
                                    `Data barcode (${data}) tidak terdaftar di sistem.`,
                                    [{ text: 'Coba Lagi', onPress: () => setScanned(false) }]
                                );
                            }
                        } catch (error) {
                            console.error('Scan error:', error);
                            Alert.alert('Kesalahan Koneksi', 'Tidak dapat terhubung ke server');
                            setScanned(false);
                        } finally {
                            setLoading(false);
                        }
                    }}
                />
            )}

            {/* Viewfinder Overlay - Using absolute positioning as recommended */}
            <View style={styles.viewfinderContainer} pointerEvents="none">
                <View style={styles.scanTargetArea}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />

                    <Animated.View
                        style={[
                            styles.scanLine,
                            { transform: [{ translateY }] }
                        ]}
                    />
                </View>
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#FACC15" />
                        <Text style={{ color: '#FACC15', fontWeight: '900', marginTop: 10 }}>MENCARI DATA...</Text>
                    </View>
                )}
            </View>

            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                {/* Top Controls */}
                <View style={styles.topControls}>
                    <TouchableOpacity style={styles.iconButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.iconButton, flashlight && { backgroundColor: '#FACC15' }]}
                        onPress={() => setFlashlight(!flashlight)}
                    >
                        <Ionicons name={flashlight ? "flashlight" : "flashlight-outline"} size={24} color={flashlight ? "#000" : "#fff"} />
                    </TouchableOpacity>
                </View>

                {/* Badge Overlay */}
                <View style={styles.badgeContainer}>
                    <View style={styles.modeBadge}>
                        <Text style={styles.modeText}>MODE LAPORAN</Text>
                    </View>
                </View>

                {/* Center Text */}
                <View style={styles.instructionContainer}>
                    <Text style={styles.instructionText}>ARAHKAN KEGELANG PASIEN</Text>
                </View>

                {/* Shutter Button Overlay */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.shutterOuter} onPress={onCapture}>
                        <View style={styles.shutterInner}>
                            <Ionicons name="camera" size={32} color="#1E293B" />
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 5000,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 6000,
    },
    container: {
        flex: 1,
    },
    viewfinderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    topControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    modeBadge: {
        backgroundColor: '#FACC15',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    modeText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#000',
    },
    scanTargetArea: {
        width: 260,
        height: 260,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#FACC15',
        borderWidth: 4,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 20,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 20,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 20,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 20,
    },
    scanLine: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        height: 2,
        backgroundColor: '#FACC15',
        shadowColor: '#FACC15',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    instructionContainer: {
        position: 'absolute',
        bottom: 180,
        width: '100%',
        alignItems: 'center',
    },
    instructionText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        alignItems: 'center',
    },
    shutterOuter: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: 'rgba(250, 204, 21, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(250, 204, 21, 0.5)',
    },
    shutterInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FACC15',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FACC15',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 8,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
});

export default ScannerScreen;
