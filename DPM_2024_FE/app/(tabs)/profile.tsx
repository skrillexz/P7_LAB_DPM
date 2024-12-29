import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator, Button, Dialog, PaperProvider, Portal, Text } from 'react-native-paper';
import API_URL from '@/config/config';

type UserProfile = {
    username: string;
    email: string;
    avatar?: string;
};

const ProfileScreen = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [dialogVisible, setDialogVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get<{ data: UserProfile }>(`${API_URL}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setDialogVisible(true);
    };

    const confirmLogout = async () => {
        await AsyncStorage.removeItem('token');
        router.replace('/auth/LoginScreen');
    };

    if (loading) {
        return (
            <PaperProvider>
                <ThemedView style={styles.container}>
                    <ActivityIndicator animating={true} size="large" />
                </ThemedView>
            </PaperProvider>
        );
    }

    return (
        <PaperProvider>
            <ThemedView style={styles.container}>
                {profile ? (
                    <View style={styles.profileCard}>
                        {profile.avatar ? (
                            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <ThemedText style={styles.avatarText}>{profile.username[0]}</ThemedText>
                            </View>
                        )}
                        <ThemedText style={styles.title}>Profile</ThemedText>
                        <ThemedText style={styles.label}>Username:</ThemedText>
                        <ThemedText style={styles.value}>{profile.username}</ThemedText>
                        <ThemedText style={styles.label}>Email:</ThemedText>
                        <ThemedText style={styles.value}>{profile.email}</ThemedText>
                        <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
                            Log Out
                        </Button>
                    </View>
                ) : (
                    <ThemedText>No profile data available</ThemedText>
                )}
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                        <Dialog.Title>Logout</Dialog.Title>
                        <Dialog.Content>
                            <Text>Are you sure you want to logout?</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                            <Button onPress={confirmLogout}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ThemedView>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#121212', // Dark background color
    },
    profileCard: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#1f1f1f', // Dark card background
        padding: 24,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        backgroundColor: '#007BFF',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff', // White text for title
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        color: '#bbb', // Light gray for labels
        marginTop: 16,
        textAlign: 'left',
        width: '100%',
    },
    value: {
        fontSize: 18,
        color: '#fff', // White text for value
        marginBottom: 16,
    },
    logoutButton: {
        marginTop: 24,
        width: '100%',
        paddingVertical: 12,
        backgroundColor: '#FF4B5C', // Red button for logout
        borderRadius: 8,
    },
});

export default ProfileScreen;
