import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TextInput,
    Dimensions,
    Keyboard
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Asset } from 'expo-asset';
import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';

// Prevent auto-hiding before assets are loaded
SplashScreen.preventAutoHideAsync().catch(() => { });

// Modules
import OnboardingScreen from './components/OnboardingScreen';
import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import NotificationScreen from './components/NotificationScreen';
import SearchScreen from './components/SearchScreen';
import BloodSugarInputScreen from './components/BloodSugarInputScreen';
import FoodInputScreen from './components/FoodInputScreen';
import DailyAnalysisScreen from './components/DailyAnalysisScreen';
import ChatScreen from './components/ChatScreen';
import ChatDetailScreen from './components/ChatDetailScreen';
import InsightDetailScreen from './components/InsightDetailScreen';
import FoodDetailScreen from './components/FoodDetailScreen';
import CheckoutScreen from './components/CheckoutScreen';
import PaymentVAScreen from './components/PaymentVAScreen';
import TransactionLoadingScreen from './components/TransactionLoadingScreen';
import OrderSuccessScreen from './components/OrderSuccessScreen';
import CartScreen from './components/CartScreen';
import EditProfileScreen from './components/EditProfileScreen';
import MealActivityScreen from './components/MealActivityScreen';
import ReviewScreen from './components/ReviewScreen';
import OrderDetailScreen from './components/OrderDetailScreen';
import AddAddressScreen from './components/AddAddressScreen';
import AccountSecurityScreen from './components/AccountSecurityScreen';
import EditPasswordScreen from './components/EditPasswordScreen';
import SuccessModal from './components/SuccessModal';
import LogoutModal from './components/LogoutModal';
import PremiumScreen from './components/PremiumScreen';

