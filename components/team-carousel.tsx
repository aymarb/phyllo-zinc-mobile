import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BorderRadius, FontSizes, FontWeights, Spacing, Shadows, TEAM_MEMBERS } from '@/constants';
import { getTeamMemberImage } from '@/assets/images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const CARD_MARGIN = Spacing.sm;
const ITEM_WIDTH = CARD_WIDTH + CARD_MARGIN * 2;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2 - CARD_MARGIN;

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  major: string[];
  isSupervisor?: boolean;
}

export function TeamCarousel() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const scrollToIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, TEAM_MEMBERS.length - 1));
    flatListRef.current?.scrollToOffset({
      offset: clampedIndex * ITEM_WIDTH,
      animated: true,
    });
    setCurrentIndex(clampedIndex);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? TEAM_MEMBERS.length - 1 : currentIndex - 1;
    scrollToIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === TEAM_MEMBERS.length - 1 ? 0 : currentIndex + 1;
    scrollToIndex(newIndex);
  };

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderMember = ({ item, index }: { item: TeamMember; index: number }) => {
    const isActive = index === currentIndex;
    const imageSource = getTeamMemberImage(item.image);

    return (
      <Animated.View
        style={[
          styles.card,
          {
            width: CARD_WIDTH,
            backgroundColor: colors.card,
            borderColor: isActive ? colors.primary : colors.border,
            borderWidth: isActive ? 2 : 1,
            transform: [{ scale: isActive ? 1 : 0.9 }],
            opacity: isActive ? 1 : 0.7,
          },
          Shadows.lg,
        ]}
      >
        {/* Supervisor badge */}
        {item.isSupervisor && (
          <View style={[styles.supervisorBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.supervisorBadgeText}>Supervisor</Text>
          </View>
        )}
        <View style={[styles.imageContainer, { backgroundColor: '#f0fdf4' }]}>
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.memberName, { color: colors.text }]}>
            {item.name}
          </Text>
          {item.role && (
            <Text style={[styles.memberRole, { color: colors.primary }]}>
              {item.role}
            </Text>
          )}
          <View style={styles.majorContainer}>
            <Text style={[styles.majorLabel, { color: colors.text }]}>
              {item.isSupervisor ? 'Faculty:' : 'Major:'}
            </Text>
            <View style={styles.majorTags}>
              {item.major.map((m, idx) => (
                <View
                  key={idx}
                  style={[styles.majorTag, { backgroundColor: colors.primaryLight }]}
                >
                  <Text style={[styles.majorTagText, { color: colors.primary }]}>
                    {m}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={TEAM_MEMBERS}
        renderItem={renderMember}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={styles.listContainer}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
      />

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={goToPrevious}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>

        {/* Dots Indicator */}
        <View style={styles.dots}>
          {TEAM_MEMBERS.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToIndex(index)}
            >
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: index === currentIndex ? colors.primary : colors.border,
                    width: index === currentIndex ? 24 : 8,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={goToNext}
        >
          <Ionicons name="chevron-forward" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg,
  },
  listContainer: {
    paddingHorizontal: SIDE_PADDING,
  },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  supervisorBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    zIndex: 10,
  },
  supervisorBadgeText: {
    color: '#fff',
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: Spacing.lg,
  },
  memberName: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
  },
  memberRole: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    marginTop: Spacing.xs,
  },
  majorContainer: {
    marginTop: Spacing.md,
  },
  majorLabel: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  majorTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  majorTag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  majorTagText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
