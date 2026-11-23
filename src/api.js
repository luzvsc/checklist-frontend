import axios from "axios";
import { API_URL } from "./config";

const api = axios.create({ baseURL: API_URL, timeout: 10000 });

export const listar = () => api.get("/atividades").then((r) => r.data);
export const criar = (titulo) =>
  api.post("/atividades", { titulo }).then((r) => r.data);
export const atualizar = (id, dados) =>
  api.put(`/atividades/${id}`, dados).then((r) => r.data);
export const excluir = (id) => api.delete(`/atividades/${id}`);

export const mensagemErro = (err) =>
  err.response?.data?.erro || "Não foi possível conectar ao servidor";
