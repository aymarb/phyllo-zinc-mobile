import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  BorderRadius,
  FontSizes,
  FontWeights,
  Spacing,
  Shadows,
  METHODOLOGY_STEPS,
  BENEFITS,
} from '@/constants';
import { useArticlesStore, useAuthStore } from '@/store';
import { ArticleCard } from '@/components/article-card';
import { TeamCarousel } from '@/components/team-carousel';
import { PhyllozincLogo, BackgroundImages } from '@/assets/images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { articles, fetchArticles, isLoading } = useArticlesStore();
  const { session } = useAuthStore();

  useEffect(() => {
    fetchArticles();
  }, []);

  const featuredArticles = articles.slice(0, 3);

  const onRefresh = () => {
    fetchArticles();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Hero Section */}
        <ImageBackground
          source={BackgroundImages.grassland}
          style={[styles.heroSection, { paddingTop: insets.top }]}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.6)']}
            style={styles.heroOverlay}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
                  <Image source={PhyllozincLogo} style={styles.logoImage} resizeMode="cover" />
                </View>
                <Text style={styles.logoText}>PhylloZinc</Text>
              </View>
              <TouchableOpacity
                style={styles.authButton}
                onPress={() => router.push(session ? '/(tabs)/profile' : '/auth')}
              >
                <Text style={styles.authButtonText}>
                  {session ? 'Profile' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Hero Content */}
            <View style={styles.heroContent}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Research Publication</Text>
              </View>
              <Text style={styles.heroTitle}>
                Empowering Sustainability Through Phyllanthus niruri–Driven ZnO Nanoparticles
              </Text>
              <Text style={styles.heroSubtitle}>
                Using <Text style={styles.highlight}>Phyllanthus niruri</Text> leaf extract to create an innovative solution for mitigating methane emissions through sustainable ruminant feed additives.
              </Text>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => router.push('/virtual-lab')}
              >
                <Text style={styles.ctaButtonText}>Explore Virtual Lab</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Background Section - The Crisis */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              The Crisis We're Addressing
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.primary }]} />
            <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
              Understanding the environmental urgency behind PhylloZinc's innovation
            </Text>
          </View>

          {/* Methane Impact Card */}
          <View style={[styles.crisisCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.crisisStats}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>28×</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                more potent than CO₂
              </Text>
            </View>
            <Text style={[styles.crisisTitle, { color: colors.text }]}>
              Methane's Climate Impact
            </Text>
            <Text style={[styles.crisisDescription, { color: colors.textMuted }]}>
              Methane (CH₄) has a global warming potential 28 times higher than carbon dioxide. Though atmospheric concentration is lower than CO₂, methane's potency makes it a critical driver of climate change.
            </Text>
          </View>

          {/* Livestock Emissions Card */}
          <View style={[styles.crisisCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.crisisStats}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>84.2M</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                MMTCO₂e per year
              </Text>
            </View>
            <Text style={[styles.crisisTitle, { color: colors.text }]}>
              Livestock: The Hidden Emitter
            </Text>
            <Text style={[styles.crisisDescription, { color: colors.textMuted }]}>
              Producing more emissions than the entire oil and gas industry combined. 95% of livestock methane comes from cattle through enteric fermentation.
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.primaryLight }]}>
                <View style={[styles.progressFill, { width: '52%', backgroundColor: colors.primary }]} />
              </View>
              <Text style={[styles.progressLabel, { color: colors.textMuted }]}>
                vs 76.57M from Oil & Gas
              </Text>
            </View>
          </View>
        </View>

        {/* Research Overview Section */}
        <View style={[styles.section, { backgroundColor: colors.primaryLight + '30' }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Research Overview
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.primary }]} />
          </View>

          <View style={styles.overviewCards}>
            {[
              { icon: 'flask', title: 'Synthesis Method', desc: 'Eco-friendly synthesis using plant leaf extract as a reducing and capping agent.' },
              { icon: 'leaf', title: 'Natural Source', desc: 'Phyllanthus niruri, rich in bioactive compounds, serves as the primary biological agent.' },
              { icon: 'trending-up', title: 'Sustainability', desc: 'Reduces reliance on synthetic chemicals while maintaining efficacy.' },
            ].map((item, index) => (
              <View
                key={index}
                style={[styles.overviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.overviewIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.overviewTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.overviewDesc, { color: colors.textMuted }]}>
                  {item.desc}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Methodology Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Methodology
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.primary }]} />
          </View>

          {METHODOLOGY_STEPS.map((step, index) => (
            <View key={index} style={styles.methodStep}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.stepNumberText}>{step.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: colors.text }]}>
                  {step.title}
                </Text>
                <Text style={[styles.stepDesc, { color: colors.textMuted }]}>
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Benefits Section */}
        <View style={[styles.section, { backgroundColor: colors.primaryLight + '30' }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Key Benefits
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.primary }]} />
          </View>

          <View style={styles.benefitsGrid}>
            {BENEFITS.map((benefit, index) => (
              <View
                key={index}
                style={[styles.benefitCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Text style={[styles.benefitTitle, { color: colors.primary }]}>
                  {benefit.title}
                </Text>
                {benefit.points.map((point, pIndex) => (
                  <View key={pIndex} style={styles.benefitPoint}>
                    <Text style={[styles.bulletPoint, { color: colors.primary }]}>•</Text>
                    <Text style={[styles.benefitPointText, { color: colors.textMuted }]}>
                      {point}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* Team Section */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Research Team
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.primary }]} />
            <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
              Meet the dedicated scientists and researchers behind this innovative project
            </Text>
          </View>
          <TeamCarousel />
        </View>

        {/* Featured Articles Section */}
        <View style={[styles.section, { backgroundColor: colors.primaryLight + '30' }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Featured Articles
            </Text>
            <View style={[styles.divider, { backgroundColor: colors.primary }]} />
            <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
              Explore our latest research publications and insights
            </Text>
          </View>

          {featuredArticles.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyStateText, { color: colors.textMuted }]}>
                No articles found
              </Text>
            </View>
          ) : (
            <View>
              {featuredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="featured"
                  onPress={() => router.push(`/article/${article.id}` as any)}
                />
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.viewAllButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)/articles')}
          >
            <Text style={styles.viewAllButtonText}>View All Articles</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={styles.footerLogo}>
            <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
              <Ionicons name="leaf" size={20} color="#fff" />
            </View>
            <Text style={[styles.footerLogoText, { color: colors.text }]}>
              PhylloZinc Research
            </Text>
          </View>
          <Text style={[styles.footerDescription, { color: colors.textMuted }]}>
            Advancing sustainable solutions for environmental challenges through innovative green chemistry.
          </Text>
          
          <View style={styles.socialLinks}>
            {['logo-instagram', 'logo-youtube', 'logo-facebook'].map((icon, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.socialButton, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}
              >
                <Ionicons name={icon as any} size={20} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.copyright, { color: colors.textMuted }]}>
            © 2025 PhylloZinc Research. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Chat Button */}
      <TouchableOpacity
        style={[styles.chatButton, { backgroundColor: colors.primary, bottom: insets.bottom + 80 }, Shadows.lg]}
        onPress={() => router.push('/chatbot')}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Hero Section
  heroSection: {
    height: 500,
  },
  heroOverlay: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 36,
    height: 36,
  },
  logoText: {
    color: '#fff',
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  authButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  authButtonText: {
    color: '#fff',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: Spacing.lg,
  },
  badgeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  heroTitle: {
    color: '#fff',
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.semibold,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: Spacing.md,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  highlight: {
    color: '#bbf7d0',
    fontWeight: FontWeights.semibold,
  },
  ctaButton: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: '#fff',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },

  // Section Styles
  section: {
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.light,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  divider: {
    width: 48,
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.md,
  },
  sectionSubtitle: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Crisis Cards
  crisisCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  crisisStats: {
    marginBottom: Spacing.md,
  },
  statNumber: {
    fontSize: 48,
    fontWeight: FontWeights.bold,
  },
  statLabel: {
    fontSize: FontSizes.md,
  },
  crisisTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  crisisDescription: {
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  progressBarContainer: {
    marginTop: Spacing.lg,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: FontSizes.xs,
    marginTop: Spacing.xs,
  },

  // Overview Cards
  overviewCards: {
    gap: Spacing.md,
  },
  overviewCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  overviewIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  overviewTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  overviewDesc: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },

  // Methodology Steps
  methodStep: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  stepDesc: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },

  // Benefits
  benefitsGrid: {
    gap: Spacing.md,
  },
  benefitCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  benefitTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.md,
  },
  benefitPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  bulletPoint: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    marginRight: Spacing.sm,
    lineHeight: 20,
  },
  benefitPointText: {
    flex: 1,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  emptyStateText: {
    fontSize: FontSizes.lg,
    marginTop: Spacing.md,
  },

  // View All Button
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
  },
  viewAllButtonText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },

  // Footer
  footer: {
    padding: Spacing.xl,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  footerLogoText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  footerDescription: {
    fontSize: FontSizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  copyright: {
    fontSize: FontSizes.xs,
  },

  // Chat Button
  chatButton: {
    position: 'absolute',
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
