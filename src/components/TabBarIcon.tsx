import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface TabBarIconProps {
  route: string;
  focused: boolean;
  color: string;
  size: number;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ route, focused, color, size }) => {
  let iconName: keyof typeof Ionicons.glyphMap;

  switch (route) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Shop':
      iconName = focused ? 'shirt' : 'shirt-outline';
      break;
    case 'Wishlist':
      iconName = focused ? 'heart' : 'heart-outline';
      break;
    case 'Profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    case 'Cart':
      iconName = focused ? 'cart' : 'cart-outline';
      break;
    default:
      iconName = 'help-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

export default TabBarIcon;
