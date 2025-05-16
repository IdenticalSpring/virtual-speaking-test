import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const register = data =>
  API.post('/auth/register', data).then(res => res.data);

export const login = data =>
  API.post('/auth/login', data).then(res => res.data);

export const logout = () => {
  localStorage.removeItem('user');
};
