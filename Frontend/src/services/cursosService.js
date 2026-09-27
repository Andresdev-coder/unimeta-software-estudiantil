import api from "./api";

export const listarCursos = () => api.get("/api/cursos").then((r) => r.data);
export const crearCurso = (data) =>
  api.post("/api/cursos", data).then((r) => r.data);
export const asociarMateria = (cursoId, materiaId) =>
  api.post(`/api/cursos/${cursoId}/materias/${materiaId}`).then((r) => r.data);
