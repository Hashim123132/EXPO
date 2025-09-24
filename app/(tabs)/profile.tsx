import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { router } from "expo-router";
import { account, getCurrentUser, updateUser } from "@/lib/appwrite";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [userRowId, setUserRowId] = useState(""); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [profilePic, setProfilePic] = useState(""); // base64 image
  const [avatar, setAvatar] = useState(""); // fallback avatar URL

useEffect(() => {
  const loadUser = async () => {
    try {
      const user = await getCurrentUser();
      setUserRowId(user.$id || "");
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress1(user.address1 || "");
      setAddress2(user.address2 || "");

      // ✅ Set avatar or profilePic
      if (user.profilePic) {
        setAvatar(`data:image/jpeg;base64,${user.profilePic}`);
      } else if (user.avatar) {
        setAvatar(user.avatar); // fallback URL
      } else {
        setAvatar(""); // fallback initials
      }

    } catch (err) {
      console.error("Failed to load user:", err);
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, []);


const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    base64: true, // ✅ get base64 directly
    // mediaTypes is optional; default is images
  });

  if (result.canceled || !result.assets[0].base64) return;

  const base64Data = result.assets[0].base64;

  // Update DB directly
  await updateUser(userRowId, {
    name,
    email,
    phone,
    address1,
    address2,
    profilePic: base64Data,
  });

  // Show preview locally
  setAvatar(`data:image/jpeg;base64,${base64Data}`);
};


  const removeProfilePic = async () => {
    setProfilePic("");
    try {
      await updateUser(userRowId, { name, email, phone, address1, address2, profilePic: "" });
      Alert.alert("Removed", "Profile picture removed");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not remove profile picture");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUser(userRowId, { name, email, phone, address1, address2, profilePic });
      Alert.alert("Success", "Profile updated!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not update profile");
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSessions();
      router.replace("/sign-in");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <View style={styles.centered}><Text>Loading profile...</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: profilePic || avatar }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Icon name="edit-2" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteIcon} onPress={removeProfilePic}>
          <Icon name="trash-2" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {[
          { icon: "user", value: name, setter: setName, placeholder: "Full Name" },
          { icon: "mail", value: email, setter: setEmail, placeholder: "Email", keyboard: "email-address" },
          { icon: "phone", value: phone, setter: setPhone, placeholder: "Phone Number", keyboard: "phone-pad" },
          { icon: "map-pin", value: address1, setter: setAddress1, placeholder: "Address 1 (Home)" },
          { icon: "map-pin", value: address2, setter: setAddress2, placeholder: "Address 2 (Work)" },
        ].map((field, i) => (
          <View style={styles.inputRow} key={i}>
            <Icon name={field.icon} size={18} color="#f57c00" />
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.setter}
              placeholder={field.placeholder}
              keyboardType={field.keyboard as any}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.editButton} onPress={handleUpdate}>
        <Text style={styles.editText}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

// Styles same as before
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center", padding: 20 },
  avatarContainer: { position: "relative", alignItems: "center", justifyContent: "center", marginVertical: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  editIcon: { position: "absolute", bottom: 0, left: 0, backgroundColor: "#f57c00", padding: 6, borderRadius: 20 },
  deleteIcon: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#f57c00", padding: 6, borderRadius: 20 },
  card: { width: "100%", backgroundColor: "#fff", borderRadius: 16, padding: 15, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, marginBottom: 20 },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 12, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 6 },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: "#333" },
  editButton: { width: "100%", padding: 15, backgroundColor: "#fff3e0", borderRadius: 12, alignItems: "center", marginBottom: 10, borderWidth: 1, borderColor: "#f57c00" },
  editText: { color: "#f57c00", fontSize: 16, fontWeight: "600" },
  logoutButton: { width: "100%", padding: 15, backgroundColor: "#ffebee", borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#e53935" },
  logoutText: { color: "#e53935", fontSize: 16, fontWeight: "600" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
