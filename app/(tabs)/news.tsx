import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function NewsScreen() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = "a1f91566a1dba6718583a93ed24c77f1"; 
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const today = new Date().toISOString().split("T")[0]; 
        const url = `https://gnews.io/api/v4/search?q=ICE+immigration&lang=en&from=${today}&sortby=publishedAt&token=${API_KEY}`;

        const res = await axios.get(url);
        setArticles(res.data.articles);
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📰 ICE News (Today)</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : articles.length === 0 ? (
        <Text>No news articles found for today.</Text>
      ) : (
        articles.map((item, i) => (
          <View key={i} style={styles.article}>
            <Text style={styles.headline}>{item.title}</Text>
            <Text style={styles.source}>{item.source.name}</Text>
            <Text
              style={styles.link}
              onPress={() => Linking.openURL(item.url)}
            >
              Read Full Article
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  article: {
    marginBottom: 25,
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 8,
  },
  headline: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  source: {
    fontSize: 12,
    color: "gray",
    marginBottom: 6,
  },
  link: {
    color: "#007aff",
    textDecorationLine: "underline",
  },
});
