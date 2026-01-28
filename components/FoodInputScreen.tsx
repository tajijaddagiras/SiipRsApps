import * as React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/theme';
import AppHeader from './AppHeader';

const { width } = Dimensions.get('window');

interface FoodInputScreenProps {
    showFoodInput: boolean;
    foodInputOpacity: Animated.Value;
    onClose: () => void;
    onSave: () => void;
}

const FoodInputScreen: React.FC<FoodInputScreenProps> = ({
    showFoodInput,
    foodInputOpacity,
    onClose,
    onSave
}) => {
    const [mealTime, setMealTime] = React.useState('Sarapan');
    const [calories, setCalories] = React.useState('');
    const [carbs, setCarbs] = React.useState('');
    const [foodName, setFoodName] = React.useState('');

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: foodInputOpacity,
                    pointerEvents: showFoodInput ? 'auto' : 'none',
                    zIndex: 2700,
                }
            ]}
        >
            <SafeAreaView style={styles.container} edges={['top']}>
                <AppHeader
                    title="Input Makanan"
                    showBack
                    onBack={onClose}
                    align="center"
                    variant="popup"
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {/* 1. Photo Capture Area */}
                        <TouchableOpacity style={styles.photoCard} activeOpacity={0.8}>
                            <View style={styles.cameraIconBg}>
                                <Ionicons name="camera" size={32} color="#4285F4" />
                            </View>
                            <Text style={styles.photoTitle}>Ambil Foto Makanan</Text>
                            <Text style={styles.photoSubtitle}>AI AKAN MENDETEKSI KALORI SECARA OTOMATIS</Text>
                        </TouchableOpacity>

                        {/* 2. Meal Time Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Waktu Makan</Text>
                            <View style={styles.tabContainer}>
                                {['Sarapan', 'Siang', 'Malam'].map((time) => (
                                    <TouchableOpacity
                                        key={time}
                                        style={[
                                            styles.tab,
                                            mealTime === time && styles.activeTab
                                        ]}
                                        onPress={() => setMealTime(time)}
                                    >
                                        <Text style={[
                                            styles.tabText,
                                            mealTime === time && styles.activeTabText
                                        ]}>
                                            {time}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* 3. Nutrition Estimation Section */}
                        <View style={styles.nutritionCard}>
                            <Text style={styles.nutritionTitle}>Estimasi Nutrisi</Text>
                            <View style={styles.nutritionGrid}>
                                <View style={styles.nutritionItem}>
                                    <Text style={styles.inputLabel}>Kalori</Text>
                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="350 Kcal"
                                            placeholderTextColor="#A0B0C4"
                                            value={calories}
                                            onChangeText={setCalories}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                                <View style={styles.nutritionItem}>
                                    <Text style={styles.inputLabel}>Karbohidrat</Text>
                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="45 gr"
                                            placeholderTextColor="#A0B0C4"
                                            value={carbs}
                                            onChangeText={setCarbs}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* 4. Food Name Input Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Nama Makanan</Text>
                            <View style={styles.fullInputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Contoh: Nasi Merah & Ayam Bakar"
                                    placeholderTextColor="#A0B0C4"
                                    value={foodName}
                                    onChangeText={setFoodName}
                                />
                            </View>
                        </View>

                        <View style={{ height: 40 }} />
                    </ScrollView>

                    {/* Footer Buttons */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.batalButton} onPress={onClose}>
                            <Text style={styles.batalText}>Batal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.simpanButton} onPress={onSave}>
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
    scrollContent: {
        flex: 1,
        paddingHorizontal: 24,
    },
    photoCard: {
        marginTop: 24,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
    },
    cameraIconBg: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    photoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 8,
    },
    photoSubtitle: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 12,
    },
    tabContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    activeTab: {
        backgroundColor: '#4285F4',
        borderColor: '#4285F4',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94A3B8',
    },
    activeTabText: {
        color: '#fff',
    },
    nutritionCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: 24,
    },
    nutritionTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 16,
    },
    nutritionGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    nutritionItem: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 8,
    },
    inputWrapper: {
        height: 52,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    fullInputWrapper: {
        height: 56,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    input: {
        fontSize: 15,
        color: '#334155',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingBottom: 30,
        paddingTop: 15,
        gap: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    batalButton: {
        flex: 1,
        height: 56,
        backgroundColor: '#F1F5F9',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    batalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#475569',
    },
    simpanButton: {
        flex: 1,
        height: 56,
        backgroundColor: '#4285F4',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    simpanText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default React.memo(FoodInputScreen);
