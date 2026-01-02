import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BorderRadius, FontSizes, FontWeights, Spacing, VIRTUAL_LAB_SCENES } from '@/constants';
import { useVirtualLabStore } from '@/store';
import { LabEquipmentImages, BackgroundImages } from '@/assets/images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function VirtualLabScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ sceneIndex?: string }>();
  
  const { 
    currentScene, 
    globalState, 
    setCurrentScene, 
    updateState,
    nextScene, 
    prevScene,
    resetLab 
  } = useVirtualLabStore();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const scene = VIRTUAL_LAB_SCENES[currentScene];
  const progress = ((currentScene + 1) / VIRTUAL_LAB_SCENES.length) * 100;

  useEffect(() => {
    // If scene index passed in params, jump to that scene
    if (params.sceneIndex) {
      const index = parseInt(params.sceneIndex, 10);
      if (index >= 0 && index < VIRTUAL_LAB_SCENES.length) {
        setCurrentScene(index);
      }
    }
  }, [params.sceneIndex]);

  const animateTransition = (direction: 'next' | 'prev', callback: () => void) => {
    const toValue = direction === 'next' ? -SCREEN_WIDTH : SCREEN_WIDTH;
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: toValue / 4,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(-toValue / 4);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentScene < VIRTUAL_LAB_SCENES.length - 1) {
      animateTransition('next', nextScene);
    } else {
      // Lab completed
      router.replace('/(tabs)/lab');
    }
  };

  const handlePrev = () => {
    if (currentScene > 0) {
      animateTransition('prev', prevScene);
    }
  };

  const handleExit = () => {
    resetLab();
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.card }]}
          onPress={handleExit}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.sceneCounter, { color: colors.textMuted }]}>
            {currentScene + 1} / {VIRTUAL_LAB_SCENES.length}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.card }]}
          onPress={() => resetLab()}
        >
          <Ionicons name="refresh" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressContainer, { backgroundColor: colors.border }]}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { 
              backgroundColor: colors.primary,
              width: `${progress}%`,
            }
          ]} 
        />
      </View>

      {/* Scene Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={[
            styles.sceneContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            }
          ]}
        >
          {/* Scene Image */}
          <View style={[styles.imageContainer, { backgroundColor: colors.card }]}>
            {renderSceneImage(currentScene, colors)}
          </View>

          {/* Scene Info */}
          <View style={styles.sceneInfo}>
            <View style={[styles.stepBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.stepBadgeText, { color: colors.primary }]}>
                Step {currentScene + 1}
              </Text>
            </View>

            <Text style={[styles.sceneTitle, { color: colors.text }]}>
              {scene.title || scene.name}
            </Text>

            <Text style={[styles.sceneDescription, { color: colors.textMuted }]}>
              {scene.description}
            </Text>

            {/* Interactive Elements based on scene */}
            {renderInteractiveContent(scene, colors, globalState, updateState)}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Navigation Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity
          style={[
            styles.navButton,
            { backgroundColor: colors.card, borderColor: colors.border },
            currentScene === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePrev}
          disabled={currentScene === 0}
        >
          <Ionicons 
            name="arrow-back" 
            size={20} 
            color={currentScene === 0 ? colors.textMuted : colors.text} 
          />
          <Text style={[
            styles.navButtonText,
            { color: currentScene === 0 ? colors.textMuted : colors.text }
          ]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.navButtonPrimary, { backgroundColor: colors.primary }]}
          onPress={handleNext}
        >
          <Text style={styles.navButtonTextPrimary}>
            {currentScene === VIRTUAL_LAB_SCENES.length - 1 ? 'Complete' : 'Next'}
          </Text>
          <Ionicons 
            name={currentScene === VIRTUAL_LAB_SCENES.length - 1 ? 'checkmark' : 'arrow-forward'} 
            size={20} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Render scene image based on scene index
