// CheckoutScreen.tsx
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Button,
  Linking,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { functions } from "@/lib/appwrite";

type CheckoutParams = { amount: string };

const CheckoutScreen = () => {
  const params = useLocalSearchParams<CheckoutParams>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const createSession = async () => {
    setLoading(true);
    setError(null);
    setStatusMessage("Creating checkout session...");

    try {
      const functionId = "68d58d9d0015f0e49432";
      const amount = parseInt(params.amount || "0", 10);

      // Trigger execution
      const exec = await functions.createExecution({
        functionId,
        body: JSON.stringify({ amount }),
      });
      console.log("Execution created:", exec);

      // Try parsing immediate response
      if (exec.responseBody) {
        const parsed = JSON.parse(exec.responseBody);
        if (parsed?.checkoutUrl) {
          setStatusMessage("Redirecting to Stripe...");
          Linking.openURL(parsed.checkoutUrl);
          return;
        }
      }

      let attempts = 0;
      let result: any = null;

      // Poll for status until completed or failed
      while (attempts < 20) {
        const status = await functions.getExecution({
          functionId,
          executionId: exec.$id,
        });
        console.log(`Attempt ${attempts + 1}: Status ->`, status.status);

        if (status.status === "completed") {
          result = status.responseBody
            ? JSON.parse(status.responseBody)
            : null;
          console.log("Final execution result:", result);

          if (result?.checkoutUrl) {
            setStatusMessage("Redirecting to Stripe...");
            Linking.openURL(result.checkoutUrl);
            return;
          }
          break;
        }

        if (status.status === "failed") {
          console.error("Execution failed:", status.errors);
          throw new Error("Function execution failed");
        }

        await new Promise((res) => setTimeout(res, 1000)); // wait 1s before next attempt
        attempts++;
      }

      throw new Error("No checkout URL returned");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setStatusMessage("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    createSession();
  }, []);

  return (
    <View style={styles.center}>
      {loading && (
        <>
          <ActivityIndicator size="large" />
          <Text style={styles.message}>
            {statusMessage || "Loading checkout..."}
          </Text>
        </>
      )}

      {error && (
        <>
          <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
          <Button title="Retry" onPress={createSession} />
        </>
      )}
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  message: { marginTop: 10, color: "#555" },
});
