import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

interface BloodSugarGraphProps {
    onOpenAnalysis: () => void;
}

const BloodSugarGraph: React.FC<BloodSugarGraphProps> = ({ onOpenAnalysis }) => {
    return (
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
                <Text style={styles.bloodValue}>124</Text>
                <Text style={styles.bloodUnit}>mg/dL</Text>
                <Text style={styles.timeAgo}>Terakhir: 15m lalu</Text>
            </View>

            <View style={{ height: 150, justifyContent: 'center', alignItems: 'center', marginVertical: 5, paddingHorizontal: 0 }}>
                <View style={{ width: '100%', height: 100 }}>
                    <Svg height="100%" width="100%" viewBox="0 0 350 100" preserveAspectRatio="none">
                        {/* Refined Smooth Wavy Curve - Day 1 at Edge, Stops at Day 6 */}
                        <Path
                            d="M 10,15 C 37,15 37,55 65,55 C 92,55 92,25 120,25 C 147,25 147,45 175,45 C 202,45 202,60 230,60 C 257,60 257,80 285,80"
                            fill="none"
                            stroke="#4285F4"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Data Points (Dots) - Spread out to edges */}
                        {[15, 55, 25, 45, 60, 80].map((y, i) => {
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

                    {/* Popup adjusted specifically for Day 6 (x=285 in 350 viewbox) */}
                    <View style={styles.popupContainer}>
                        <Text style={styles.popupText}>124</Text>
                        <View style={styles.popupTriangle} />
                    </View>
                </View>

                {/* Day Labels - Spaced to match dots */}
                <View style={styles.dayLabelsContainer}>
                    {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'].map((day, i) => (
                        <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={[
                                styles.dayLabel,
                                i === 5 && styles.activeDayLabel,
                                { fontSize: 10 }
                            ]}>
                                {day}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.graphFooter}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="trending-down" size={16} color="#4CAF50" />
                    <Text style={styles.trendText}>-5%</Text>
                    <Ionicons name="calendar-outline" size={16} color="#FFD700" style={{ marginLeft: 12 }} />
                    <Text style={styles.targetText}>Target: 100</Text>
                </View>
                <TouchableOpacity style={styles.analisaButton} onPress={onOpenAnalysis}>
                    <Text style={styles.analisaText}>Analisa Lengkap</Text>
                    <Ionicons name="arrow-forward" size={14} color="#4285F4" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    graphCard: {
        backgroundColor: '#fff',
        marginHorizontal: 24,
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginBottom: 24,
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    graphHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    blueDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4285F4',
        marginRight: 8,
    },
    graphLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#A0A0A0',
        letterSpacing: 0.5,
    },
    statusBadge: {
        backgroundColor: '#E6F7EF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#00C853',
        fontSize: 10,
        fontWeight: 'bold',
    },
    bloodValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    bloodValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#000',
    },
    bloodUnit: {
        fontSize: 16,
        color: '#888',
        marginLeft: 6,
        fontWeight: '500',
    },
    timeAgo: {
        fontSize: 12,
        color: '#A0A0A0',
        marginLeft: 'auto',
    },
    popupContainer: {
        position: 'absolute',
        left: '81.4%',
        bottom: 40,
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
        marginTop: 10,
    },
    dayLabel: {
        fontSize: 10,
        color: '#A0A0A0',
        fontWeight: '500',
    },
    activeDayLabel: {
        color: '#4285F4',
        fontWeight: 'bold',
    },
    graphFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 10,
    },
    trendText: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    targetText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    analisaButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    analisaText: {
        fontSize: 12,
        color: '#4285F4',
        fontWeight: 'bold',
        marginRight: 4,
    },
});

export default BloodSugarGraph;
