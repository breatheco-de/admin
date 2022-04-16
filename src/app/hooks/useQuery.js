import { useLocation } from 'react-router-dom';

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}
export function useHash() {
  return new URLSearchParams(useLocation().hash);
}
