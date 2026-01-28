import * as React from 'react';
import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Animated,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../styles/theme';
import AppHeader from './AppHeader';

interface ReviewScreenProps {
    isVisible: boolean;
    opacity: Animated.Value;
    onClose: () => void;
    onSubmit: (rating: number, review: string) => void;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({
    isVisible,
    opacity,
    onClose,
    onSubmit,
}) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    const handleSubmit = () => {
        if (rating > 0) {
            onSubmit(rating, reviewText);
            // Reset state
            setRating(0);
            setReviewText('');
        }
    };

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.container,
                {
                    opacity: opacity,
                    pointerEvents: isVisible ? 'auto' : 'none',
                },
            ]}
        >
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    {/* Header */}
                    <AppHeader
                        title="Beri Nilai"
                        showBack
                        onBack={onClose}
                        variant="popup"
                        align="center"
                    />

                    {/* Content */}
                    <View style={styles.content}>
                        {/* Star Rating */}
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => setRating(star)}
                                    style={styles.starButton}
                                >
                                    <Ionicons
                                        name={star <= rating ? 'star' : 'star-outline'}
                                        size={48}
                                        color="#FBBF24"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Review Text Input */}
                        <View style={styles.textInputContainer}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Tulis Ulasan Anda (minimal 10 kata)..."
                                placeholderTextColor="#94A3B8"
                                multiline
                                numberOfLines={6}
                                value={reviewText}
                                onChangeText={setReviewText}
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    {/* Submit Button */}
                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={rating === 0}
                        >
                            <Text style={styles.submitButtonText}>Kirim Review</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        zIndex: 1100,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 32,
    },
    starButton: {
        padding: 4,
    },
    textInputContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        padding: 16,
        minHeight: 150,
    },
    textInput: {
        fontSize: 14,
        color: '#1E293B',
        lineHeight: 22,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        paddingTop: 16,
    },
    submitButton: {
        height: 56,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});

export default ReviewScreen;
