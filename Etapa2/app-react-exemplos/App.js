import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_URL = 'http://10.81.205.31:3000/compras'; 

export default function App() {
  const [item, setItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [compras, setCompras] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState('');
  const [editQuantidade, setEditQuantidade] = useState('');

  useEffect(() => {
    carregarCompras();
  }, []);

  // GET
  const carregarCompras = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCompras(data);
    } catch (err) {
      console.error('Erro ao carregar compras:', err);
    }
  };

  // CREATE
  const adicionarCompra = async () => {
    if (item.trim() === '' || quantidade.trim() === '') return;

    const novaCompra = {
      item: item.trim(),
      quantidade: Number(quantidade)
    };

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaCompra)
      });

      setItem('');
      setQuantidade('');
      carregarCompras();
    } catch (err) {
      console.error('Erro ao adicionar compra:', err);
    }
  };

  // UPDATE
  const atualizarCompra = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: editItem,
          quantidade: Number(editQuantidade)
        })
      });

      setEditId(null);
      setEditItem('');
      setEditQuantidade('');
      carregarCompras();
    } catch (err) {
      console.error('Erro ao atualizar compra:', err);
    }
  };

  // DELETE
  const excluirCompra = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      carregarCompras();
    } catch (err) {
      console.error('Erro ao excluir compra:', err);
    }
  };

  const renderItem = ({ item }) => {
    if (item.id !== editId) {
      return (
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.item} - {item.quantidade}</Text>
          <View style={styles.buttons}>
            <Button title="Edit" onPress={() => {
              setEditId(item.id);
              setEditItem(item.item);
              setEditQuantidade(String(item.quantidade));
            }} />
            <Button title="Delete" color="red" onPress={() => excluirCompra(item.id)} />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.item}>
          <TextInput
            style={styles.editInput}
            value={editItem}
            onChangeText={setEditItem}
            placeholder="Novo nome"
          />
          <TextInput
            style={styles.editInput}
            value={editQuantidade}
            onChangeText={setEditQuantidade}
            keyboardType="numeric"
            placeholder="Nova quantidade"
          />
          <Button title="Update" onPress={() => atualizarCompra(item.id)} />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Lista de Compras</Text>

      <TextInput
        style={styles.input}
        value={item}
        onChangeText={setItem}
        placeholder="Item a comprar"
      />
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        placeholder="Quantidade"
        keyboardType="numeric"
      />
      <Button title="Add Item" onPress={adicionarCompra} />

      <FlatList
        data={compras}
        renderItem={renderItem}
        keyExtractor={item => item.id?.toString()}
        style={styles.list}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    backgroundColor: '#f3e6fa',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    marginBottom: 24,
    color: '#7c3aed',
    fontFamily: 'cursive',
    textAlign: 'center',
  },
  input: {
    borderColor: '#b794f4',
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    width: '90%',
    borderRadius: 8,
    backgroundColor: '#ede9fe',
    fontFamily: 'cursive',
    color: '#6d28d9',
    fontSize: 22,
    textAlign: 'left',
  },
  list: {
    marginTop: 24,
    width: '100%',
  },
  item: {
    backgroundColor: '#e9d5ff',
    padding: 18,
    marginBottom: 12,
    borderRadius: 10,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#a78bfa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  itemText: {
    fontSize: 24,
    color: '#7c3aed',
    fontFamily: 'cursive',
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'center',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#c4b5fd',
    padding: 8,
    marginBottom: 8,
    borderRadius: 6,
    backgroundColor: '#faf5ff',
    fontFamily: 'cursive',
    color: '#6d28d9',
    fontSize: 22,
    textAlign: 'left',
    width: 200,
  }
});