import { onboardingData } from './constants/data';
import { AuthTab } from './types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
    // === STATE MANAGEMENT ===
    const [currentStep, setCurrentStep] = useState(0);
    const [showLogin, setShowLogin] = useState(false);
    const [activeTab, setActiveTab] = useState<AuthTab>('Masuk');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showHome, setShowHome] = useState(false);
    const [activeHomeTab, setActiveHomeTab] = useState('Home');
    const [appIsReady, setAppIsReady] = useState(false);

    // Auth Flow States
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showOTPVerification, setShowOTPVerification] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showCheckBloodSugar, setShowCheckBloodSugar] = useState(false);
    const [showFoodInput, setShowFoodInput] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showChatDetail, setShowChatDetail] = useState(false);
    const [showInsightDetail, setShowInsightDetail] = useState(false);
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [selectedInsight, setSelectedInsight] = useState<any>(null);
    const [showFoodDetail, setShowFoodDetail] = useState(false);
    const [foodDetailData, setFoodDetailData] = useState<any>(null);
    const [checkoutData, setCheckoutData] = useState<any>(null); // Separate state for checkout to avoid re-rendering detail
    const [showCheckout, setShowCheckout] = useState(false);
    const [showPaymentVA, setShowPaymentVA] = useState(false);
    const [showTransactionLoading, setShowTransactionLoading] = useState(false);
    const [showOrderSuccess, setShowOrderSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('Data Berhasil Tersimpan');
    const [activePaymentType, setActivePaymentType] = useState<'food' | 'premium'>('food');

    // Cart State
    const [showCart, setShowCart] = useState(false);
    const [cartCount, setCartCount] = useState(3); // Mock count for badge
    const [showDataSavedSuccess, setShowDataSavedSuccess] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showMealActivity, setShowMealActivity] = useState(false);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [showSecurityAccount, setShowSecurityAccount] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [isChangingPasswordFromProfile, setIsChangingPasswordFromProfile] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [otpSelection, setOtpSelection] = useState({ start: 0, end: 0 });
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    // Premium State (Simpler now)
    const [showPremium, setShowPremium] = useState(false);

    // === ANIMATIONS ===
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const loginOpacity = useRef(new Animated.Value(0)).current;
    const homeOpacity = useRef(new Animated.Value(0)).current;
    const forgotPasswordOpacity = useRef(new Animated.Value(0)).current;
    const otpVerificationOpacity = useRef(new Animated.Value(0)).current;
    const resetPasswordOpacity = useRef(new Animated.Value(0)).current;
    const successScreenOpacity = useRef(new Animated.Value(0)).current;
    const notificationsOpacity = useRef(new Animated.Value(0)).current;
    const searchOpacity = useRef(new Animated.Value(0)).current;
    const checkBloodSugarOpacity = useRef(new Animated.Value(0)).current;
    const foodInputOpacity = useRef(new Animated.Value(0)).current;
    const analysisOpacity = useRef(new Animated.Value(0)).current;
    const chatOpacity = useRef(new Animated.Value(0)).current;
    const chatDetailOpacity = useRef(new Animated.Value(0)).current;
    const insightDetailOpacity = useRef(new Animated.Value(0)).current;
    const foodDetailOpacity = useRef(new Animated.Value(0)).current;
    const dataSavedSuccessOpacity = useRef(new Animated.Value(0)).current;
    const checkoutOpacity = useRef(new Animated.Value(0)).current;
    const vaOpacity = useRef(new Animated.Value(0)).current;
    const transactionLoadingOpacity = useRef(new Animated.Value(0)).current;
    const orderSuccessOpacity = useRef(new Animated.Value(0)).current;
    const cartOpacity = useRef(new Animated.Value(0)).current;
    const editProfileOpacity = useRef(new Animated.Value(0)).current;
    const mealActivityOpacity = useRef(new Animated.Value(0)).current;
    const orderDetailOpacity = useRef(new Animated.Value(0)).current;
    const addAddressOpacity = useRef(new Animated.Value(0)).current;
    const securityAccountOpacity = useRef(new Animated.Value(0)).current;
    const editPasswordOpacity = useRef(new Animated.Value(0)).current;
    const reviewOpacity = useRef(new Animated.Value(0)).current;
    const logoutModalOpacity = useRef(new Animated.Value(0)).current;
    const premiumOpacity = useRef(new Animated.Value(0)).current;
    const appOpacity = useRef(new Animated.Value(0)).current;
    const splashOpacity = useRef(new Animated.Value(1)).current;
    const splashContentOpacity = useRef(new Animated.Value(0)).current;
    const splashLogoScale = useRef(new Animated.Value(0.2)).current;
    const splashTopRightXY = useRef(new Animated.ValueXY({ x: -SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 })).current;
    const splashBottomLeftXY = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH / 2, y: -SCREEN_HEIGHT / 2 })).current;
    const slideAnim = useRef(new Animated.Value(20)).current; // Start slightly lower
    const onboardingScroll = useRef(new Animated.Value(0)).current;
    const dotScroll = useRef(new Animated.Value(0)).current;

    const COMMUNITY_CHAT_DATA = {
        id: 2,
        name: 'Pejuang Diabetes',
        avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=100',
        lastMessage: 'Tenang, kami akan bantu dampin...',
        time: '22:32',
        unread: true,
    };

    // === PRELOADING ASSETS ===
    useEffect(() => {
        async function prepare() {
            try {
                // Preload local assets
                const images = [
                    require('./assets/images/insight_nutrition.png'),
                    require('./assets/images/insight_lifestyle.png'),
                    require('./assets/images/insight_community.png'),
                    require('./assets/images/onboarding_background.jpg'),
                    require('./assets/images/onboarding_background_2.png'),
                    require('./assets/images/onboarding_background_3.jpg'),
                    require('./assets/images/logo.png'),
                    require('./assets/images/logosplash.png'),
                ];

                const cacheImages = images.map(image => Asset.fromModule(image).downloadAsync());

                // Preload remote assets (Avatars)
                const remoteImages = [
                    'https://randomuser.me/api/portraits/men/32.jpg',
                    'https://randomuser.me/api/portraits/women/44.jpg',
                    'https://randomuser.me/api/portraits/women/45.jpg',
                    'https://randomuser.me/api/portraits/men/12.jpg',
                    'https://randomuser.me/api/portraits/women/22.jpg'
                ];

                await Promise.all([
                    ...cacheImages,
                    Image.prefetch(remoteImages)
                ]);
            } catch (e) {
                console.warn(e);
            } finally {
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    useEffect(() => {
        if (appIsReady) {
            // 1. Instantly hide the white native splash
            SplashScreen.hideAsync().catch(() => { });

            // 2. Phase 1: Wait 0.1 second (pure blue background)
            const introTimer = setTimeout(() => {
                // Phase 2: Animate elements in (Zoom & Slide)
                Animated.parallel([
                    Animated.timing(splashContentOpacity, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.spring(splashLogoScale, {
                        toValue: 1,
                        friction: 5,
                        tension: 40,
                        useNativeDriver: true,
                    }),
                    Animated.spring(splashTopRightXY, {
                        toValue: { x: 0, y: 0 },
                        friction: 6,
                        tension: 30,
                        useNativeDriver: true,
                    }),
                    Animated.spring(splashBottomLeftXY, {
                        toValue: { x: 0, y: 0 },
                        friction: 6,
                        tension: 30,
                        useNativeDriver: true,
                    })
                ]).start();
            }, 100);

            // 3. Phase 3: Total 4 seconds wait then Transition to Onboarding
            const exitTimer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(appOpacity, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(splashOpacity, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    })
                ]).start();
            }, 4000);

            return () => {
                clearTimeout(introTimer);
                clearTimeout(exitTimer);
            };
        }
    }, [appIsReady]);

    // Refs for OTP
    const inputRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    // === HANDLERS ===
    const handleNext = () => {
        if (currentStep < onboardingData.length - 1) {
            // 1. Start scrolling immediately
            // Images & Text use Native Driver for 60fps
            // Dots use JS Driver for flexible width/color animation
            Animated.parallel([
                Animated.timing(onboardingScroll, {
                    toValue: (currentStep + 1) * SCREEN_WIDTH,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(dotScroll, {
                    toValue: (currentStep + 1) * SCREEN_WIDTH,
                    duration: 500,
                    useNativeDriver: false,
                })
            ]).start();

            // 2. Schedule state update for button label
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
            }, 250);
        } else {
            setShowLogin(true);
            Animated.timing(loginOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleLogin = () => {
        setShowHome(true);
        Animated.timing(homeOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setShowLogin(false);
            loginOpacity.setValue(0); // Clean up for next logout
        });
    };

    const handleForgotPassword = (show: boolean) => {
        setShowForgotPassword(show);
        Animated.timing(forgotPasswordOpacity, {
            toValue: show ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleSendOTP = () => {
        setOtpCode('');
        setOtpSelection({ start: 0, end: 0 });
        setShowOTPVerification(true);
        Animated.timing(otpVerificationOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseOTP = () => {
        if (isChangingPasswordFromProfile) {
            handleSaveNewPassword(); // Skip ResetPassword, go to Success
        } else {
            setShowResetPassword(true);
            Animated.timing(resetPasswordOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleCloseResetPassword = () => {
        Animated.timing(resetPasswordOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowResetPassword(false);
        });
    };

    const handleSaveNewPassword = () => {
        setOtpCode('');
        setShowSuccessScreen(true);
        Animated.timing(successScreenOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Cleanup background
        setShowResetPassword(false);
        setShowOTPVerification(false);
        setShowForgotPassword(false);

        // FIX: If from Profile, do deep cleanup while Success Screen is OPAQUE
        if (isChangingPasswordFromProfile) {
            // Instantly hide intermediate layers to prevent flicker during SuccessScreen fade-out
            editPasswordOpacity.setValue(0);
            securityAccountOpacity.setValue(0);
            editProfileOpacity.setValue(0);
            mealActivityOpacity.setValue(0);

            // Switch to Home Dashboard instantly
            setActiveHomeTab('Home');
            homeOpacity.setValue(1);

            // Set unmount flags immediately
            setShowEditPassword(false);
            setShowSecurityAccount(false);
            setShowEditProfile(false);
            setShowMealActivity(false);
        }
    };

    const handleCloseSuccessScreen = () => {
        if (isChangingPasswordFromProfile) {
            // FIX: Force reset ALL underlying opacities to 0 IMMEDIATELY
            editPasswordOpacity.setValue(0);
            securityAccountOpacity.setValue(0);
            editProfileOpacity.setValue(0);
            mealActivityOpacity.setValue(0);

            setActiveHomeTab('Home');
            homeOpacity.setValue(1);

            // Now ONLY animate the SuccessScreen fade-out for a perfectly clean transition
            Animated.timing(successScreenOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setShowSuccessScreen(false);
                setShowEditPassword(false);
                setShowSecurityAccount(false);
                setShowEditProfile(false);
                setShowMealActivity(false);
                setIsChangingPasswordFromProfile(false);
            });
        } else {
            handleLogin(); // Same as home transition
            Animated.timing(successScreenOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setShowSuccessScreen(false);
                setShowLogin(false);
            });
        }
    };

    const handleOpenNotifications = () => {
        setShowNotifications(true);
        notificationsOpacity.setValue(0);
        Animated.timing(notificationsOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseNotifications = () => {
        Animated.timing(notificationsOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowNotifications(false);
        });
    };

    const handleOpenSearch = () => {
        setShowSearch(true);
        // Delay slight bit to ensure mounting is done if it was hidden, but now it's persistent
        Animated.timing(searchOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseSearch = () => {
        Animated.timing(searchOpacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setShowSearch(false);
        });
    };

    const handleOpenCheckBloodSugar = () => {
        setShowCheckBloodSugar(true);
        Animated.timing(checkBloodSugarOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseCheckBloodSugar = () => {
        Animated.timing(checkBloodSugarOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowCheckBloodSugar(false);
        });
    };

    const handleOpenFoodInput = () => {
        setShowFoodInput(true);
        Animated.timing(foodInputOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseFoodInput = () => {
        Animated.timing(foodInputOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowFoodInput(false);
        });
    };

    const handleOpenAnalysis = () => {
        setShowAnalysis(true);
        analysisOpacity.setValue(0);
        Animated.timing(analysisOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseAnalysis = () => {
        Animated.timing(analysisOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowAnalysis(false);
        });
    };

    const handleOpenChat = () => {
        setShowChat(true);
        Animated.timing(chatOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseChat = () => {
        Animated.timing(chatOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowChat(false);
        });
    };

    const handleOpenChatDetail = (chat: any) => {
        setSelectedChat(chat);
        setShowChatDetail(true);
        chatDetailOpacity.setValue(0);
        Animated.timing(chatDetailOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseChatDetail = () => {
        Animated.timing(chatDetailOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowChatDetail(false);
            setSelectedChat(null);
        });
    };

    const handleOpenInsightDetail = (insight: any) => {
        setSelectedInsight(insight);
        setShowInsightDetail(true);
        insightDetailOpacity.setValue(0);
        Animated.timing(insightDetailOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseInsightDetail = () => {
        Animated.timing(insightDetailOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowInsightDetail(false);
            setSelectedInsight(null);
        });
    };

    const handleOpenFoodDetail = (food: any) => {
        setFoodDetailData(food);
        setShowFoodDetail(true);
        foodDetailOpacity.setValue(0);
        Animated.timing(foodDetailOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseFoodDetail = () => {
        Animated.timing(foodDetailOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowFoodDetail(false);
            setFoodDetailData(null);
        });
    };

    const handleJoinCommunity = () => {
        handleOpenChatDetail(COMMUNITY_CHAT_DATA);
    };

    const handleOpenCheckout = (data: any) => {
        setCheckoutData(data);
        setShowCheckout(true);
        checkoutOpacity.setValue(0);
        Animated.timing(checkoutOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseCheckout = () => {
        Animated.timing(checkoutOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowCheckout(false);
        });
    };

    const handleCheckoutFromCart = (items: any[]) => {
        // Calculate total for checkout display
        const total = items.reduce((sum, item) => sum + (item.priceValue * item.quantity), 0);

        // Bundle items into a single checkout object
        // Since CheckoutScreen expects a single 'foodData' object, we simulate one.
        // In a real app, CheckoutScreen would accept 'items' array.
        // For now, we adapt to the existing structure.
        const checkoutData = {
            title: `Pesanan (${items.length} Menu)`,
            restaurant: items[0]?.restaurant || 'Berbagai Restoran',
            price: `Rp ${total.toLocaleString('id-ID').replace(/,/g, '.')}`,
            image: items[0]?.image, // Use first image as thumbnail
            items: items // Pass full array if CheckoutScreen supported it (future proofing)
        };

        setCheckoutData(checkoutData);

        // Transition: Close Cart -> Open Checkout
        // handleCloseCart(); // FIXED: Do not close cart immediately to prevent flicker (revealing underlying screen)
        // Let App.tsx cleanup later.

        // Slight delay to allow Cart to fade before Checkout appears, or parallel
        setTimeout(() => {
            setShowCheckout(true);
            Animated.timing(checkoutOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }, 100);
    };

    const handleOpenCart = () => {
        setShowCart(true);
        Animated.timing(cartOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleAddToCart = () => {
        setCartCount(prev => prev + 1);
        handleSaveData('Berhasil masukkan keranjang');
    };

    const handleCloseCart = () => {
        Animated.timing(cartOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowCart(false);
        });
    };

    const handleOpenEditProfile = () => {
        setShowEditProfile(true);
        Animated.timing(editProfileOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseEditProfile = () => {
        Animated.timing(editProfileOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowEditProfile(false);
        });
    };

    const handleSaveEditProfile = () => {
        // Show success modal and close edit profile screen
        handleSaveData('Profil berhasil diperbarui', handleCloseEditProfile);
    };

    const handleOpenMealActivity = () => {
        setShowMealActivity(true);
        Animated.timing(mealActivityOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseMealActivity = () => {
        Animated.timing(mealActivityOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowMealActivity(false);
        });
    };

    const handleOpenReview = () => {
        setShowReview(true);
        Animated.timing(reviewOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseReview = () => {
        Animated.timing(reviewOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowReview(false);
        });
    };

    const handleSubmitReview = (rating: number, reviewText: string) => {
        handleSaveData('Review berhasil dikirim', handleCloseReview);
    };

    const handleOrderAgain = (meal: any) => {
        // 1. Close Meal Activity
        handleCloseMealActivity();

        // 2. Open Food Detail with meal data
        setFoodDetailData({
            ...meal,
            id: meal.id,
            title: meal.name,
            price: meal.price,
            image: meal.image,
            calories: meal.calories || '350 Kcal',
            prepTime: meal.time || '20 min',
            description: meal.name + ' is a healthy choice for your diabetes management layout. Rich in fiber and essential nutrients.'
        });

        setShowFoodDetail(true);
        Animated.timing(foodDetailOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleOpenOrderDetail = (orderId: string | number) => {
        // For prototype, we'll just show the screen. 
        // In real app, we'd fetch details by orderId.
        setShowOrderDetail(true);
        orderDetailOpacity.setValue(0);
        Animated.timing(orderDetailOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseOrderDetail = () => {
        Animated.timing(orderDetailOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowOrderDetail(false);
        });
    };

    const handleConfirmCancelOrder = () => {
        handleSaveData('Pesanan berhasil dibatalkan');
    };

    const handleOpenAddAddress = () => {
        setShowAddAddress(true);
        Animated.timing(addAddressOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseAddAddress = () => {
        Animated.timing(addAddressOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowAddAddress(false);
        });
    };

    const handleSaveAddress = (address: string) => {
        handleSaveData('Alamat berhasil diperbarui', handleCloseAddAddress);
    };

    const handleOpenSecurityAccount = () => {
        setShowSecurityAccount(true);
        Animated.timing(securityAccountOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseSecurityAccount = () => {
        Animated.timing(securityAccountOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowSecurityAccount(false);
        });
    };

    const handleOpenEditPassword = () => {
        setShowEditPassword(true);
        Animated.timing(editPasswordOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseEditPassword = () => {
        Animated.timing(editPasswordOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowEditPassword(false);
        });
    };

    const handleChangePassword = (passwords: { newPass: string, confirmPass: string }) => {
        // Trigger OTP flow for profile change
        setIsChangingPasswordFromProfile(true);
        handleSendOTP();
    };

    const handleOpenLogoutModal = () => {
        setShowLogoutModal(true);
        Animated.timing(logoutModalOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleCloseLogoutModal = () => {
        Animated.timing(logoutModalOpacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setShowLogoutModal(false));
    };

    const handleConfirmLogout = () => {
        // 1. Close modal
        handleCloseLogoutModal();

        // 2. Perform DEEP RESET of all UI layers before transition to prevent flickering
        // Reset navigation to Home so next login is clean
        setActiveHomeTab('Home');

        // Force all secondary layers to 0 immediately inside the block
        chatOpacity.setValue(0);
        chatDetailOpacity.setValue(0);
        insightDetailOpacity.setValue(0);
        foodDetailOpacity.setValue(0);
        cartOpacity.setValue(0);
        editProfileOpacity.setValue(0);
        mealActivityOpacity.setValue(0);
        orderDetailOpacity.setValue(0);
        addAddressOpacity.setValue(0);
        securityAccountOpacity.setValue(0);
        editPasswordOpacity.setValue(0);
        reviewOpacity.setValue(0);
        premiumOpacity.setValue(0);
        checkoutOpacity.setValue(0);
        vaOpacity.setValue(0);
        loginOpacity.setValue(0); // PRE-EMPTIVE RESET to prevent single-frame flash

        // 3. Smooth transition Home -> Login
        Animated.timing(homeOpacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start(() => {
            // 4. Unmount Home and Clean up all detail flags
            setShowHome(false);

            // Clean up all detail flags to prevent "ghost" screens on re-login
            setSelectedChat(null);
            setSelectedInsight(null);
            setFoodDetailData(null);
            setCheckoutData(null);
            setShowChat(false);
            setShowChatDetail(false);
            setShowInsightDetail(false);
            setShowFoodDetail(false);
            setShowNotifications(false);
            setShowSearch(false);
            setShowCheckBloodSugar(false);
            setShowFoodInput(false);
            setShowAnalysis(false);
            setShowCart(false);
            setShowCheckout(false);
            setShowPaymentVA(false);
            setShowEditProfile(false);
            setShowMealActivity(false);
            setShowOrderDetail(false);
            setShowAddAddress(false);
            setShowSecurityAccount(false);
            setShowEditPassword(false);
            setShowReview(false);
            setShowPremium(false);

            // 5. Show Login
            setShowLogin(true);
            Animated.timing(loginOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleOpenPremium = () => {
        setShowPremium(true);
        Animated.timing(premiumOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
        }).start();
    };

    const handleClosePremium = () => {
        Animated.timing(premiumOpacity, {
            toValue: 0,
            duration: 350,
            useNativeDriver: true,
        }).start(() => setShowPremium(false));
    };



    const handleTransitionToLoading = () => {
        // 1. Show Loading FIRST (Cover existing screen)
        setShowTransactionLoading(true);
        Animated.timing(transactionLoadingOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            // 2. Close Previous Screen BEHIND the loading screen (CLEANUP)
            setShowCheckout(false);
            checkoutOpacity.setValue(0);
            setShowPaymentVA(false);
            vaOpacity.setValue(0);

            // Also close Food Detail so we land on Home
            setShowFoodDetail(false);
            foodDetailOpacity.setValue(0);
            setFoodDetailData(null);

            // Cleanup Cart if coming from there
            setShowCart(false);
            cartOpacity.setValue(0);

            // Cleanup Premium if coming from there
            setShowPremium(false);
            premiumOpacity.setValue(0);

            // 3. Wait 2 seconds, then show Success
            setTimeout(() => {
                // 1. Prepare Success Screen BEHIND Loading
                setShowOrderSuccess(true);
                orderSuccessOpacity.setValue(1);

                // 2. Fade out Loading to REVEAL Success
                Animated.timing(transactionLoadingOpacity, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }).start(() => {
                    setShowTransactionLoading(false);
                });
            }, 2000);
        });
    };



    const handleOpenPaymentVA = (amountVal?: string, type: 'food' | 'premium' = 'food') => {
        setActivePaymentType(type);
        // Update price in detail data if amount provided from checkout
        if (amountVal) {
            setCheckoutData((prev: any) => ({
                ...prev,
                price: amountVal
            }));
        }

        setShowPaymentVA(true);
        Animated.timing(vaOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            // PROTOTYPE LOGIC: Wait 2 seconds then show loading
            setTimeout(() => {
                handleTransitionToLoading();
            }, 2000);
        });
    };



    const handleDirectTransaction = () => {
        // 1. Show Loading FIRST
        setShowTransactionLoading(true);
        Animated.timing(transactionLoadingOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            // 2. Close Checkout in background
            setShowCheckout(false);
            checkoutOpacity.setValue(0);

            // PROTOTYPE LOGIC: Wait 0.5 seconds then show success (Simulate processing)
            setTimeout(() => {
                handleTransitionToSuccess();
            }, 500);
        });
    };

    const handleTransitionToSuccess = () => {
        // 1. Determine Success Screen based on Flow
        // Show Order Success (Default)
        setShowOrderSuccess(true);
        Animated.timing(orderSuccessOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // 2. Close Loading in background
        setShowTransactionLoading(false);
        transactionLoadingOpacity.setValue(0);

        // 3. SILENTLY Clean up previous screens
        setShowCheckout(false);
        checkoutOpacity.setValue(0);
        setCheckoutData(null);
        // Do not clear foodDetailData blindly here, as FoodDetail might still be open underneath? 
        // Actually, current flow assumes we leave everything behind. 
        // But let's clear foodDetail ONLY if we are sure we are done with it.
        // For now, consistent cleanup:
        setFoodDetailData(null);
        setShowFoodDetail(false);
        foodDetailOpacity.setValue(0);
        // Important: Close VA screen too
        setShowPaymentVA(false);
        vaOpacity.setValue(0);
        // Clean up Premium screens if open
        setShowPremium(false);
        premiumOpacity.setValue(0);
    };

    const handleCloseOrderSuccess = () => {
        Animated.timing(orderSuccessOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowOrderSuccess(false);
            // All other screens were already cleaned up in handleTransitionToSuccess
            // So we are now cleanly back at Home
        });
    };

    const handleClosePaymentVA = () => {
        Animated.timing(vaOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowPaymentVA(false);
        });
    };
    const handleSaveData = (message: string = 'Data Berhasil Tersimpan', onComplete?: () => void) => {
        // Show Success Popup
        setSuccessMessage(message);
        setShowDataSavedSuccess(true);
        Animated.timing(dataSavedSuccessOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            // Wait for feedback (slightly longer for premium feel)
            const cleanupTimer = setTimeout(() => {
                // Execute callback immediately when fade out starts
                if (onComplete) {
                    onComplete();
                }

                // Fade out popup
                Animated.timing(dataSavedSuccessOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    setShowDataSavedSuccess(false);
                });
            }, 600);
            return () => clearTimeout(cleanupTimer);
        });
    };

    // Specific handler for Blood Sugar and Food Input screens (legacy behavior)
    const handleSaveDataWithScreenClose = (message: string = 'Data Berhasil Tersimpan') => {
        setSuccessMessage(message);
        setShowDataSavedSuccess(true);
        Animated.timing(dataSavedSuccessOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            const cleanupTimer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(dataSavedSuccessOpacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(checkBloodSugarOpacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(foodInputOpacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    })
                ]).start(() => {
                    setShowDataSavedSuccess(false);
                    setShowCheckBloodSugar(false);
                    setShowFoodInput(false);
                });
            }, 600);
            return () => clearTimeout(cleanupTimer);
        });
    };

    const handleOtpChange = (text: string) => {
        const cleanText = text.replace(/[^0-9]/g, '').slice(0, 6);
        setOtpCode(cleanText);

        if (cleanText.length === 6 && otpSelection.start >= 5) {
            Keyboard.dismiss();
            handleCloseOTP();
        }
    };

    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#4285F4' }}>
                <Animated.View style={[styles.container, { opacity: appOpacity }]}>
                    <StatusBar style="light" translucent backgroundColor="transparent" />

                    {/* 1. Onboarding Screen */}
                    {!showLogin && !showHome && (
                        <OnboardingScreen
                            data={onboardingData}
                            currentStep={currentStep}
                            fadeAnim={fadeAnim}
                            onboardingScroll={onboardingScroll}
                            dotScroll={dotScroll}
                            onNext={handleNext}
                        />
                    )}




                    {/* 2. Authentication Overlay */}
                    <AuthScreen
                        showLogin={showLogin}
                        loginOpacity={loginOpacity}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        rememberMe={rememberMe}
                        setRememberMe={setRememberMe}
                        handleLogin={handleLogin}
                        // Forgot / OTP / Reset
                        showForgotPassword={showForgotPassword}
                        forgotPasswordOpacity={forgotPasswordOpacity}
                        handleForgotPassword={handleForgotPassword}
                        handleSendOTP={handleSendOTP}
                        showOTPVerification={showOTPVerification}
                        otpVerificationOpacity={otpVerificationOpacity}
                        handleCloseOTP={handleCloseOTP}
                        otpCode={otpCode}
                        otpSelection={otpSelection}
                        setOtpSelection={setOtpSelection}
                        inputRefs={inputRefs as any}
                        handleOtpChange={handleOtpChange}
                        showResetPassword={showResetPassword}
                        resetPasswordOpacity={resetPasswordOpacity}
                        handleCloseResetPassword={handleCloseResetPassword}
                        handleSaveNewPassword={handleSaveNewPassword}
                        showSuccessScreen={showSuccessScreen}
                        successScreenOpacity={successScreenOpacity}
                        handleCloseSuccessScreen={handleCloseSuccessScreen}
                        isProfileFlow={isChangingPasswordFromProfile}
                    />

                    {/* 3. Home Screen Overlay */}
                    <HomeScreen
                        showHome={showHome}
                        homeOpacity={homeOpacity}
                        activeTab={activeHomeTab}
                        setActiveTab={setActiveHomeTab}
                        onOpenNotifications={handleOpenNotifications}
                        onOpenSearch={handleOpenSearch}
                        onOpenCheckBloodSugar={handleOpenCheckBloodSugar}
                        onOpenFoodInput={handleOpenFoodInput}
                        onOpenAnalysis={handleOpenAnalysis}
                        onOpenChat={handleOpenChat}
                        onOpenInsightDetail={handleOpenInsightDetail}
                        onOpenFoodDetail={handleOpenFoodDetail}
                        onJoinCommunity={handleJoinCommunity}
                        // Cart Props
                        cartCount={cartCount}
                        onOpenCart={handleOpenCart}
                        onOpenEditProfile={handleOpenEditProfile}
                        onOpenMealActivity={handleOpenMealActivity}
                        onOpenAddAddress={handleOpenAddAddress}
                        onOpenSecurityAccount={handleOpenSecurityAccount}
                        onLogout={handleOpenLogoutModal}
                        onOpenPremium={handleOpenPremium}
                    />

                    {/* 4. Notification Screen Overlay */}
                    <NotificationScreen
                        showNotifications={showNotifications}
                        notificationsOpacity={notificationsOpacity}
                        onClose={handleCloseNotifications}
                    />

                    {/* 5. Search Screen Overlay */}
                    <SearchScreen
                        showSearch={showSearch}
                        searchOpacity={searchOpacity}
                        onClose={handleCloseSearch}
                    />

                    {/* 6. Blood Sugar Input Screen Overlay */}
                    <BloodSugarInputScreen
                        showCheckBloodSugar={showCheckBloodSugar}
                        checkBloodSugarOpacity={checkBloodSugarOpacity}
                        onClose={handleCloseCheckBloodSugar}
                        onSave={() => handleSaveDataWithScreenClose()}
                    />

                    {/* 6. Food Input Screen Overlay */}
                    <FoodInputScreen
                        showFoodInput={showFoodInput}
                        foodInputOpacity={foodInputOpacity}
                        onClose={handleCloseFoodInput}
                        onSave={() => handleSaveDataWithScreenClose()}
                    />

                    {/* 7. Daily Analysis Screen Overlay */}
                    <DailyAnalysisScreen
                        showAnalysis={showAnalysis}
                        analysisOpacity={analysisOpacity}
                        onClose={handleCloseAnalysis}
                    />

                    {/* 8. Chat Screen Overlay */}
                    <ChatScreen
                        showChat={showChat}
                        chatOpacity={chatOpacity}
                        onBack={handleCloseChat}
                        onOpenChatDetail={handleOpenChatDetail}
                    />

                    {/* 8b. Chat Detail Screen Overlay */}
                    <ChatDetailScreen
                        showDetail={showChatDetail}
                        detailOpacity={chatDetailOpacity}
                        onBack={handleCloseChatDetail}
                        chatData={selectedChat}
                    />

                    {/* 8c. Insight Detail Screen Overlay */}
                    <InsightDetailScreen
                        showDetail={showInsightDetail}
                        detailOpacity={insightDetailOpacity}
                        onBack={handleCloseInsightDetail}
                        insightData={selectedInsight}
                    />

                    {/* 9. Success Global Modal */}
                    <SuccessModal
                        isVisible={showDataSavedSuccess}
                        opacity={dataSavedSuccessOpacity}
                        message={successMessage}
                    />
                    <FoodDetailScreen
                        detailOpacity={foodDetailOpacity}
                        isVisible={showFoodDetail}
                        onClose={handleCloseFoodDetail}
                        foodData={foodDetailData}
                        onOpenCheckout={handleOpenCheckout}
                        // Cart Props
                        cartCount={cartCount}
                        onOpenCart={handleOpenCart}
                        onAddToCart={handleAddToCart}
                    />

                    <CheckoutScreen
                        isVisible={showCheckout}
                        checkoutOpacity={checkoutOpacity}
                        onClose={handleCloseCheckout}
                        foodData={checkoutData}
                        onOpenPaymentVA={handleOpenPaymentVA}
                        onPayCash={handleDirectTransaction}
                    />

                    <PaymentVAScreen
                        isVisible={showPaymentVA}
                        vaOpacity={vaOpacity}
                        onClose={handleClosePaymentVA}
                        amount={checkoutData?.price || 'Rp 38.000'}
                    />

                    <TransactionLoadingScreen
                        isVisible={showTransactionLoading}
                        opacity={transactionLoadingOpacity}
                    />

                    <OrderSuccessScreen
                        isVisible={showOrderSuccess}
                        opacity={orderSuccessOpacity}
                        onClose={handleCloseOrderSuccess}
                        type={activePaymentType}
                        amount={activePaymentType === 'premium' ? 'Rp 55.000' : (checkoutData?.price || 'Rp 38.000')}
                    />

                    <CartScreen
                        isVisible={showCart}
                        cartOpacity={cartOpacity}
                        onClose={handleCloseCart}
                        onCheckout={handleCheckoutFromCart}
                    />

                    <EditProfileScreen
                        isVisible={showEditProfile}
                        opacity={editProfileOpacity}
                        onClose={handleCloseEditProfile}
                        onSave={handleSaveEditProfile}
                    />

                    <MealActivityScreen
                        isVisible={showMealActivity}
                        opacity={mealActivityOpacity}
                        onClose={handleCloseMealActivity}
                        onOpenReview={handleOpenReview}
                        onOrderAgain={handleOrderAgain}
                        onViewOrderDetails={handleOpenOrderDetail}
                        onConfirmCancel={handleConfirmCancelOrder}
                    />

                    <OrderDetailScreen
                        isVisible={showOrderDetail}
                        opacity={orderDetailOpacity}
                        onClose={handleCloseOrderDetail}
                    />

                    <AddAddressScreen
                        isVisible={showAddAddress}
                        opacity={addAddressOpacity}
                        onClose={handleCloseAddAddress}
                        onSave={handleSaveAddress}
                    />

                    <AccountSecurityScreen
                        isVisible={showSecurityAccount}
                        opacity={securityAccountOpacity}
                        onClose={handleCloseSecurityAccount}
                        onEditPassword={handleOpenEditPassword}
                    />

                    <EditPasswordScreen
                        isVisible={showEditPassword}
                        opacity={editPasswordOpacity}
                        onClose={handleCloseEditPassword}
                        onSave={handleChangePassword}
                    />

                    <ReviewScreen
                        isVisible={showReview}
                        opacity={reviewOpacity}
                        onClose={handleCloseReview}
                        onSubmit={handleSubmitReview}
                    />

                    <PremiumScreen
                        isVisible={showPremium}
                        opacity={premiumOpacity}
                        onClose={handleClosePremium}
                        onOpenPaymentVA={handleOpenPaymentVA}
                    />
                </Animated.View>

                <LogoutModal
                    isVisible={showLogoutModal}
                    opacity={logoutModalOpacity}
                    onClose={handleCloseLogoutModal}
                    onConfirm={handleConfirmLogout}
                />

                {/* Custom Pseudo Splash Overlay (Premium Design with Animations) */}
                <Animated.View
                    pointerEvents="none"
                    style={[
                        StyleSheet.absoluteFillObject,
                        {
                            backgroundColor: '#4285F4',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 9999,
                            opacity: splashOpacity,
                            overflow: 'hidden',
                        }
                    ]}
                >
                    <Animated.View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', opacity: splashContentOpacity }}>
                        {/* Decorative Background Circles (Slide-in) - Ring Profile for Exact Match */}

                        {/* Top Right Group - Single Ring Match */}
                        <Animated.View
                            style={{
                                position: 'absolute',
                                top: -200,
                                right: -200,
                                transform: [{ translateX: splashTopRightXY.x }, { translateY: splashTopRightXY.y }],
                            }}
                        >
                            {/* Single Outer Ring */}
                            <View
                                style={{
                                    width: 400,
                                    height: 400,
                                    borderRadius: 200,
                                    borderWidth: 45,
                                    borderColor: 'rgba(255,255,255,0.06)',
                                }}
                            />
                        </Animated.View>

                        {/* Bottom Left Group - Single Ring Match */}
                        <Animated.View
                            style={{
                                position: 'absolute',
                                bottom: -175,
                                left: -175,
                                transform: [{ translateX: splashBottomLeftXY.x }, { translateY: splashBottomLeftXY.y }],
                            }}
                        >
                            {/* Single Outer Ring */}
                            <View
                                style={{
                                    width: 350,
                                    height: 350,
                                    borderRadius: 175,
                                    borderWidth: 40,
                                    borderColor: 'rgba(255,255,255,0.06)',
                                }}
                            />
                        </Animated.View>

                        {/* Center Decorative Circle (Zoom-in) - Simplified but exact */}
                        <Animated.View
                            style={{
                                position: 'absolute',
                                width: 240,
                                height: 240,
                                borderRadius: 120,
                                backgroundColor: 'rgba(255,255,255,0.02)',
                                transform: [{ scale: splashLogoScale }]
                            }}
                        />

                        {/* Logo Animation (Zoom-in) */}
                        <Animated.View style={{ transform: [{ scale: splashLogoScale }] }}>
                            <Image
                                source={require('./assets/images/logosplash.png')}
                                style={{ width: 220, height: 220 }}
                                contentFit="contain"
                            />
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
            </View>
        </SafeAreaProvider >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
