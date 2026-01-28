import * as React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../styles/theme';
import AppHeader from './AppHeader';

const { width } = Dimensions.get('window');

interface SearchScreenProps {
    showSearch: boolean;
    searchOpacity: Animated.Value;
    onClose: () => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({
    showSearch,
    searchOpacity,
    onClose
}) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [shouldFocus, setShouldFocus] = React.useState(false);

    // Lazy Focus for Android stability: wait for transition animation to finish (approx 300ms)
    React.useEffect(() => {
        if (showSearch) {
            const timer = setTimeout(() => {
                setShouldFocus(true);
            }, 350);
            return () => clearTimeout(timer);
        } else {
            setShouldFocus(false);
        }
    }, [showSearch]);

    return (
        <Animated.View
            renderToHardwareTextureAndroid={true}
            style={[
                styles.overlay,
                {
                    opacity: searchOpacity,
                    pointerEvents: showSearch ? 'auto' : 'none',
                    zIndex: 2500,
                }
            ]}
        >
            <SafeAreaView style={styles.container}>
                {/* Search Header - Exact as Design */}
                <AppHeader
                    showBack
                    onBack={onClose}
                    variant="popup"
                    centerElement={
                        <View style={styles.searchBarContainer}>
                            <Ionicons name="search-outline" size={20} color="#94A3B8" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Cari makanan atau nutrisi..."
                                placeholderTextColor="#94A3B8"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoFocus={shouldFocus}
                            />
                        </View>
                    }
                    rightElement={
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="options-outline" size={22} color="#1E293B" />
                        </TouchableOpacity>
                    }
                />

                {/* Search Results Area */}
                <View style={styles.content}>
                    {searchQuery === '' ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={80} color="#F0F0F0" />
                            <Text style={styles.emptyText}>Cari informasi kesehatan dan lainnya...</Text>
                        </View>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Hasil pencarian untuk "{searchQuery}"</Text>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    iconButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F5F7FA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    searchBarContainer: {
        flex: 1,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#F5F7FA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -50,
    },
    emptyText: {
        fontSize: 16,
        color: '#A0B0C4',
        textAlign: 'center',
        marginTop: 16,
        paddingHorizontal: 40,
    },
});

export default React.memo(SearchScreen);
