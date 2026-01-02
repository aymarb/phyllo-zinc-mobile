import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BorderRadius, FontSizes, FontWeights, Spacing, Shadows } from '@/constants';
import { useArticlesStore, Article } from '@/store';
import { ArticleCard } from '@/components/article-card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ArticlesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { articles, fetchArticles, isLoading, error } = useArticlesStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchArticles();
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(articles.map(a => a.category).filter(Boolean))];

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Hero Section */}
      <View style={[styles.hero, { backgroundColor: colors.background }]}>
        <Text style={[styles.heroTitle, { color: colors.text }]}>
          Research Articles & Publications
        </Text>
        <Text style={[styles.heroSubtitle, { color: colors.textMuted }]}>
          Explore our latest research findings, insights, and publications on green synthesis and sustainable agriculture
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.input, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search articles..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <FlatList
        horizontal
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              {
                backgroundColor: (selectedCategory === item || (!selectedCategory && item === 'All'))
                  ? colors.primary
                  : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setSelectedCategory(item === 'All' ? null : item)}
          >
            <Text
              style={[
                styles.categoryChipText,
                {
                  color: (selectedCategory === item || (!selectedCategory && item === 'All'))
                    ? '#fff'
                    : colors.text,
                },
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      />

      {/* View Toggle & Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsCount, { color: colors.textMuted }]}>
          {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
        </Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === 'grid' && { backgroundColor: colors.primaryLight },
            ]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons
              name="grid"
              size={18}
              color={viewMode === 'grid' ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === 'list' && { backgroundColor: colors.primaryLight },
            ]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons
              name="list"
              size={18}
              color={viewMode === 'list' ? colors.primary : colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name="document-text-outline" size={64} color={colors.textMuted} />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        {error ? 'Error loading articles' : 'No articles found'}
      </Text>
      <Text style={[styles.emptyStateText, { color: colors.textMuted }]}>
        {error
          ? 'Please check your connection and try again.'
          : searchQuery
            ? 'Try adjusting your search or filters.'
            : 'Check back later for new content.'}
      </Text>
      {error && (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={() => fetchArticles()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderArticle = ({ item, index }: { item: Article; index: number }) => (
    <View style={viewMode === 'grid' ? styles.gridItem : undefined}>
      <ArticleCard
        article={item}
        variant={viewMode}
        onPress={() => router.push(`/article/${item.id}` as any)}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <FlatList
        data={filteredArticles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode} // Force re-render when view mode changes
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={fetchArticles}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  
  // Header
  headerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  hero: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.light,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSizes.md,
    paddingVertical: Spacing.xs,
  },

  // Categories
  categoriesList: {
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  categoryChipText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
  },

  // Results Header
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  resultsCount: {
    fontSize: FontSizes.sm,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  viewToggleButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
  },

  // Grid
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  gridItem: {
    flex: 1,
    maxWidth: '48%',
  },

  // Empty State
  emptyState: {
    margin: Spacing.lg,
    padding: Spacing.xxl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },
});
