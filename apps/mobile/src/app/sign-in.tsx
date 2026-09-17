import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useSession } from "@/context/auth-context";
import { ApiError } from "@/lib/api";
import { useTheme } from "@/hooks/use-theme";

export default function SignInScreen() {
  const theme = useTheme();
  const { signIn } = useSession();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.form}
        >
          <View style={styles.header}>
            <ThemedText type="subtitle">AI Mobile</ThemedText>
            <ThemedText themeColor="textSecondary">
              Sign in to generate responses with Gemini
            </ThemedText>
          </View>

          <View style={styles.fields}>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected,
                },
              ]}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              autoCapitalize="none"
              autoComplete="password"
              placeholder="Password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              style={[
                styles.input,
                {
                  color: theme.text,
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.backgroundSelected,
                },
              ]}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {error ? (
            <ThemedText style={styles.error}>{error}</ThemedText>
          ) : (
            <ThemedText themeColor="textSecondary" type="small">
              Demo: demo@example.com / password123
            </ThemedText>
          )}

          <Pressable
            disabled={loading}
            onPress={onSubmit}
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
                Sign in
              </ThemedText>
            )}
          </Pressable>
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
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
  },
  form: {
    gap: Spacing.three,
  },
  header: {
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  fields: {
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  error: {
    color: "#c62828",
  },
  button: {
    marginTop: Spacing.two,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    paddingHorizontal: Spacing.three,
  },
  buttonLabel: {
    fontWeight: "600",
    fontSize: 16,
  },
});
