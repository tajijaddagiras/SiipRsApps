import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    TextStyle,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/theme';

interface AppHeaderProps {
    leftElement?: React.ReactNode;
    centerElement?: React.ReactNode;
    rightElement?: React.ReactNode;
    title?: string;
    subtitle?: string;
    showBack?: boolean;
    onBack?: () => void;
    containerStyle?: ViewStyle;
    titleStyle?: TextStyle;
    subtitleStyle?: TextStyle;
    align?: 'left' | 'center';
    variant?: 'default' | 'popup';
    contentColor?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    leftElement,
    centerElement,
    rightElement,
    title,
    subtitle,
    showBack,
    onBack,
    containerStyle,
    titleStyle,
    subtitleStyle,
    align = 'left',
    variant = 'default',
    contentColor = '#1E293B'
}) => {
    const isPopup = variant === 'popup';

    const renderTitle = (isAbsolute = false) => (
        <View style={[
            styles.titleContainer,
            (leftElement || showBack) && align === 'left' && !isAbsolute ? { marginLeft: 14 } : undefined,
            isAbsolute && { alignItems: 'center' }
        ]}>
            {title && <Text style={[styles.headerTitle, { color: contentColor }, titleStyle]}>{title}</Text>}
            {subtitle && <Text style={[styles.headerSubtitle, { color: isPopup ? '#64748B' : contentColor }, subtitleStyle]}>{subtitle}</Text>}
        </View>
    );

    return (
        <View style={[styles.headerContainer, containerStyle]}>
            {/* 1. Left Section */}
            <View style={styles.leftContent}>
                {showBack && (
                    <TouchableOpacity
                        onPress={onBack}
                        style={[
                            styles.backButton,
                            isPopup && styles.popupBackButton
                        ]}
                    >
                        <Ionicons name="arrow-back" size={24} color={contentColor} />
                    </TouchableOpacity>
                )}
                {leftElement}
                {/* Render title here if aligned left and NO custom center element exists */}
                {align === 'left' && !centerElement && renderTitle()}
            </View>

            {/* 2. Middle Section (Interactive if centerElement exists) */}
            {centerElement ? (
                <View style={styles.centerFlexArea}>
                    {centerElement}
                </View>
            ) : (
                align === 'center' && (
                    <View style={styles.centerAbsoluteArea} pointerEvents="none">
                        {renderTitle(true)}
                    </View>
                )
            )}

            {/* 3. Right Section */}
            <View style={styles.rightContent}>
                {rightElement}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: Colors.background,
        minHeight: 60,
        zIndex: 10,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 20,
    },
    centerFlexArea: {
        flex: 1,
        marginHorizontal: 12,
        justifyContent: 'center',
        zIndex: 20,
    },
    centerAbsoluteArea: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 20,
    },
    titleContainer: {
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1E293B',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    backButton: {
        width: 40,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    popupBackButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 5,
            },
            android: {
                elevation: 2,
            },
        }),
    },
});

export default AppHeader;
