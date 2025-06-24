import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_URL = 'http://10.81.205.31:5000/api/catalog'; 

export default function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  // GET
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data.catalog);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  };

  // CREATE
  const createProduct = async () => {
    if (!name || !description || !price) return;

    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      enabled: true,
      featured: false
    };

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      setName('');
      setDescription('');
      setPrice('');
      fetchProducts();
    } catch (err) {
      console.error('Erro ao criar produto:', err);
    }
  };

  // UPDATE
  const updateProduct = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          price: parseFloat(editPrice)
        })
      });

      setEditId(null);
      setEditName('');
      setEditDescription('');
      setEditPrice('');
      fetchProducts();
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
    }
  };

  // DELETE
  const deleteProduct = (id) => {
    Alert.alert("Confirmar exclusão", "Deseja realmente excluir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`${API_URL}/${id}`, {
              method: 'DELETE'
            });
            fetchProducts();
          } catch (err) {
            console.error('Erro ao excluir produto:', err);
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => {
    if (item.id !== editId) {
      return (
        <View style={styles.item}>
          <Text style={styles.itemTitle}>{item.name} - R$ {item.price.toFixed(2)}</Text>
          <Text style={styles.itemDesc}>{item.description}</Text>
          <Image
            source={{ uri: item.image}}
            style={styles.image}
          />

          <View style={styles.buttons}>
            <Button title="Editar" onPress={() => {
              setEditId(item.id);
              setEditName(item.name);
              setEditDescription(item.description);
              setEditPrice(String(item.price));
            }} />
            <Button title="Excluir" color="red" onPress={() => deleteProduct(item.id)} />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.item}>
          <TextInput
            style={styles.input}
            value={editName}
            onChangeText={setEditName}
            placeholder="Novo nome"
          />
          <TextInput
            style={styles.input}
            value={editDescription}
            onChangeText={setEditDescription}
            placeholder="Nova descrição"
          />
          <TextInput
            style={styles.input}
            value={editPrice}
            onChangeText={setEditPrice}
            keyboardType="decimal-pad"
            placeholder="Novo preço"
          />
          <Button title="Salvar" onPress={() => updateProduct(item.id)} />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catálogo de Produtos</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome"
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Descrição"
      />
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
        placeholder="Preço"
      />
      <Button title="Adicionar Produto" onPress={createProduct} />

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={styles.list}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#f3e8ff', // lilás claro
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    color: '#7c3aed', // roxo vibrante
    marginBottom: 24,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#ede9fe', // lilás bem claro
    borderColor: '#a78bfa', // lilás médio
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6d28d9', // roxo escuro
    marginBottom: 14,
  },
  list: {
    marginTop: 22,
  },
  item: {
    backgroundColor: '#c4b5fd', // lilás médio
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderColor: '#a78bfa', // lilás médio
    borderWidth: 2,
    shadowColor: '#7c3aed',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#6d28d9', // roxo escuro
    marginBottom: 6,
  },
  itemDesc: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#7c3aed',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#ede9fe',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
