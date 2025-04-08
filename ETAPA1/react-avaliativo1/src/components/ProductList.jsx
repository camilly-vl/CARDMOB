import React, { useState } from "react";
import ProductCard from "./ProductCard.jsx";

const ProductList = () => {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [editando, setEditando] = useState(null);

  const adicionarProduto = () => {
    if (!nome || !preco) return;
    if (editando) {
      setProdutos(
        produtos.map((p) => (p.id === editando.id ? { id: p.id, nome, preco } : p))
      );
      setEditando(null);
    } else {
      setProdutos([...produtos, { id: Date.now(), nome, preco }]);
    }
    setNome("");
    setPreco("");
  };

  const editarProduto = (produto) => {
    setNome(produto.nome);
    setPreco(produto.preco);
    setEditando(produto);
  };

  const excluirProduto = (id) => {
    setProdutos(produtos.filter((p) => p.id !== id));
  };

  return (
    <div>
      <h2>Lista de Produtos</h2>
      <div>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />
        <button
          onClick={adicionarProduto}
        >
          {editando ? "Salvar" : "Adicionar"}
        </button>
      </div>
      <div>
        {produtos.map((produto) => (
          <ProductCard
            key={produto.id}
            produto={produto}
            onDelete={excluirProduto}
            onEdit={editarProduto}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;