export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Shop: undefined;
  Wishlist: undefined;
  Profile: undefined;
  Cart: undefined;
};

export type ShopStackParamList = {
  ShopMain: undefined;
  ProductDetails: { productId: string };
  Category: { category: string };
  Search: undefined;
  Filter: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  AddressBook: undefined;
  OrderHistory: undefined;
  Settings: undefined;
};
