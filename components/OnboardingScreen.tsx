import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { OnboardingItem } from '../types';

// Use 'window' for layout consistency with App.tsx
const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
    data: OnboardingItem[];
    currentStep: number;
    fadeAnim: Animated.Value;
    onboardingScroll: Animated.Value;
    dotScroll: Animated.Value;
    onNext: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
    data,
    currentStep,
    fadeAnim,
    onboardingScroll,
    dotScroll,
    onNext
}) => {

    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 1, backgroundColor: '#fff' }]}>
            {/* 1. Background Images - Native Driver for Smoothness */}
            <View style={styles.imageStack}>
                {data.map((item, index) => {
                    const opacity = onboardingScroll.interpolate({
                        inputRange: [
                            (index - 1) * width,
                            index * width,
                            (index + 1) * width
                        ],
                        outputRange: [0, 1, 0],
                        extrapolate: 'clamp'
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={[StyleSheet.absoluteFill, { opacity }]}
                        >
                            <Image
                                source={item.image}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="cover"
                                transition={0}
                                priority="high"
                                cachePolicy="memory-disk"
                            />
                        </Animated.View>
                    );
                })}
            </View>

            {/* 2. Content Card Wrapper */}
            <View style={[styles.contentContainer, { zIndex: 10 }]}>

                {/* 3. Text Content - Synchronized Sliding (Perfect 1:1 Window Units) */}
                <View style={styles.textStackArea}>
                    <Animated.View
                        style={{
                            flexDirection: 'row',
                            width: width * data.length,
                            transform: [{
                                translateX: onboardingScroll.interpolate({
                                    inputRange: [0, width * (data.length - 1)],
                                    outputRange: [0, -width * (data.length - 1)],
                                    extrapolate: 'clamp'
                                })
                            }]
                        }}
                    >
                        {data.map((item, index) => (
                            <View key={index} style={[styles.textPage, { width: width }]}>
                                <View style={styles.textInnerWrapper}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                                </View>
                            </View>
                        ))}
                    </Animated.View>
                </View>

                {/* 4. Controls - Elastic Dots & Button */}
                <View style={styles.bottomSection}>
                    <View style={styles.paginationContainer}>
                        {data.map((_, index) => {
                            const dotWidth = dotScroll.interpolate({
                                inputRange: [
                                    (index - 1) * width,
                                    index * width,
                                    (index + 1) * width
                                ],
                                outputRange: [8, 24, 8],
                                extrapolate: 'clamp'
                            });

                            const dotColor = dotScroll.interpolate({
                                inputRange: [
                                    (index - 1) * width,
                                    index * width,
                                    (index + 1) * width
                                ],
                                outputRange: ['#E0E0E0', '#4285F4', '#E0E0E0'],
                                extrapolate: 'clamp'
                            });

                            return (
                                <Animated.View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        {
                                            width: dotWidth,
                                            backgroundColor: dotColor
                                        }
                                    ]}
                                />
                            );
                        })}
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.8}
                        onPress={onNext}
                    >
                        <Animated.View style={{ opacity: fadeAnim }}>
                            <Text style={styles.buttonText}>
                                {currentStep === data.length - 1 ? 'Memulai' : 'Berikutnya'}
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    imageStack: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height * 0.65,
    },
    contentContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.48, // Balanced height for text safety and aesthetics
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 35, // Slightly reduced to save space
        paddingBottom: 35,
        alignItems: 'center',
    },
    textStackArea: {
        flex: 1,
        width: width,
        position: 'relative',
        overflow: 'hidden',
    },
    textPage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInnerWrapper: {
        width: '100%',
        paddingHorizontal: 48, // Secure horizontal space
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        marginBottom: 12, // Slightly reduced
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20, // Slightly more compact
    },
    bottomSection: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 24,
    },
    paginationContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        height: 10,
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    button: {
        backgroundColor: '#4285F4',
        width: '100%',
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default OnboardingScreen;
