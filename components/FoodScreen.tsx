import * as React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TextInput
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/theme';
import AppHeader from './AppHeader';

const { width } = Dimensions.get('window');

interface FoodScreenProps {
    onOpenFoodInput: () => void;
    onOpenFoodDetail: (food: any) => void;
    cartCount: number;
    onOpenCart: () => void;
}

const FoodScreen: React.FC<FoodScreenProps> = ({
    onOpenFoodInput,
    onOpenFoodDetail,
    cartCount,
    onOpenCart
}) => {
    return (
        <View style={styles.container}>
            {/* Search Bar - Now scrolls with content */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <Ionicons name="search-outline" size={20} color="#94A3B8" style={{ marginRight: 10 }} />
                    <TextInput
                        placeholder="Cari menu atau restoran..."
                        placeholderTextColor="#94A3B8"
                        style={styles.searchInput}
                    />
                </View>
            </View>

            {/* Rekomendasi AI Section */}
            <View style={styles.sectionHeaderRow}>
                <View>
                    <Text style={styles.sectionTitle}>Rekomendasi AI</Text>
                    <Text style={styles.sectionSubtitle}>Disesuaikan Dengan Profilmu</Text>
                </View>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>Lihat Semua</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendScroll}
            >
                <RecommendationCard
                    image={require('../assets/images/insight_nutrition.png')}
                    title="Cauliflower Rice Bowl"
                    restaurant="Healthy Kitchen"
                    rating="4.9"
                    tags={['Low Carb', 'High Fiber']}
                    price="Rp 35.000"
                    calories="280 Kcal"
                    time="20 menit"
                    onPress={() => onOpenFoodDetail({
                        title: 'Cauliflower Rice Bowl',
                        price: 'Rp 35.000',
                        image: require('../assets/images/insight_nutrition.png')
                    })}
                />
                <RecommendationCard
                    image={require('../assets/images/insight_lifestyle.png')}
                    title="Tofu Stir Fry"
                    restaurant="Green Bowl Café"
                    rating="4.9"
                    tags={['High Protein']}
                    price="Rp 42.000"
                    calories="320 Kcal"
                    time="25 menit"
                    onPress={() => onOpenFoodDetail({
                        title: 'Tofu Stir Fry',
                        price: 'Rp 42.000',
                        image: require('../assets/images/insight_lifestyle.png')
                    })}
                />
            </ScrollView>

            {/* Restoran Terverifikasi Section */}
            <View style={styles.sectionHeaderRow}>
                <View>
                    <Text style={styles.sectionTitle}>Restoran Terverifikasi</Text>
                    <Text style={styles.sectionSubtitle}>Bebas gula tambahan & rendah karbo</Text>
                </View>
            </View>

            <View style={styles.restaurantList}>
                <RestaurantCard
                    image={require('../assets/images/onboarding_background.jpg')}
                    name="Health Kitchen"
                    category="Salad & Healthy"
                    distance="2.5 km"
                    rating="4.9"
                    onPress={() => onOpenFoodDetail({
                        title: 'Health Kitchen',
                        price: 'Restoran Terverifikasi',
                        image: require('../assets/images/onboarding_background.jpg')
                    })}
                />
                <RestaurantCard
                    image={require('../assets/images/onboarding_background_2.png')}
                    name="Green Bowl Café"
                    category="Salad & Healthy"
                    distance="2.5 km"
                    rating="4.9"
                    isLast={true}
                    onPress={() => onOpenFoodDetail({
                        title: 'Green Bowl Café',
                        price: 'Restoran Terverifikasi',
                        image: require('../assets/images/onboarding_background_2.png')
                    })}
                />
            </View>
        </View>
    );
};

const RecommendationCard = ({ image, title, restaurant, rating, tags, price, calories, time, onPress }: any) => (
    <TouchableOpacity
        style={styles.recommendCard}
        activeOpacity={0.9}
        onPress={onPress}
    >
        <Image
            source={image}
            style={styles.recommendImage}
            transition={300}
            priority="normal"
        />
        <View style={styles.recommendContent}>
            <Text style={styles.recommendTitle}>{title}</Text>
            <Text style={styles.recommendRestaurant}>{restaurant}</Text>

            <View style={styles.tagRow}>
                {tags.map((tag: string, i: number) => (
                    <View key={i} style={styles.tagBadge}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.infoRow}>
                <View style={styles.ratingCapsule}>
                    <Ionicons name="star" size={17} color="#FFB800" />
                    <Text style={styles.ratingText}>{rating}</Text>
                </View>
                <Text style={styles.priceText}>{price}</Text>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.statItem}>
                    <Ionicons name="flame-outline" size={20} color="#FFB800" />
                    <Text style={styles.statText}>{calories}</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="time-outline" size={20} color="#94A3B8" />
                    <Text style={styles.statText}>{time}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
);

const RestaurantCard = ({ image, name, category, distance, rating, isLast, onPress }: any) => (
    <TouchableOpacity
        style={[styles.restaurantCard, isLast && { marginBottom: 0 }]}
        activeOpacity={0.8}
        onPress={onPress}
    >
        <Image
            source={image}
            style={styles.restaurantImage}
            transition={200}
        />
        <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{name}</Text>
            <Text style={styles.restaurantCategory}>{category}</Text>

            <View style={styles.restaurantMetaRow}>
                <View style={styles.distanceInfo}>
                    <Ionicons name="location-outline" size={20} color="#94A3B8" />
                    <Text style={styles.distanceText}>{distance}</Text>
                </View>
                <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={17} color="#FFB800" />
                    <Text style={styles.ratingBadgeText}>{rating}</Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FE',
    },
    searchContainer: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1E293B',
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1E293B',
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#3B82F6',
        fontWeight: '600',
        marginTop: 2,
    },
    seeAllText: {
        fontSize: 14,
        color: '#3B82F6',
        fontWeight: '700',
    },
    recommendScroll: {
        paddingLeft: 24,
        paddingRight: 8,
        marginBottom: 24,
    },
    recommendCard: {
        width: 280,
        backgroundColor: '#fff',
        borderRadius: 28,
        marginRight: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
    },
    recommendImage: {
        width: '100%',
        height: 160,
    },
    recommendContent: {
        padding: 14,
    },
    recommendTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1E293B',
    },
    recommendRestaurant: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 2,
        marginBottom: 6,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    tagBadge: {
        backgroundColor: '#E6F7EF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginRight: 6,
        marginBottom: 6,
    },
    tagText: {
        fontSize: 12,
        color: '#00C853',
        fontWeight: '700',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 2,
    },
    ratingCapsule: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFB800',
        marginLeft: 4,
    },
    priceText: {
        fontSize: 15,
        fontWeight: '900',
        color: '#4285F4',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        fontSize: 13,
        color: '#94A3B8',
        marginLeft: 6,
        fontWeight: '700',
    },
    restaurantList: {
        paddingHorizontal: 24,
    },
    restaurantCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 5,
        elevation: 2,
    },
    restaurantImage: {
        width: 80,
        height: 80,
        borderRadius: 16,
    },
    restaurantInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
    },
    restaurantCategory: {
        fontSize: 13,
        color: '#94A3B8',
        marginTop: 2,
        marginBottom: 8,
    },
    restaurantMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    distanceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    distanceText: {
        fontSize: 13,
        color: '#94A3B8',
        marginLeft: 6,
        marginRight: 10,
        fontWeight: '700',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    ratingBadgeText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFB800',
        marginLeft: 4,
    },
});

export default FoodScreen;
