import api from "./api";

export const listarEstudiantes = () =>
  api.get("/api/estudiantes").then((r) => r.data);

export const buscarEstudiantes = (texto) =>
  api
    .get(`/api/estudiantes/buscar?texto=${encodeURIComponent(texto)}`)
    .then((r) => r.data);

export const crearEstudiante = (data) =>
  api.post("/api/estudiantes", data).then((r) => r.data);

export const actualizarEstudiante = (id, data) =>
  api.put(`/api/estudiantes/${id}`, data).then((r) => r.data);

export const eliminarEstudiante = (id) => api.delete(`/api/estudiantes/${id}`);

export const subirFotoEstudiante = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api
    .post(`/api/estudiantes/${id}/foto`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};
