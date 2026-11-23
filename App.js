import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { listar, criar, atualizar, excluir, mensagemErro } from "./src/api";

export default function App() {
  const [atividades, setAtividades] = useState([]);
  const [texto, setTexto] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = async () => {
    try {
      setAtividades(await listar());
    } catch (err) {
      Alert.alert("Erro", mensagemErro(err));
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const limparForm = () => {
    setTexto("");
    setEditandoId(null);
  };

  const salvar = async () => {
    const titulo = texto.trim();
    if (!titulo) return Alert.alert("Atenção", "Digite uma atividade.");
    try {
      if (editandoId) await atualizar(editandoId, { titulo });
      else await criar(titulo);
      limparForm();
      carregar();
    } catch (err) {
      Alert.alert("Erro", mensagemErro(err));
    }
  };

  const alternar = async (item) => {
    try {
      await atualizar(item._id, { concluida: !item.concluida });
      carregar();
    } catch (err) {
      Alert.alert("Erro", mensagemErro(err));
    }
  };

  const iniciarEdicao = (item) => {
    setEditandoId(item._id);
    setTexto(item.titulo);
  };

  const confirmarExclusao = (item) => {
    Alert.alert("Excluir", `Excluir "${item.titulo}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await excluir(item._id);
            if (editandoId === item._id) limparForm();
            carregar();
          } catch (err) {
            Alert.alert("Erro", mensagemErro(err));
          }
        },
      },
    ]);
  };

  const feitas = atividades.filter((a) => a.concluida).length;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.itemTexto} onPress={() => alternar(item)}>
        <Text style={styles.check}>{item.concluida ? "✅" : "⬜"}</Text>
        <Text style={[styles.titulo, item.concluida && styles.tituloFeito]}>
          {item.titulo}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => iniciarEdicao(item)}>
        <Text style={styles.acao}>✏️</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => confirmarExclusao(item)}>
        <Text style={styles.acao}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>📋 Meu Checklist</Text>
        <Text style={styles.headerSub}>
          {feitas} de {atividades.length} concluídas
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={texto}
          onChangeText={setTexto}
          placeholder="Nova atividade..."
          onSubmitEditing={salvar}
        />
        <TouchableOpacity style={styles.btn} onPress={salvar}>
          <Text style={styles.btnTxt}>{editandoId ? "Salvar" : "Add"}</Text>
        </TouchableOpacity>
        {editandoId && (
          <TouchableOpacity
            style={[styles.btn, styles.btnCancelar]}
            onPress={limparForm}
          >
            <Text style={styles.btnTxt}>X</Text>
          </TouchableOpacity>
        )}
      </View>

      {carregando ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={atividades}
          keyExtractor={(i) => i._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhuma atividade ainda.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: {
    backgroundColor: "#111827",
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitulo: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  headerSub: { color: "#9CA3AF", marginTop: 4 },
  form: { flexDirection: "row", padding: 16, gap: 8 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  btn: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  btnCancelar: { backgroundColor: "#6B7280" },
  btnTxt: { color: "#fff", fontWeight: "bold" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  itemTexto: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  check: { fontSize: 20 },
  titulo: { fontSize: 16, color: "#111827", flexShrink: 1 },
  tituloFeito: { textDecorationLine: "line-through", color: "#9CA3AF" },
  acao: { fontSize: 20 },
  vazio: { textAlign: "center", marginTop: 40, color: "#6B7280" },
});
