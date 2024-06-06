import React, { createContext, useContext, useState, useEffect } from 'react';

const SelectedContext = createContext();

export const SelectedProvider = ({ children }) => {
  const [selectedList, setSelectedList] = useState(() => {
    const savedList = localStorage.getItem('selectedList');
    return savedList ? JSON.parse(savedList) : [];
  });

  useEffect(() => {
    localStorage.setItem('selectedList', JSON.stringify(selectedList));
  }, [selectedList]);

  const jobInList = (job) => {
    return selectedList.some(item => item.uid === job.uid);
  };

  const addObject = (obj) => {
    setSelectedList((prevList) => {
      if (jobInList(obj)) {
        return prevList.filter(item => item.uid !== obj.uid);
      }
      return [...prevList, obj];
    });
  };

  const resetList = () => {
    setSelectedList([]);
    localStorage.removeItem('selectedList');
  };


  return (
    <SelectedContext.Provider value={{ selectedList, addObject, resetList, jobInList }}>
      {children}
    </SelectedContext.Provider>
  );
};

export const useSelected = () => {
  return useContext(SelectedContext);
};
