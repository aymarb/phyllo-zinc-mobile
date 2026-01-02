import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BorderRadius, FontSizes, FontWeights, Spacing, Shadows } from '@/constants';
import { useAuthStore } from '@/store';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session, isAdmin, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  if (!session) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={styles.guestContainer}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="person" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.guestTitle, { color: colors.text }]}>
            Welcome to PhylloZinc
          </Text>
          <Text style={[styles.guestSubtitle, { color: colors.textMuted }]}>
            Sign in to access your profile, manage articles, and more.
          </Text>
          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/auth')}
          >
            <Ionicons name="log-in-outline" size={20} color="#fff" />
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const menuItems = [
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon.') },
        { icon: 'notifications-outline', label: 'Notifications', onPress: () => Alert.alert('Coming Soon', 'Notification settings will be available soon.') },
      ],
    },
    {
      title: 'Content',
      items: [
        { icon: 'bookmark-outline', label: 'Saved Articles', onPress: () => Alert.alert('Coming Soon', 'Saved articles will be available soon.') },
        { icon: 'time-outline', label: 'Reading History', onPress: () => Alert.alert('Coming Soon', 'Reading history will be available soon.') },
      ],
    },
    ...(isAdmin ? [{
      title: 'Admin',
      items: [
        { icon: 'settings-outline', label: 'Admin Dashboard', onPress: () => router.push('/admin') },
        { icon: 'document-text-outline', label: 'Manage Articles', onPress: () => router.push('/admin') },
      ],
    }] : []),
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help & FAQ', onPress: () => Alert.alert('Help', 'Contact us at support@phyllozinc.com') },
        { icon: 'information-circle-outline', label: 'About', onPress: () => Alert.alert('About', 'PhylloZinc Research App v1.0.0') },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        </View>

        {/* User Info */}
        <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {session.user.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {session.user.name || 'User'}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textMuted }]}>
              {session.user.email}
            </Text>
            {isAdmin && (
              <View style={[styles.adminBadge, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="shield-checkmark" size={12} color={colors.primary} />
                <Text style={[styles.adminBadgeText, { color: colors.primary }]}>Admin</Text>
              </View>
            )}
          </View>
        </View>

        {/* Menu Sections */}
        {menuItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={[styles.menuSectionTitle, { color: colors.textMuted }]}>
              {section.title}
            </Text>
            <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex < section.items.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 },
                  ]}
                  onPress={item.onPress}
                >
                  <View style={[styles.menuItemIcon, { backgroundColor: colors.primaryLight }]}>
                    <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                  </View>
                  <Text style={[styles.menuItemLabel, { color: colors.text }]}>
                    {item.label}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity
            style={[styles.signOutButton, { borderColor: colors.error }]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={[styles.signOutButtonText, { color: colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text style={[styles.version, { color: colors.textMuted }]}>
          PhylloZinc Research v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Guest State
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  guestTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.sm,
  },
  guestSubtitle: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },

  // Header
  header: {
    padding: Spacing.lg,
  },
  headerTitle: {
    fontSize: FontSizes.xxxl,
    fontWeight: FontWeights.light,
  },

  // User Card
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.lg,
    marginTop: 0,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
  userEmail: {
    fontSize: FontSizes.sm,
    marginTop: 2,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xs,
    gap: 4,
  },
  adminBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
  },

  // Menu Sections
  menuSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  menuSectionTitle: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  menuCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemLabel: {
    flex: 1,
    fontSize: FontSizes.md,
  },

  // Sign Out
  signOutSection: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  signOutButtonText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
  },

  // Version
  version: {
    fontSize: FontSizes.xs,
    textAlign: 'center',
    paddingBottom: Spacing.xxl,
  },
});
