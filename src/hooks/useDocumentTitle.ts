import { useEffect } from 'react';

const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | FDA Tracker`;

    // Cleanup - restore the previous title when component unmounts
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default useDocumentTitle;