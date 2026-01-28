import * as React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Animated,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/theme';
import AppHeader from './AppHeader';

const { width } = Dimensions.get('window');

interface ChatScreenProps {
    chatOpacity: Animated.Value;
    showChat: boolean;
    onBack: () => void;
    onOpenChatDetail: (chat: any) => void;
}

// Sample conversation data
const conversations = [
    {
        id: 1,
        name: 'Ahli Gizi',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        lastMessage: 'Come here to room 101 soon, okay?',
        time: '22:32',
        unread: true,
    },
    {
        id: 2,
        name: 'Pejuang Diabetes',
        avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=100',
        lastMessage: 'Tenang, kami akan bantu dampin...',
        time: '22:32',
        unread: true,
    },
];

const ChatScreen: React.FC<ChatScreenProps> = ({ chatOpacity, showChat, onBack, onOpenChatDetail }) => {

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: chatOpacity,
                    pointerEvents: showChat ? 'auto' : 'none',
                    zIndex: 3000,
                }
            ]}
        >
            <SafeAreaView style={styles.container} edges={['top']}>
                {/* Header */}
                <AppHeader
                    title="Obrolan"
                    showBack
                    onBack={onBack}
                    align="center"
                    variant="popup"
                />

                {/* Conversation List */}
                <ScrollView
                    style={styles.conversationList}
                    contentContainerStyle={styles.chatScrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {conversations.map((conv) => (
                        <TouchableOpacity
                            key={conv.id}
                            style={styles.conversationItem}
                            onPress={() => onOpenChatDetail(conv)}
                            activeOpacity={0.6}
                            delayPressIn={0}
                        >
                            {/* Avatar */}
                            <Image
                                source={{ uri: conv.avatar }}
                                style={styles.avatar}
                            />

                            {/* Content */}
                            <View style={styles.conversationContent}>
                                <Text style={styles.conversationName}>{conv.name}</Text>
                                <Text style={styles.conversationPreview} numberOfLines={1}>
                                    {conv.lastMessage}
                                </Text>
                            </View>

                            {/* Right Side - Time and Unread Indicator */}
                            <View style={styles.conversationRight}>
                                <Text style={styles.conversationTime}>{conv.time}</Text>
                                {conv.unread && <View style={styles.unreadDot} />}
                            </View>
                        </TouchableOpacity>
                    ))}
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
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    conversationList: {
        flex: 1,
        paddingTop: 8,
    },
    chatScrollContent: {
        paddingBottom: 140, // Standardized bottom clearance
    },
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E2E8F0',
    },
    conversationContent: {
        flex: 1,
        marginLeft: 12,
    },
    conversationName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    conversationPreview: {
        fontSize: 14,
        color: '#94A3B8',
    },
    conversationRight: {
        alignItems: 'flex-end',
        marginLeft: 10,
    },
    conversationTime: {
        fontSize: 12,
        color: '#94A3B8',
        marginBottom: 6,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4285F4',
    },
});

export default React.memo(ChatScreen);
