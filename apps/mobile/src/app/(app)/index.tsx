import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useSession } from "@/context/auth-context";
import { ApiError, generateRequest } from "@/lib/api";
import { useTheme } from "@/hooks/use-theme";

export default function GenerateScreen() {
  const theme = useTheme();
  const { session, user, signOut } = useSession();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onGenerate = async () => {
    if (!session) {
      return;
    }

    const cleaned = prompt.trim();

    if (!cleaned) {
      setError("Enter a prompt first");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await generateRequest(session, cleaned);
      setResponse(result.message);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut();
        return;
      }

      setError(err instanceof ApiError ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <View style={styles.userBlock}>
            <ThemedText type="smallBold">Gemini Prompt</ThemedText>
            <ThemedText themeColor="textSecondary" type="small">
              Signed in as {user?.name ?? "User"}
            </ThemedText>
          </View>
          <Pressable onPress={signOut} style={styles.signOut}>
            <ThemedText themeColor="textSecondary">Sign out</ThemedText>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.content}
        >
          <TextInput
            multiline
            placeholder="Ask Gemini anything..."
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.promptInput,
              {
                color: theme.text,
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
              },
            ]}
            textAlignVertical="top"
            value={prompt}
            onChangeText={setPrompt}
          />

          <Pressable
            disabled={loading}
            onPress={onGenerate}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: theme.text,
                opacity: pressed || loading ? 0.7 : 1,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={theme.background} />
            ) : (
              <ThemedText
                style={[styles.buttonLabel, { color: theme.background }]}
              >
                Generate
              </ThemedText>
            )}
          </Pressable>

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

          <ScrollView
            contentContainerStyle={styles.responseContent}
            style={[
              styles.responseBox,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.backgroundSelected,
              },
            ]}
          >
            <ThemedText themeColor="textSecondary" type="small">
              Response
            </ThemedText>
            <ThemedText>
              {response ?? "Your Gemini response will appear here."}
            </ThemedText>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  userBlock: {
    flex: 1,
    gap: Spacing.half,
  },
  signOut: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  content: {
    flex: 1,
    gap: Spacing.three,
  },
  promptInput: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  buttonLabel: {
    fontWeight: "600",
    fontSize: 16,
  },
  error: {
    color: "#c62828",
  },
  responseBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
  },
  responseContent: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
});
