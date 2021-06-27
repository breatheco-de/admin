function getSession() {
  const session = JSON.parse(localStorage.getItem('bc-session'));
  // eslint-disable-next-line no-console
  console.log('Session info', session);
  if (!session || !session.academy) {
    window.location.href = '/login';
    return { academy: null, token: null };
  }
  return session;
}
export default getSession;
