export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuarioNome');
  window.location.href = '/login'; // redireciona imediatamente
};
