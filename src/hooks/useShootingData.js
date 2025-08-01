import { useState, useEffect, useCallback } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
};

export const useShootingData = (userId) => {
  const [sessions, setSessions] = useLocalStorage(`shottracker-sessions-${userId}`, []);
  const [targets, setTargets] = useLocalStorage(`shottracker-targets-${userId}`, []);
  const [ammoInventory, setAmmoInventory] = useLocalStorage(`shottracker-ammo-${userId}`, []);

  const addSession = (session) => {
    const newSession = { ...session, id: Date.now(), createdAt: new Date().toISOString() };
    setSessions(prev => [...prev, newSession]);
  };

  const addTarget = (target) => {
    const newTarget = { ...target, id: Date.now(), createdAt: new Date().toISOString() };
    setTargets(prev => [...prev, newTarget]);
  };

  const updateAmmoInventory = (ammoData) => {
    setAmmoInventory(prev => {
      const existingAmmoIndex = prev.findIndex(
        item => item.type === ammoData.type && item.caliber === ammoData.caliber
      );

      if (existingAmmoIndex > -1) {
        const updatedInventory = [...prev];
        updatedInventory[existingAmmoIndex].count += ammoData.count;
        if(ammoData.brand) updatedInventory[existingAmmoIndex].brand = ammoData.brand;
        if(ammoData.notes) updatedInventory[existingAmmoIndex].notes = ammoData.notes;
        return updatedInventory;
      } else {
        return [...prev, { ...ammoData, id: Date.now() }];
      }
    });
  };

  const handleUseAmmo = useCallback((type, caliber, amount) => {
    setAmmoInventory(prev => {
      const updatedInventory = prev.map(item => {
        if (item.type === type && item.caliber === caliber) {
          return { ...item, count: Math.max(0, item.count - amount) };
        }
        return item;
      });
      return updatedInventory;
    });
  }, [setAmmoInventory]);

  return { 
    sessions, 
    targets, 
    ammoInventory, 
    addSession, 
    addTarget, 
    updateAmmoInventory,
    handleUseAmmo
  };
};