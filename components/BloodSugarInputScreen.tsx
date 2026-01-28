import * as React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/theme';
import AppHeader from './AppHeader';

const { width } = Dimensions.get('window');

interface BloodSugarInputScreenProps {
    showCheckBloodSugar: boolean;
    checkBloodSugarOpacity: Animated.Value;
    onClose: () => void;
    onSave: () => void;
}

const BloodSugarInputScreen: React.FC<BloodSugarInputScreenProps> = ({
    showCheckBloodSugar,
    checkBloodSugarOpacity,
    onClose,
    onSave
}) => {
    const [activeTab, setActiveTab] = React.useState('Sebelum Makan');
    const [glucoseValue, setGlucoseValue] = React.useState('');

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: checkBloodSugarOpacity,
                    pointerEvents: showCheckBloodSugar ? 'auto' : 'none',
                    zIndex: 2600,
                }
            ]}
        >
            <SafeAreaView style={styles.container}>
                {/* Header - Identical to Reference */}
                <AppHeader
                    title="Cek Gula Darah"
                    showBack
                    onBack={onClose}
                    align="center"
                    variant="popup"
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View style={styles.content}>
                        {/* Tab Switcher */}
                        <View style={styles.tabContainer}>
                            {['Sebelum Makan', 'Sesudah Makan'].map((tab) => (
                                <TouchableOpacity
                                    key={tab}
                                    style={[
                                        styles.tab,
                                        activeTab === tab && styles.activeTab
                                    ]}
                                    onPress={() => setActiveTab(tab)}
                                >
                                    <Text style={[
                                        styles.tabText,
                                        activeTab === tab && styles.activeTabText
                                    ]}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Input Area */}
                        <View style={styles.inputSection}>
                            <Text style={styles.inputLabel}>Kadar Glukosa (mg/dL)</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Masukan Kadar Glukosa (mg/dL)"
                                    placeholderTextColor="#A0B0C4"
                                    keyboardType="numeric"
                                    value={glucoseValue}
                                    onChangeText={setGlucoseValue}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Footer Buttons - Identical to Reference */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.batalButton} onPress={onClose}>
                            <Text style={styles.batalText}>Batal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.simpanButton}
                            onPress={onSave}
                        >
                            <Text style={styles.simpanText}>Simpan</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 4,
        marginBottom: 32,
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#4285F4',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8894A8',
    },
    activeTabText: {
        color: '#fff',
    },
    inputSection: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    inputWrapper: {
        height: 56,
        borderWidth: 1,
        borderColor: '#DDE3ED',
        borderRadius: 12,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    input: {
        fontSize: 15,
        color: '#333',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingBottom: 30,
        paddingTop: 20,
        gap: 16,
        backgroundColor: '#fff',
    },
    batalButton: {
        flex: 1,
        height: 56,
        backgroundColor: '#F5F7FA',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    batalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#445266',
    },
    simpanButton: {
        flex: 1,
        height: 56,
        backgroundColor: '#4285F4',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    simpanText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default BloodSugarInputScreen;
