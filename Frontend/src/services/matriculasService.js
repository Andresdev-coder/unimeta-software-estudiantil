import api from "./api";

export const listarMatriculas = () =>
  api.get("/api/matriculas").then((r) => r.data);
export const crearMatricula = (data) =>
  api.post("/api/matriculas", data).then((r) => r.data);
