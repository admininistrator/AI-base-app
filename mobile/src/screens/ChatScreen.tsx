// app/(tabs)/index.tsx
import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from "react-native";

// TẠM THỜI: URL giả, backend mình sẽ làm sau.
// Khi chưa có backend, bấm nút sẽ báo lỗi network là bình thường.
const BASE_URL = "http://192.168.53.102:8000";

function formatAnswer(raw: string): string {
    return raw
        // bỏ ``` ``` bao quanh code/CSV nếu có
        .replace(/```[a-z]*\n?/gi, "")   // bỏ ```csv, ```python, ```...
        .replace(/```/g, "")             // bỏ ``` còn lại

        // bỏ heading #, ##, ### ở đầu dòng
        .replace(/^###\s+/gm, "")        // ### Heading
        .replace(/^##\s+/gm, "")         // ## Heading
        .replace(/^#\s+/gm, "")          // # Heading

        // bỏ **bold**
        .replace(/\*\*(.*?)\*\*/g, "$1")

        // chuyển dấu gạch đầu dòng thành chấm •
        .replace(/^\s*-\s+/gm, "• ")

        .trim();
}

export default function Index() {
    const [prompt, setPrompt] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);
        setAnswer("");

        try {
            const res = await fetch(`${BASE_URL}/ask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                throw new Error(`HTTP status ${res.status}`);
            }

            const data = await res.json();
            setAnswer(data.answer || "(Backend không trả về answer)");
        } catch (err: any) {
            console.log("Error:", err);
            setError(err.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={styles.title}>Chat DPT - based on Gemini 2.5-flash</Text>
                    <Text style={styles.subtitle}>
                        Nhập prompt, gửi lên backend. Backend sẽ gọi Gemini API và trả câu trả lời lại.
                    </Text>

                    <Text style={styles.label}>Prompt gửi lên backend:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Prompt của bạn ở đây"
                        value={prompt}
                        onChangeText={setPrompt}
                        multiline
                        placeholderTextColor="#AAAAAA"
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSend}>
                        <Text style={styles.buttonText}>
                            {loading ? "Đang gửi..." : "Gửi lên backend"}
                        </Text>
                    </TouchableOpacity>

                    {loading && <ActivityIndicator style={{ marginTop: 16 }} size="large" />}

                    {error && <Text style={styles.errorText}>Lỗi: {error}</Text>}

                    {answer ? (
                        <View style={styles.answerBox}>
                            <Text style={styles.answerTitle}>Câu trả lời từ backend:</Text>
                            <Text style={styles.answerText} selectable>
                                {formatAnswer(answer)}
                            </Text>
                        </View>
                    ) : null}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#555",
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        minHeight: 80,
        textAlignVertical: "top",
        marginBottom: 12,
    },
    button: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    errorText: {
        color: "red",
        marginTop: 10,
    },
    answerBox: {
        marginTop: 16,
        padding: 12,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    answerTitle: {
        fontWeight: "700",
        marginBottom: 6,
    },
    answerText: {
        fontSize: 15,
    },
});
