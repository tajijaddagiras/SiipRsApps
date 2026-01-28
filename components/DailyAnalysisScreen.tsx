import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../styles/theme';
import AppHeader from './AppHeader';

const { width } = Dimensions.get('window');

interface HistoryItem {
    value: string;
    session: string;
    time: string;
    status: 'stable' | 'high' | 'low';
}

interface DailyHistory {
    day: string;
    items: HistoryItem[];
}

interface DailyAnalysisScreenProps {
    showAnalysis: boolean;
    analysisOpacity: Animated.Value;
    onClose: () => void;
}

const historyData: DailyHistory[] = [
    {
        day: 'Hari Ini',
        items: [
            { value: '124', session: 'Sebelum Sarapan', time: '08:30 WIB', status: 'stable' },
            { value: '142', session: 'Sebelum Sarapan', time: '10:15 WIB', status: 'high' }
        ]
    },
    {
        day: 'Kemarin',
        items: [
            { value: '124', session: 'Sebelum Sarapan', time: '08:30 WIB', status: 'stable' },
            { value: '142', session: 'Sebelum Sarapan', time: '10:15 WIB', status: 'high' }
        ]
    },
    {
        day: 'Kamis',
        items: [
            { value: '124', session: 'Sebelum Sarapan', time: '08:30 WIB', status: 'stable' },
            { value: '142', session: 'Sebelum Sarapan', time: '10:15 WIB', status: 'high' }
        ]
    },
    {
        day: 'Rabu',
        items: [
            { value: '124', session: 'Sebelum Sarapan', time: '08:30 WIB', status: 'stable' },
            { value: '142', session: 'Sebelum Sarapan', time: '10:15 WIB', status: 'high' }
        ]
    }
];

