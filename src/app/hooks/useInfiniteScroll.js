import { useEffect, useState } from 'react'

export default function useInfiniteScroll(pageNumber, items, setItems, search) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [querys, setQuerys] = useState({
    limit: 10,
    offset: 0,
  });
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)

    search(querys).then(({ data }) => {
      setItems([...items, ...data.results])
      if (data.results.length > 0){
        setQuerys(prevQuery => {
          return { limit: 10, offset: prevQuery.offset + data.results.length }
        });
      }

      setHasMore(data.next !== null);
      setLoading(false)
    }).catch(e => {
      console.log(e);
      setError(true)
    })

  }, [pageNumber])

  return { loading, error, hasMore }
}