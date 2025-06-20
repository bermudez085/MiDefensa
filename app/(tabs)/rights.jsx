import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("window");

export default function RightsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>
          Know Your Rights / Conozca Sus Derechos
        </Text>

        {/* Section 1 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚪 If ICE Comes to Your Home</Text>
          <Text style={styles.bodyText}>
            Do not open the door unless they show a signed warrant.
          </Text>
          <Text style={styles.bodyText}>
            No abra la puerta a menos que muestren una orden firmada por un
            juez.
          </Text>
          <Text style={styles.bodyText}>
            You have the right to remain silent.
          </Text>
          <Text style={styles.bodyText}>
            Tiene el derecho de guardar silencio.
          </Text>
          <Text style={styles.bodyText}>
            Say:{" "}
            <Text style={styles.bold}>
              &ldquo;I do not consent to a search.&rdquo;
            </Text>
          </Text>
          <Text style={styles.bodyText}>
            Diga:{" "}
            <Text style={styles.bold}>
              &ldquo;No doy mi consentimiento para un registro.&rdquo;
            </Text>
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Section 2 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛑 If ICE Stops You in Public</Text>
          <Text style={styles.bodyText}>
            Ask: <Text style={styles.bold}>&ldquo;Am I free to go?&rdquo;</Text>
          </Text>
          <Text style={styles.bodyText}>
            Pregunte:{" "}
            <Text style={styles.bold}>&ldquo;¿Estoy libre de irme?&rdquo;</Text>
          </Text>
          <Text style={styles.bodyText}>
            You do not have to answer questions about immigration status.
          </Text>
          <Text style={styles.bodyText}>
            No tiene que responder preguntas sobre su estatus migratorio.
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Section 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 If You Are Detained</Text>
          <Text style={styles.bodyText}>
            Do not sign anything without a lawyer present.
          </Text>
          <Text style={styles.bodyText}>
            No firme nada sin la presencia de un abogado.
          </Text>
          <Text style={styles.bodyText}>
            You have the right to make a phone call.
          </Text>
          <Text style={styles.bodyText}>
            Tiene derecho a hacer una llamada telefónica.
          </Text>
          <Text style={styles.bodyText}>
            Say:{" "}
            <Text style={styles.bold}>
              &ldquo;I want to speak to a lawyer.&rdquo;
            </Text>
          </Text>
          <Text style={styles.bodyText}>
            Diga:{" "}
            <Text style={styles.bold}>
              &ldquo;Quiero hablar con un abogado.&rdquo;
            </Text>
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Section 4 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Key Phrases / Frases Clave</Text>
          <Text style={styles.bodyText}>
            &ldquo;I do not consent to a search.&rdquo; — &ldquo;No doy mi
            consentimiento para un registro.&rdquo;
          </Text>
          <Text style={styles.bodyText}>
            &ldquo;I wish to remain silent.&rdquo; — &ldquo;Deseo permanecer en
            silencio.&rdquo;
          </Text>
          <Text style={styles.bodyText}>
            &ldquo;I want to speak to a lawyer.&rdquo; — &ldquo;Quiero hablar
            con un abogado.&rdquo;
          </Text>
        </View>

        <View style={styles.linkBox}>
          <Text style={styles.linkLabel}>
            Need more help or printable resources?
          </Text>
          <Text
            style={styles.link}
            onPress={() =>
              Linking.openURL(
                "https://www.aclu.org/know-your-rights/immigrants-rights"
              )
            }
          >
            Visit ACLU Know Your Rights
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  container: {
    paddingHorizontal: width * 0.05,
    paddingVertical: 20,
  },
  heading: {
    fontSize: RFValue(24),
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#222",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: RFValue(18),
    fontWeight: "600",
    marginBottom: 10,
    color: "#111",
  },
  bodyText: {
    fontSize: RFValue(14),
    lineHeight: 22,
    marginBottom: 8,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  linkBox: {
    marginTop: 30,
    marginBottom: 40,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  linkLabel: {
    fontSize: RFValue(13),
    marginBottom: 5,
    color: "#444",
    textAlign: "center",
  },
  link: {
    fontSize: RFValue(14),
    color: "#007aff",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
