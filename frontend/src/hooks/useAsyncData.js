import { useCallback, useEffect, useState } from 'react';
import { DATA_CHANGED_EVENT } from '@/utils/constants';

export function useAsyncData(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(loader)
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState((previous) => ({ data: previous.data, loading: false, error }));
      });
    return () => {
      active = false;
    };
  }, [revision, ...deps]);

  useEffect(() => {
    const handleChange = () => setRevision((value) => value + 1);
    window.addEventListener(DATA_CHANGED_EVENT, handleChange);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, handleChange);
  }, []);

  const reload = useCallback(() => setRevision((value) => value + 1), []);

  return { ...state, reload };
}
