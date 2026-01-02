import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BorderRadius, FontSizes, FontWeights, Spacing, Shadows } from '@/constants';
import type { Article } from '@/store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.lg * 3) / 2; // Two columns with padding

interface ArticleCardProps {
  article: Article;
  onPress: () => void;
  variant?: 'grid' | 'list' | 'featured';
}

export function ArticleCard({ article, onPress, variant = 'grid' }: ArticleCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (variant === 'featured') {
    return (
      <TouchableOpacity
        style={[
          styles.featuredContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          Shadows.sm,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: article.image || 'https://via.placeholder.com/400x200' }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
        <View style={styles.featuredContent}>
          <Text style={[styles.featuredDate, { color: colors.textMuted }]}>
            {article.date}
          </Text>
          <Text
            style={[styles.featuredTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {article.title}
          </Text>
          <Text
            style={[styles.featuredExcerpt, { color: colors.textMuted }]}
            numberOfLines={2}
          >
            {article.excerpt}
          </Text>
          <View style={styles.readMore}>
            <Text style={[styles.readMoreText, { color: colors.primary }]}>
              See More
            </Text>
            <Ionicons name="arrow-forward" size={14} color={colors.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'list') {
    return (
      <TouchableOpacity
        style={[
          styles.listContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: article.image || 'https://via.placeholder.com/150x150' }}
          style={styles.listImage}
          resizeMode="cover"
        />
        <View style={styles.listContent}>
          <View style={styles.categoryBadge}>
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {article.category}
            </Text>
          </View>
          <Text
            style={[styles.listTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {article.title}
          </Text>
          <Text style={[styles.listDate, { color: colors.textMuted }]}>
            {article.date}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    );
  }

  // Grid variant (default)
  return (
    <TouchableOpacity
      style={[
        styles.gridContainer,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          width: CARD_WIDTH,
        },
        Shadows.sm,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: article.image || 'https://via.placeholder.com/200x150' }}
        style={styles.gridImage}
        resizeMode="cover"
      />
      <View style={[styles.categoryBadgeOverlay, { backgroundColor: colors.primary }]}>
        <Text style={styles.categoryBadgeText}>{article.category}</Text>
      </View>
      <View style={styles.gridContent}>
        <Text style={[styles.gridDate, { color: colors.textMuted }]}>
          {article.date}
        </Text>
        <Text
          style={[styles.gridTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {article.title}
        </Text>
        <Text
          style={[styles.gridExcerpt, { color: colors.textMuted }]}
          numberOfLines={2}
        >
          {article.excerpt}
        </Text>
        <View style={styles.readMore}>
          <Text style={[styles.readMoreTextSmall, { color: colors.primary }]}>
            Read Article
          </Text>
          <Ionicons name="arrow-forward" size={12} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Featured variant
  featuredContainer: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  featuredImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0fdf4',
  },
  featuredContent: {
    padding: Spacing.lg,
  },
  featuredDate: {
    fontSize: FontSizes.xs,
    marginBottom: Spacing.sm,
  },
  featuredTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
    lineHeight: 24,
  },
  featuredExcerpt: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  readMoreText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },
  readMoreTextSmall: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },

  // List variant
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  listImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: '#f0fdf4',
  },
  listContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  categoryText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  listTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  listDate: {
    fontSize: FontSizes.xs,
  },

  // Grid variant
  gridContainer: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  gridImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#f0fdf4',
  },
  categoryBadgeOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  gridContent: {
    padding: Spacing.md,
  },
  gridDate: {
    fontSize: FontSizes.xs,
    marginBottom: Spacing.xs,
  },
  gridTitle: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  gridExcerpt: {
    fontSize: FontSizes.xs,
    lineHeight: 16,
    marginBottom: Spacing.sm,
  },
});
