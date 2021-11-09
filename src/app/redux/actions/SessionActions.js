export function getSession() {
  const session = JSON.parse(localStorage.getItem('bc-session'));

  if (process.env.NODE_ENV !== 'production') console.log('Session info', session);
  if (!session || !session.academy) {
    window.location.href = '/login';
    return {
      academy: null,
      token: null,
    };
  }
  return session;
}

export function getToken() {
  const token = localStorage.getItem('accessToken');
  return token;
}
