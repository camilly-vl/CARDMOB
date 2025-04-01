import { useState } from "react";

const Contato = ({ contato, onDelete, onEdit }) => (
  <div className="card">
    <div>
      <p className="title">{contato.nome}  -  {contato.telefone}</p>
    </div>
    <div>
      <button onClick={() => onEdit(contato)} className="btn-edit">Editar</button>
      <button onClick={() => onDelete(contato.id)} className="btn-delete">Excluir</button>
    </div>
  </div>
);

export default Contato;