// Memoized static graph component to prevent Android flicker during transitions
const MemoizedGraphCard = React.memo(() => (
    <View style={styles.graphCard}>
        <View style={styles.graphHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.blueDot} />
                <Text style={styles.graphLabel}>GULA DARAH SAAT INI</Text>
            </View>
            <View style={styles.statusBadge}>
                <Text style={styles.statusText}>STABIL</Text>
            </View>
        </View>

        <View style={styles.bloodValueContainer}>
            <Text style={styles.bloodValue}>114</Text>
            <Text style={styles.bloodUnit}>mg/dL</Text>
            <Text style={styles.timeAgo}>Terakhir: 15m lalu</Text>
        </View>

        <View style={styles.graphWrapper}>
            {/* Watermark Logo/Pulse in heart style */}
            <View style={styles.watermarkContainer}>
                <Svg height="120" width="180" viewBox="0 0 200 100">
                    <Path
                        d="M 20,50 L 50,50 L 60,20 L 75,80 L 85,50 L 120,50 L 130,40 L 140,60 L 150,50 L 180,50"
                        fill="none"
                        stroke="#F1F5F9"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                </Svg>
            </View>

            {/* Y-Axis Labels */}
            <View style={styles.yAxisContainer}>
                {['160', '140', '120', '100', '80'].map((val) => (
                    <Text key={val} style={styles.yAxisText}>{val}</Text>
                ))}
            </View>

            {/* Graph Content */}
            <View style={styles.graphContent}>
                <View style={{ width: '100%', height: 130 }}>
                    <Svg height="100%" width="100%" viewBox="0 0 350 130" preserveAspectRatio="none">
                        <Path
                            d="M 10,-10 L 10,130 L 340,130"
                            stroke="#E2E8F0"
                            strokeWidth="1.5"
                            fill="none"
                        />
                        <Path
                            d="M 10,35 C 37,35 37,75 65,75 C 92,75 92,45 120,45 C 147,45 147,65 175,65 C 202,65 202,85 230,85 C 257,85 257,110 285,110"
                            fill="none"
                            stroke="#4285F4"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {[35, 75, 45, 65, 85, 110].map((y, i) => {
                            const x = 10 + (i * 55);
                            return (
                                <Circle
                                    key={`dot-${i}`}
                                    cx={x}
                                    cy={y}
                                    r="6"
                                    fill={i === 5 ? "#4285F4" : "#fff"}
                                    stroke="#4285F4"
                                    strokeWidth="3.5"
                                />
                            );
                        })}
                    </Svg>
                    <View style={styles.popupContainer}>
                        <Text style={styles.popupText}>114</Text>
                        <View style={styles.popupTriangle} />
                    </View>
                </View>

                {/* Day Labels */}
                <View style={styles.dayLabelsContainer}>
                    {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'].map((day, i) => (
                        <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={[
                                styles.dayLabel,
                                i === 5 && styles.activeDayLabel,
                            ]}>
                                {day}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    </View>
));

const DailyAnalysisScreen: React.FC<DailyAnalysisScreenProps> = ({
    showAnalysis,
    analysisOpacity,
    onClose
}) => {
    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: analysisOpacity,
                    pointerEvents: showAnalysis ? 'auto' : 'none',
                    zIndex: 2800,
                }
            ]}
        >
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <AppHeader
                    title="Analisa Harian"
                    showBack
                    onBack={onClose}
                    align="center"
                    variant="popup"
                />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Graph Card Detail - Memoized for Android Stability */}
                    <MemoizedGraphCard />

                    {/* Daily History Section */}
                    <View style={styles.historySection}>
                        <Text style={styles.historyTitle}>Riwayat Harian</Text>

                        {historyData.map((dayGroup, idx) => (
                            <View key={idx} style={styles.dayGroup}>
                                <Text style={styles.dayTitle}>{dayGroup.day}</Text>
                                <View style={styles.dayGroupCard}>
                                    {dayGroup.items.map((item, itemIdx) => (
                                        <View key={itemIdx} style={[
                                            styles.historyCard,
                                            itemIdx === dayGroup.items.length - 1 && { marginBottom: 0 }
                                        ]}>
                                            <View style={[
                                                styles.valueBox,
                                                { backgroundColor: item.status === 'stable' ? '#f0fff8' : '#fff5f5' }
                                            ]}>
                                                <Text style={[
                                                    styles.valueBoxText,
                                                    { color: item.status === 'stable' ? '#00C853' : '#FF5252' }
                                                ]}>{item.value}</Text>
                                                <Text style={[
                                                    styles.valueBoxUnit,
                                                    { color: item.status === 'stable' ? '#00C853' : '#FF5252' }
                                                ]}>mg/dL</Text>
                                            </View>
                                            <View style={styles.cardInfo}>
                                                <Text style={styles.sessionText}>{item.session}</Text>
                                                <View style={styles.timeRow}>
                                                    <Ionicons name="time-outline" size={14} color="#A0A0A0" />
                                                    <Text style={styles.timeText}>{item.time}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
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
        backgroundColor: '#F8FAFC',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 140, // Standardized bottom clearance
    },
    graphCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    graphHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    blueDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4285F4',
        marginRight: 8,
    },
    graphLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    statusBadge: {
        backgroundColor: '#E6F7EF',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 14,
        marginBottom: 6,
    },
    statusText: {
        color: '#00C853',
        fontSize: 11,
        fontWeight: '800',
    },
    bloodValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 10,
    },
    bloodValue: {
        fontSize: 48,
        fontWeight: '900',
        color: '#1E293B',
    },
    bloodUnit: {
        fontSize: 16,
        color: '#64748B',
        marginLeft: 6,
        fontWeight: '700',
    },
    timeAgo: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '600',
        marginLeft: 'auto',
    },
    graphWrapper: {
        flexDirection: 'row',
        marginTop: 10,
        position: 'relative',
    },
    watermarkContainer: {
        position: 'absolute',
        right: -10,
        top: 10,
        opacity: 0.25,
        zIndex: 0,
    },
    yAxisContainer: {
        width: 30,
        justifyContent: 'space-between',
        paddingTop: 5,
        paddingBottom: 20, // Gap between "80" label and the horizontal line
        marginRight: 5,
    },
    yAxisText: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    graphContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0,
    },
    popupContainer: {
        position: 'absolute',
        left: '81.4%',
        bottom: 45, // Adjusted for new graph height
        marginLeft: -20,
        backgroundColor: '#4285F4',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 6,
        alignItems: 'center',
        zIndex: 10,
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5
    },
    popupText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold'
    },
    popupTriangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 0,
        borderTopWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#4285F4',
        position: 'absolute',
        bottom: -6,
    },
    dayLabelsContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 6,
    },
    dayLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '500',
    },
    activeDayLabel: {
        color: '#4285F4',
        fontWeight: 'bold',
    },
    historySection: {
        marginTop: 10,
    },
    historyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 24,
    },
    dayGroup: {
        marginBottom: 20,
    },
    dayTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 12,
    },
    dayGroupCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    historyCard: {
        flexDirection: 'row',
        backgroundColor: '#FAFBFC',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    valueBox: {
        width: 75,
        height: 75,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 18,
    },
    valueBoxText: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    valueBoxUnit: {
        fontSize: 11,
        fontWeight: '700',
        marginTop: -2,
    },
    cardInfo: {
        flex: 1,
    },
    sessionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 6,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 13,
        color: '#94A3B8',
        marginLeft: 5,
        fontWeight: '600',
    },
});

export default React.memo(DailyAnalysisScreen);
