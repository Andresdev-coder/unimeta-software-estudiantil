import api from "./api";

export const registrarIngreso = (data) =>
  api.post("/api/ingresos", data).then((r) => r.data);

export const historialPorEstudiante = (estudianteId, desde, hasta) => {
  const params = new URLSearchParams();
  if (desde) params.append("desde", desde);
  if (hasta) params.append("hasta", hasta);
  return api
    .get(`/api/ingresos/estudiante/${estudianteId}?${params.toString()}`)
    .then((r) => r.data);
};

export const actualizarEstadoIngreso = (id, estado) =>
  api.put(`/api/ingresos/${id}/estado`, { estado }).then((r) => r.data);
