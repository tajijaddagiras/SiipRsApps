import * as React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Animated,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/theme';
import AppHeader from './AppHeader';

const { width } = Dimensions.get('window');

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'expert';
    time: string;
}

interface ChatDetailScreenProps {
    detailOpacity: Animated.Value;
    showDetail: boolean;
    onBack: () => void;
    chatData: any;
}

const EXPERT_MESSAGES = [
    {
        id: 1,
        text: 'Halo, saya baru terdiagnosa diabetes tipe 2.\nBisa bantu jelaskan apa yang harus saya mulai dulu?',
        sender: 'user',
        time: '10.05'
    },
    {
        id: 2,
        name: 'Ahli Gizi',
        nameColor: '#4285F4',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        text: 'Tentu kak, kami siap bantu. Apakah ingin fokus ke pola makan dulu atau manajemen gaya hidup keseluruhan?',
        sender: 'expert',
        time: '10.06'
    },
    {
        id: 3,
        text: 'Saya ingin tahu soal makanan dulu. Apa saja yang aman, tapi tetap enak untuk dimakan?',
        sender: 'user',
        time: '10.07'
    },
    {
        id: 4,
        name: 'Ahli Gizi',
        nameColor: '#4285F4',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        text: 'Bisa banget. Kami punya contoh menu seimbang setiap hari — mulai dari pilihan karbo yang tepat, jenis protein terbaik, sampai rekomendasi camilan rendah gula.',
        sender: 'expert',
        time: '10.08'
    }
];

const COMMUNITY_MESSAGES = [
    {
        id: 1,
        text: 'Halo, saya baru dapat diagnosa diabetes tipe 2.\nBisa bantu jelaskan apa yang harus saya lakukan dulu?',
        sender: 'user',
        time: '10.05'
    },
    {
        id: 2,
        name: 'Farel',
        nameColor: '#FF5252',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        text: 'Tentu, kami siap membantu. Apakah Anda ingin mulai dari pola makan atau gaya hidup?',
        sender: 'expert',
        time: '10.06'
    },
    {
        id: 3,
        text: 'Saya ingin tahu dulu soal makanan. Apa saja yang aman tapi tetap enak?',
        sender: 'user',
        time: '10.07'
    },
    {
        id: 4,
        name: 'Rahmat',
        nameColor: '#FF9800',
        avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
        text: 'Kami punya panduan menu harian, kak. Mulai dari pengaturan karbohidrat, protein seimbang, sampai pilihan snack rendah gula.',
        sender: 'expert',
        time: '10.08'
    },
    {
        id: 5,
        name: 'Fitri',
        nameColor: '#4CAF50',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        text: 'Tenang, kami akan bantu damping sampai kondisi gula darah stabil. Kapan pun butuh arahan silakan chat ya.',
        sender: 'expert',
        time: '10.08'
    }
];

const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({ detailOpacity, showDetail, onBack, chatData }) => {
    const messages = React.useMemo(() => {
        const isCommunity = chatData?.id === 2 || chatData?.name === 'Pejuang Diabetes';
        return isCommunity ? COMMUNITY_MESSAGES : EXPERT_MESSAGES;
    }, [chatData?.id, chatData?.name]);

    const isCommunity = chatData?.id === 2 || chatData?.name === 'Pejuang Diabetes';

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: detailOpacity,
                    pointerEvents: showDetail ? 'auto' : 'none',
                    zIndex: 4000,
                }
            ]}
        >
            <View style={styles.container}>
                {/* Manual Header Spacing for Android Stability */}
                <View style={{ height: Platform.OS === 'ios' ? 50 : 40 }} />
                {/* Header */}
                <AppHeader
                    showBack
                    onBack={onBack}
                    variant="popup"
                    align="left"
                    leftElement={
                        <View style={styles.headerInfo}>
                            <Image
                                source={{ uri: chatData?.avatar }}
                                style={styles.avatar}
                            />
                            <View style={styles.headerText}>
                                <Text style={styles.headerName}>{chatData?.name || ''}</Text>
                                <View style={styles.onlineContainer}>
                                    <View style={styles.onlineDot} />
                                    <Text style={styles.onlineText}>
                                        {isCommunity ? '13 Online' : 'Online'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    }
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        style={styles.chatArea}
                        contentContainerStyle={styles.chatContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.dateStamp}>Hari ini, 10.00</Text>

                        {messages.map((msg) => (
                            <View
                                key={msg.id}
                                style={[
                                    styles.bubbleWrapper,
                                    msg.sender === 'user' ? styles.userWrapper : styles.expertWrapper
                                ]}
                            >
                                {msg.sender === 'expert' && (
                                    <Image
                                        source={{ uri: msg.avatar }}
                                        style={styles.bubbleAvatar}
                                    />
                                )}
                                <View style={[
                                    styles.bubble,
                                    msg.sender === 'user' ? styles.userBubble : styles.expertBubble
                                ]}>
                                    {msg.sender === 'expert' && msg.name && (
                                        <Text style={[styles.senderName, { color: msg.nameColor }]}>
                                            {msg.name}
                                        </Text>
                                    )}
                                    <Text style={[
                                        styles.bubbleText,
                                        msg.sender === 'user' ? styles.userText : styles.expertText
                                    ]}>
                                        {msg.text}
                                    </Text>
                                    <View style={styles.timeWrapper}>
                                        <Text style={[
                                            styles.timeText,
                                            msg.sender === 'user' ? styles.userTime : styles.expertTime
                                        ]}>
                                            {msg.time}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Footer Input */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.attachButton}>
                            <Ionicons name="link-outline" size={24} color="#94A3B8" />
                        </TouchableOpacity>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                placeholder="Ketik Pesan..."
                                style={styles.input}
                                placeholderTextColor="#94A3B8"
                            />
                        </View>

                        <TouchableOpacity style={styles.sendButton}>
                            <Ionicons name="paper-plane" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
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
    headerInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E2E8F0',
    },
    headerText: {
        marginLeft: 12,
    },
    headerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    onlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    onlineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#22C55E',
        marginRight: 4,
    },
    onlineText: {
        fontSize: 12,
        color: '#22C55E',
        fontWeight: '600',
    },
    chatArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    chatContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    dateStamp: {
        textAlign: 'center',
        fontSize: 12,
        color: '#94A3B8',
        marginVertical: 20,
    },
    bubbleWrapper: {
        marginBottom: 16,
        flexDirection: 'row',
        width: '100%',
    },
    userWrapper: {
        justifyContent: 'flex-end',
    },
    expertWrapper: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '85%',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 8,
        borderRadius: 20,
    },
    userBubble: {
        backgroundColor: '#4285F4',
        borderTopRightRadius: 4,
    },
    expertBubble: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    bubbleText: {
        fontSize: 14,
        lineHeight: 20,
    },
    userText: {
        color: '#fff',
    },
    expertText: {
        color: '#334155',
        fontWeight: '500',
    },
    senderName: {
        fontSize: 13,
        fontWeight: '800',
        marginBottom: 4,
    },
    bubbleAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    timeWrapper: {
        alignItems: 'flex-end',
        marginTop: 4,
    },
    timeText: {
        fontSize: 10,
    },
    userTime: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    expertTime: {
        color: '#94A3B8',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 40, // Added more space for iPhone home indicator
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    attachButton: {
        padding: 8,
    },
    inputWrapper: {
        flex: 1,
        height: 48,
        backgroundColor: '#F8FAFC',
        borderRadius: 24,
        paddingHorizontal: 16,
        marginHorizontal: 12,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    input: {
        fontSize: 14,
        color: '#1E293B',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
});

export default React.memo(ChatDetailScreen);
