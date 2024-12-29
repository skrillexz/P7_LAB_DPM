import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { ThemedView } from "@/components/ThemedView";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import API_URL from "../../config/config";

export default function RegisterScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const router = useRouter();

    const handleRegister = async () => {
        try {
            await axios.post(`${API_URL}/api/auth/register`, { username, password, email });
            router.replace("/auth/LoginScreen");
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || "An error occurred";
            setDialogMessage(errorMessage);
            setDialogVisible(true);
        }
    };

    return (
        <PaperProvider>
            <ThemedView style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Create an Account</Text>
                    <Text style={styles.subtitle}>Join us and get started</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/auth/LoginScreen")}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                            <Dialog.Title>Registration Failed</Dialog.Title>
                            <Dialog.Content>
                                <Text>{dialogMessage}</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setDialogVisible(false)}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </View>
            </ThemedView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        padding: 16,
    },
    formContainer: {
        width: "100%",
        maxWidth: 400,
        padding: 32,
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#4A90E2",
        marginBottom: 16,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#7B7B7B",
        marginBottom: 24,
        textAlign: "center",
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        backgroundColor: "#fafafa",
        fontSize: 16,
        color: "#333",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
    },
    registerButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#4A90E2",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 2,
    },
    registerButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    loginButton: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#4A90E2",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        backgroundColor: "transparent",
    },
    loginButtonText: {
        color: "#4A90E2",
        fontSize: 16,
        fontWeight: "600",
    },
});
