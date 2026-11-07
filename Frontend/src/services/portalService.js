import api from "./api";

export const crearPerfil = (data) => api.post("/api/admin/perfiles", data).then((r) => r.data);
export const listarPerfiles = () => api.get("/api/admin/perfiles").then((r) => r.data);
export const cambiarPassword = (data) => api.put("/api/auth/change-password", data);
export const resumenEstudiante = () => api.get("/api/estudiante/mi-resumen").then((r) => r.data);
export const materiasProfesor = () => api.get("/api/profesor/materias").then((r) => r.data);
export const notasProfesor = () => api.get("/api/profesor/notas").then((r) => r.data);
export const estudiantesMateria = (materiaId) => api.get(`/api/profesor/materias/${materiaId}/estudiantes`).then((r) => r.data);
export const crearNota = (data) => api.post("/api/profesor/notas", data).then((r) => r.data);
export const notificacionesProfesor = () => api.get("/api/profesor/notificaciones").then((r) => r.data);
export const cursosNotificacionesProfesor = () => api.get("/api/profesor/notificaciones/cursos").then((r) => r.data);
export const crearNotificacion = (data) => api.post("/api/profesor/notificaciones", data).then((r) => r.data);
export const notificacionesEstudiante = () => api.get("/api/estudiante/notificaciones").then((r) => r.data);
export const listarMensajes = () => api.get("/api/chat").then((r) => r.data);
export const enviarMensaje = (mensaje) => api.post("/api/chat", { mensaje }).then((r) => r.data);
