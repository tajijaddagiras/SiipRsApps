import 'react';
import 'react-native';

declare module 'react-native' {
    namespace Animated {
        interface AnimatedViewProps extends ViewProps {
            children?: React.ReactNode;
            style?: any;
        }
        class View extends React.Component<AnimatedViewProps> { }
    }
}

declare module '@expo/vector-icons';