function renderSceneImage(sceneIndex: number, colors: typeof Colors.light): React.ReactNode {
  // Map scene index to appropriate images
  const sceneImages: Record<number, any[]> = {
    0: [LabEquipmentImages.meniranleaves, BackgroundImages.meniran], // Collect Leaves / Contaminated Farm
    1: [LabEquipmentImages.grinder, LabEquipmentImages.beaker], // Grind Leaves
    2: [LabEquipmentImages.solvent, LabEquipmentImages.beaker], // Mix Solvent
    3: [LabEquipmentImages.hotplate, LabEquipmentImages.beaker], // Hot Maceration
    4: [LabEquipmentImages.filterpaper, LabEquipmentImages.beaker], // Filter Extract
    5: [BackgroundImages.zinc, LabEquipmentImages.beaker], // Make Zinc NP
    6: [LabEquipmentImages.finalproduct], // Final Mix
  };

  const images = sceneImages[sceneIndex] || [LabEquipmentImages.beaker];

  return (
    <View style={sceneImageStyles.container}>
      <LinearGradient
        colors={[colors.primaryLight + '40', colors.card]}
        style={sceneImageStyles.gradient}
      >
        <View style={sceneImageStyles.imageRow}>
          {images.map((img, idx) => (
            <Image
              key={idx}
              source={img}
              style={[
                sceneImageStyles.image,
                images.length === 1 && sceneImageStyles.singleImage,
              ]}
              resizeMode="contain"
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const sceneImageStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: 250,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  image: {
    width: 120,
    height: 150,
  },
  singleImage: {
    width: 180,
    height: 200,
  },
});

// Render interactive content based on scene type
function renderInteractiveContent(
  scene: typeof VIRTUAL_LAB_SCENES[0],
  colors: typeof Colors.light,
  globalState: Record<string, any>,
  updateState: (key: string, value: any) => void
): React.ReactNode {
  const interactiveElements: Record<string, React.ReactNode> = {
    // Scene 1: Contaminated Farm
    'Contaminated Farm': (
      <View style={styles.interactiveSection}>
        <Text style={[styles.interactiveTitle, { color: colors.text }]}>
          Soil Analysis Results
        </Text>
        <View style={[styles.dataCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.dataRow}>
            <Text style={[styles.dataLabel, { color: colors.textMuted }]}>Cadmium Level:</Text>
            <Text style={[styles.dataValue, { color: colors.error }]}>2.4 mg/kg (High)</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={[styles.dataLabel, { color: colors.textMuted }]}>Lead Level:</Text>
            <Text style={[styles.dataValue, { color: colors.warning }]}>1.8 mg/kg (Moderate)</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={[styles.dataLabel, { color: colors.textMuted }]}>pH Level:</Text>
            <Text style={[styles.dataValue, { color: colors.text }]}>5.2 (Acidic)</Text>
          </View>
        </View>
      </View>
    ),

    // Scene 2: Zinc Application
    'Zinc Application': (
      <View style={styles.interactiveSection}>
        <Text style={[styles.interactiveTitle, { color: colors.text }]}>
          Application Method
        </Text>
        <View style={styles.optionsContainer}>
          {['Foliar Spray', 'Soil Amendment', 'Seed Coating'].map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.optionButton,
                { borderColor: colors.border },
                globalState.applicationMethod === method && { 
                  backgroundColor: colors.primaryLight, 
                  borderColor: colors.primary 
                },
              ]}
              onPress={() => updateState('applicationMethod', method)}
            >
              <Ionicons 
                name={globalState.applicationMethod === method ? 'checkmark-circle' : 'ellipse-outline'} 
                size={20} 
                color={globalState.applicationMethod === method ? colors.primary : colors.textMuted} 
              />
              <Text style={[
                styles.optionText,
                { color: globalState.applicationMethod === method ? colors.primary : colors.text }
              ]}>
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    ),

    // Scene 3: Cellular Absorption
    'Cellular Absorption': (
      <View style={styles.interactiveSection}>
        <Text style={[styles.interactiveTitle, { color: colors.text }]}>
          Absorption Timeline
        </Text>
        <View style={[styles.timelineContainer, { backgroundColor: colors.card }]}>
          {[
            { time: '0h', desc: 'Zinc applied to soil' },
            { time: '6h', desc: 'Root uptake begins' },
            { time: '24h', desc: 'Transport to leaves' },
            { time: '48h', desc: 'Cellular distribution complete' },
          ].map((item, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTime, { color: colors.primary }]}>{item.time}</Text>
                <Text style={[styles.timelineDesc, { color: colors.text }]}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    ),

    // Scene 4: Metal Competition
    'Metal Competition': (
      <View style={styles.interactiveSection}>
        <Text style={[styles.interactiveTitle, { color: colors.text }]}>
          Competitive Binding
        </Text>
        <View style={[styles.comparisonCard, { backgroundColor: colors.card }]}>
          <View style={styles.comparisonRow}>
            <View style={[styles.comparisonItem, { flex: 1 }]}>
              <Text style={[styles.comparisonLabel, { color: colors.textMuted }]}>Cadmium</Text>
              <View style={[styles.barContainer, { backgroundColor: colors.border }]}>
                <View style={[styles.bar, { width: '30%', backgroundColor: colors.error }]} />
              </View>
              <Text style={[styles.comparisonValue, { color: colors.error }]}>-70%</Text>
            </View>
          </View>
          <View style={styles.comparisonRow}>
            <View style={[styles.comparisonItem, { flex: 1 }]}>
              <Text style={[styles.comparisonLabel, { color: colors.textMuted }]}>Zinc</Text>
              <View style={[styles.barContainer, { backgroundColor: colors.border }]}>
                <View style={[styles.bar, { width: '85%', backgroundColor: colors.primary }]} />
              </View>
              <Text style={[styles.comparisonValue, { color: colors.primary }]}>+85%</Text>
            </View>
          </View>
        </View>
      </View>
    ),

    // Scene 5: Healthy Growth
    'Healthy Growth': (
      <View style={styles.interactiveSection}>
        <Text style={[styles.interactiveTitle, { color: colors.text }]}>
          Growth Metrics
        </Text>
        <View style={styles.metricsGrid}>
          {[
            { label: 'Height Increase', value: '+42%', icon: 'trending-up' },
            { label: 'Leaf Area', value: '+38%', icon: 'leaf' },
            { label: 'Root Mass', value: '+56%', icon: 'git-branch' },
            { label: 'Yield', value: '+35%', icon: 'nutrition' },
          ].map((metric, index) => (
            <View 
              key={index} 
              style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Ionicons name={metric.icon as any} size={24} color={colors.primary} />
              <Text style={[styles.metricValue, { color: colors.primary }]}>{metric.value}</Text>
              <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{metric.label}</Text>
            </View>
          ))}
        </View>
      </View>
    ),

    // Scene 6: Harvest Results
    'Harvest Results': (
      <View style={styles.interactiveSection}>
        <Text style={[styles.interactiveTitle, { color: colors.text }]}>
          Safety Analysis
        </Text>
        <View style={[styles.safetyCard, { backgroundColor: colors.success + '20', borderColor: colors.success }]}>
          <Ionicons name="shield-checkmark" size={32} color={colors.success} />
          <Text style={[styles.safetyTitle, { color: colors.success }]}>
            Safe for Consumption
          </Text>
          <Text style={[styles.safetyDesc, { color: colors.text }]}>
            Heavy metal levels are below FDA safety thresholds
          </Text>
        </View>
      </View>
    ),

    // Scene 7: Research Impact
    'Research Impact': (
      <View style={styles.interactiveSection}>
        <Text style={[styles.interactiveTitle, { color: colors.text }]}>
          Global Impact
        </Text>
        <View style={styles.impactGrid}>
          {[
            { value: '1M+', label: 'Hectares Treated' },
            { value: '50+', label: 'Countries Reached' },
            { value: '30%', label: 'Yield Improvement' },
            { value: '75%', label: 'Contamination Reduced' },
          ].map((item, index) => (
            <View key={index} style={styles.impactItem}>
              <Text style={[styles.impactValue, { color: colors.primary }]}>{item.value}</Text>
              <Text style={[styles.impactLabel, { color: colors.textMuted }]}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
    ),
  };

  return interactiveElements[scene.title || scene.name] || null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  sceneCounter: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },

  // Progress
  progressContainer: {
    height: 4,
    marginHorizontal: Spacing.lg,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },

  // Content
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  sceneContainer: {
    flex: 1,
  },

  // Image
  imageContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  imagePlaceholder: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scene Info
  sceneInfo: {
    flex: 1,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  stepBadgeText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  sceneTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.sm,
  },
  sceneDescription: {
    fontSize: FontSizes.md,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },

  // Interactive Section
  interactiveSection: {
    marginTop: Spacing.md,
  },
  interactiveTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },

  // Data Card
  dataCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  dataLabel: {
    fontSize: FontSizes.md,
  },
  dataValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },

  // Options
  optionsContainer: {
    gap: Spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  optionText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },

  // Timeline
  timelineContainer: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  timelineContent: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  timelineTime: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  timelineDesc: {
    fontSize: FontSizes.md,
    marginTop: 2,
  },

  // Comparison
  comparisonCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  comparisonRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  comparisonItem: {
    gap: Spacing.xs,
  },
  comparisonLabel: {
    fontSize: FontSizes.sm,
  },
  barContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  comparisonValue: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },

  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  metricCard: {
    width: '48%',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  metricValue: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    marginTop: Spacing.xs,
  },
  metricLabel: {
    fontSize: FontSizes.xs,
    textAlign: 'center',
    marginTop: 2,
  },

  // Safety Card
  safetyCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
  },
  safetyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginTop: Spacing.sm,
  },
  safetyDesc: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },

  // Impact Grid
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  impactItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  impactValue: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  impactLabel: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonPrimary: {
    borderWidth: 0,
  },
  navButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
  navButtonTextPrimary: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: '#fff',
  },
});
