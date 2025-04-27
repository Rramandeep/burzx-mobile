import React from 'react';
import {
  Text,
  TextStyle,
  StyleProp,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {Colors} from '../constants/colors';

interface ReusableTextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>; // Make style optional
  numberOfLines?: number;
  onPress?: () => void;
}

const ReusableText: React.FC<ReusableTextProps> = ({
  children,
  style,
  numberOfLines,
  onPress,
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const baseStyle: TextStyle = {
    fontFamily: 'System', // Default font (cross-platform)
    fontSize: 16,
    color: isDarkMode ? Colors.white : 'black', // Default text color
  };

  // Combine the base style with any styles passed in.  Styles in the 'style'
  // prop will override any conflicting styles in 'baseStyle'.
  const combinedStyle = [baseStyle, style];

  // Use the 'onPress' prop to determine whether to render a TouchableOpacity
  const TextComponent = onPress ? TouchableOpacity : Text;

  return (
    <TextComponent
      style={[combinedStyle]}
      numberOfLines={numberOfLines}
      onPress={onPress} // Only pass onPress if it's provided
    >
      {children}
    </TextComponent>
  );
};

export default ReusableText;
