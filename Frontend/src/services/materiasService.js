import api from "./api";

export const listarMaterias = () =>
  api.get("/api/materias").then((r) => r.data);
export const crearMateria = (data) =>
  api.post("/api/materias", data).then((r) => r.data);
