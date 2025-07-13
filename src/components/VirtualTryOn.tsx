import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface VirtualTryOnProps {
  productType: 'watch' | 'accessory';
  productImage: string;
  onClose: () => void;
  onCapture: (imageUri: string) => void;
}

export default function VirtualTryOn({ productType, productImage, onClose, onCapture }: VirtualTryOnProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.front);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<Camera>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setCapturedImage(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  const savePicture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const flipCamera = () => {
    setType(
      type === CameraType.back
        ? CameraType.front
        : CameraType.back
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <>
          <Camera style={styles.camera} type={type} ref={cameraRef}>
            <View style={styles.cameraOverlay}>
              {/* Product overlay */}
              <View style={styles.productOverlay}>
                <Image source={{ uri: productImage }} style={styles.productImage} />
                <Text style={styles.overlayText}>
                  Position your {productType} here
                </Text>
              </View>

              {/* Camera controls */}
              <View style={styles.cameraControls}>
                <TouchableOpacity style={styles.controlButton} onPress={onClose}>
                  <Ionicons name="close" size={24} color={COLORS.background} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.controlButton} onPress={flipCamera}>
                  <Ionicons name="camera-reverse" size={24} color={COLORS.background} />
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
        </>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          <View style={styles.previewControls}>
            <TouchableOpacity style={styles.previewButton} onPress={retakePicture}>
              <Ionicons name="refresh" size={20} color={COLORS.text} />
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.previewButton} onPress={savePicture}>
              <Ionicons name="checkmark" size={20} color={COLORS.background} />
              <Text style={[styles.previewButtonText, { color: COLORS.background }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productOverlay: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.1,
    right: width * 0.1,
    alignItems: 'center',
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.lg,
    opacity: 0.7,
  },
  overlayText: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.background,
    textAlign: 'center',
    marginTop: SPACING.sm,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  previewControls: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: SPACING.xl,
    right: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.base,
  },
  previewButtonText: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  loadingText: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SPACING['4xl'],
  },
  errorText: {
    fontSize: FONTS.sizes.lg,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING['4xl'],
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignSelf: 'center',
    marginTop: SPACING.xl,
  },
  buttonText: {
    fontSize: FONTS.sizes.base,
    fontFamily: FONTS.families.sans,
    fontWeight: FONTS.weights.medium,
    color: COLORS.background,
  },
});
