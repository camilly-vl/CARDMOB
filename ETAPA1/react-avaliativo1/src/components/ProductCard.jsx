import { useState } from "react";

const ProductCard = ({ produto, onDelete, onEdit }) => (
  <div className="card">
    <div>
      <p className="title">{produto.nome}  -  {produto.preco}</p>
    </div>
    <div>
      <button onClick={() => onEdit(produto)} className="btn-edit">Editar</button>
      <button onClick={() => onDelete(produto.id)} className="btn-delete">Excluir</button>
      <button>Adicionar ao carrinho</button>
    </div>
  </div>
);

export default ProductCard;
