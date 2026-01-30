import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { OnboardingItem } from '../types';

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
    const { width, height } = useWindowDimensions();
    const isDesktop = width > 768;

    // ========== MOBILE LAYOUT (Original - Untouched) ==========
    if (!isDesktop) {
        return (
            <View style={[StyleSheet.absoluteFill, { zIndex: 1, backgroundColor: '#fff' }]}>
                {/* 1. Background Images - Stacked at Top */}
                <View style={styles.mobileImageStack}>
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

                {/* 2. Content Card - Bottom Overlay */}
                <View style={styles.mobileContentContainer}>
                    {/* 3. Text Content - Sliding */}
                    <View style={styles.mobileTextStackArea}>
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
                                <View key={index} style={[styles.mobileTextPage, { width }]}>
                                    <View style={styles.mobileTextInnerWrapper}>
                                        <Text style={styles.mobileTitle}>{item.title}</Text>
                                        <Text style={styles.mobileSubtitle}>{item.subtitle}</Text>
                                    </View>
                                </View>
                            ))}
                        </Animated.View>
                    </View>

                    {/* 4. Controls - Dots & Button */}
                    <View style={styles.mobileBottomSection}>
                        <View style={styles.mobilePaginationContainer}>
                            {data.map((_, index) => {
                                const dotDisplayWidth = dotScroll.interpolate({
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
                                            styles.mobileDot,
                                            {
                                                width: dotDisplayWidth,
                                                backgroundColor: dotColor
                                            }
                                        ]}
                                    />
                                );
                            })}
                        </View>

                        <TouchableOpacity
                            style={styles.mobileButton}
                            activeOpacity={0.8}
                            onPress={onNext}
                        >
                            <Animated.View style={{ opacity: fadeAnim }}>
                                <Text style={styles.mobileButtonText}>
                                    {currentStep === data.length - 1 ? 'Memulai' : 'Berikutnya'}
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    // ========== DESKTOP LAYOUT (Split View) ==========
    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 1, backgroundColor: '#fff', flexDirection: 'row' }]}>
            {/* Left Side - Image */}
            <View style={styles.desktopImageContainer}>
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

            {/* Right Side - Content */}
            <View style={styles.desktopContentContainer}>
                {/* Text Content */}
                <View style={styles.desktopTextStackArea}>
                    <Animated.View
                        style={{
                            flexDirection: 'row',
                            width: (width / 2) * data.length,
                            transform: [{
                                translateX: onboardingScroll.interpolate({
                                    inputRange: [0, width * (data.length - 1)],
                                    outputRange: [0, -(width / 2) * (data.length - 1)],
                                    extrapolate: 'clamp'
                                })
                            }]
                        }}
                    >
                        {data.map((item, index) => (
                            <View key={index} style={[styles.desktopTextPage, { width: width / 2 }]}>
                                <View style={styles.desktopTextInnerWrapper}>
                                    <Text style={styles.desktopTitle}>{item.title}</Text>
                                    <Text style={styles.desktopSubtitle}>{item.subtitle}</Text>
                                </View>
                            </View>
                        ))}
                    </Animated.View>
                </View>

                {/* Controls */}
                <View style={styles.desktopBottomSection}>
                    <View style={styles.desktopPaginationContainer}>
                        {data.map((_, index) => {
                            const dotDisplayWidth = dotScroll.interpolate({
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
                                        styles.desktopDot,
                                        {
                                            width: dotDisplayWidth,
                                            backgroundColor: dotColor
                                        }
                                    ]}
                                />
                            );
                        })}
                    </View>

                    <TouchableOpacity
                        style={styles.desktopButton}
                        activeOpacity={0.8}
                        onPress={onNext}
                    >
                        <Animated.View style={{ opacity: fadeAnim }}>
                            <Text style={styles.desktopButtonText}>
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
    // ========== MOBILE STYLES (Original) ==========
    mobileImageStack: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60%',
        backgroundColor: '#F8F9FA',
    },
    mobileContentContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingTop: 40,
        paddingBottom: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 10,
        zIndex: 10,
    },
    mobileTextStackArea: {
        flex: 1,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
    },
    mobileTextPage: {
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    mobileTextInnerWrapper: {
        width: '100%',
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    mobileTitle: {
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        color: '#000',
        marginBottom: 16,
        lineHeight: 36,
    },
    mobileSubtitle: {
        fontSize: 15,
        color: '#777',
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '400',
    },
    mobileBottomSection: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 24,
    },
    mobilePaginationContainer: {
        flexDirection: 'row',
        marginBottom: 35,
        height: 10,
        alignItems: 'center',
    },
    mobileDot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 3,
    },
    mobileButton: {
        backgroundColor: '#4285F4',
        width: '100%',
        paddingVertical: 18,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 5,
    },
    mobileButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },

    // ========== DESKTOP STYLES ==========
    desktopImageContainer: {
        width: '50%',
        height: '100%',
        backgroundColor: '#F8F9FA',
    },
    desktopContentContainer: {
        width: '50%',
        height: '100%',
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    desktopTextStackArea: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    desktopTextPage: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    desktopTextInnerWrapper: {
        width: '100%',
        paddingHorizontal: 60,
    },
    desktopTitle: {
        fontSize: 36,
        fontWeight: '800',
        textAlign: 'left',
        color: '#000',
        marginBottom: 20,
        lineHeight: 44,
    },
    desktopSubtitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'left',
        lineHeight: 28,
        fontWeight: '400',
    },
    desktopBottomSection: {
        alignItems: 'flex-start',
        width: '100%',
        paddingHorizontal: 60,
    },
    desktopPaginationContainer: {
        flexDirection: 'row',
        marginBottom: 40,
        height: 10,
        alignItems: 'center',
    },
    desktopDot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 3,
    },
    desktopButton: {
        backgroundColor: '#4285F4',
        width: '80%',
        maxWidth: 400,
        paddingVertical: 18,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 5,
    },
    desktopButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});

export default OnboardingScreen;

