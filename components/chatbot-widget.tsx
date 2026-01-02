import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BorderRadius, FontSizes, FontWeights, Spacing, Shadows } from '@/constants';
import { useChatStore, ChatMessage } from '@/store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, sendMessage } = useChatStore();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isOpen ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  }, [isOpen]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const message = inputValue;
    setInputValue('');
    Keyboard.dismiss();
    await sendMessage(message);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageBubble,
        item.role === 'user'
          ? [styles.userMessage, { backgroundColor: colors.primary }]
          : [styles.botMessage, { backgroundColor: colors.card, borderColor: colors.border }],
      ]}
    >
      <Text
        style={[
          styles.messageText,
          { color: item.role === 'user' ? '#fff' : colors.text },
        ]}
      >
        {item.content}
      </Text>
    </View>
  );

  const LoadingIndicator = () => (
    <View style={[styles.botMessage, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.loadingContainer}>
        <View style={[styles.loadingDot, { backgroundColor: colors.primary }]} />
        <View style={[styles.loadingDot, styles.loadingDotDelay1, { backgroundColor: colors.primary }]} />
        <View style={[styles.loadingDot, styles.loadingDotDelay2, { backgroundColor: colors.primary }]} />
      </View>
    </View>
  );

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <TouchableOpacity
          style={[
            styles.floatingButton,
            { backgroundColor: colors.primary, bottom: insets.bottom + 80 },
            Shadows.lg,
          ]}
          onPress={() => setIsOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Animated.View
          style={[
            styles.chatWindow,
            {
              backgroundColor: colors.background,
              bottom: insets.bottom + 20,
              transform: [{ scale: scaleAnim }],
              opacity: scaleAnim,
            },
            Shadows.xl,
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.primary }]}>
            <View style={styles.headerLeft}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
              <Text style={styles.headerTitle}>Research Assistant</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsOpen(false)}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <View style={[styles.messagesContainer, { backgroundColor: '#f0fdf4' + '20' }]}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={isLoading ? LoadingIndicator : null}
            />
          </View>

          {/* Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Ask a question..."
                placeholderTextColor={colors.textMuted}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: colors.primary, opacity: !inputValue.trim() || isLoading ? 0.5 : 1 },
                ]}
                onPress={handleSend}
                disabled={!inputValue.trim() || isLoading}
              >
                <Ionicons name="send" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  chatWindow: {
    position: 'absolute',
    right: Spacing.lg,
    left: Spacing.lg,
    height: SCREEN_HEIGHT * 0.6,
    maxHeight: 500,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    zIndex: 1001,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    color: '#fff',
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  userMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: BorderRadius.sm,
  },
  botMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  messageText: {
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.xs,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  loadingDotDelay1: {
    opacity: 0.7,
  },
  loadingDotDelay2: {
    opacity: 0.4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    gap: Spacing.sm,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.sm,
    maxHeight: 80,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
