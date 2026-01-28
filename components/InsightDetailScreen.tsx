import * as React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Animated,
    StyleSheet,
    Dimensions,
    StatusBar,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface InsightDetailScreenProps {
    detailOpacity: Animated.Value;
    showDetail: boolean;
    onBack: () => void;
    insightData: any;
}

const InsightDetailScreen: React.FC<InsightDetailScreenProps> = ({
    detailOpacity,
    showDetail,
    onBack,
    insightData
}) => {
    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: detailOpacity,
                    pointerEvents: showDetail ? 'auto' : 'none',
                    zIndex: 5000,
                }
            ]}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            {insightData ? (
                <View
                    key={insightData.id}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        style={styles.container}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {/* Header Image Section */}
                        <View style={styles.imageContainer}>
                            <Image
                                source={insightData.image}
                                style={styles.headerImage}
                            />

                            {/* Back Button Overlay */}
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={onBack}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="arrow-back" size={24} color="#1E293B" />
                            </TouchableOpacity>
                        </View>

                        {/* Content Card */}
                        <View style={styles.contentCard}>
                            {/* Header Info */}
                            <View style={styles.cardHeader}>
                                <Text style={styles.title}>{insightData?.title || 'Informasi Kesehatan'}</Text>
                                <View style={[styles.tag, { backgroundColor: insightData?.tagColor || (insightData?.tag === 'NUTRISI' ? '#E6F7EF' : '#FDF0F5') }]}>
                                    <Text style={[styles.tagText, { color: insightData?.textColor || (insightData?.tag === 'NUTRISI' ? '#00C853' : '#E91E63') }]}>
                                        {insightData?.tag || 'KESEHATAN'}
                                    </Text>
                                </View>
                            </View>

                            {/* Article Body */}
                            <View style={styles.articleBody}>
                                <Text style={styles.paragraph}>
                                    Indeks glikemik (IG) adalah ukuran yang menunjukkan seberapa cepat makanan meningkatkan kadar gula darah setelah dikonsumsi. Semakin tinggi nilai IG suatu makanan, semakin cepat gula darah naik dan semakin besar beban yang harus ditangani tubuh, terutama oleh penderita diabetes. Karena itu, memilih makanan dengan nilai IG rendah hingga sedang menjadi strategi penting dalam menjaga kestabilan glukosa harian.
                                </Text>

                                <Text style={styles.paragraph}>
                                    Dengan memahami nilai indeks glikemik, penyandang diabetes dapat mengatur pola makan lebih cerdas tanpa harus menghilangkan makanan favorit. Karbohidrat kompleks seperti nasi merah, oat, ubi, dan buah tertentu cenderung memiliki IG rendah sehingga memberikan energi lebih stabil dan tahan lama. Mengombinasikan makanan berserat, protein, dan lemak sehat juga membantu memperlambat penyerapan gula, menjaga kondisi tetap aman, dan mendukung kendali diabetes yang lebih baik setiap hari.
                                </Text>
                            </View>

                            <View style={{ height: 100 }} />
                        </View>
                    </ScrollView>
                </View>
            ) : null}
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
        backgroundColor: '#F8FAFC',
    },
    imageContainer: {
        width: width,
        height: height * 0.45,
        position: 'relative',
    },
    headerImage: {
        width: width,
        height: height * 0.45,
        backgroundColor: '#f1f5f9', // Added placeholder color
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    contentCard: {
        flex: 1,
        marginTop: -40, // Pull up to overlap with image
        backgroundColor: '#fff',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 28,
        paddingTop: 32,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1E293B',
        flex: 1,
        marginRight: 12,
        lineHeight: 32,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    articleBody: {
        marginTop: 8,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 26,
        color: '#64748B',
        textAlign: 'justify',
        marginBottom: 20,
        fontWeight: '400',
    },
});

export default InsightDetailScreen;
