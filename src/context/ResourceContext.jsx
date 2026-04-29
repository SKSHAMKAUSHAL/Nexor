import React, { createContext, useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export const ResourceContext = createContext();

export const ResourceProvider = ({ children }) => {
  const [allResourcesReady, setAllResourcesReady] = useState(false);
  const loadedResources = useRef(new Set());
  const resourcesNeeded = useRef(new Set());
  const checkInterval = useRef(null);

  const registerResource = useCallback((id) => {
    resourcesNeeded.current.add(id);
  }, []);

  const markResourceReady = useCallback((id) => {
    loadedResources.current.add(id);
  }, []);

  const checkAndUpdateStatus = useCallback(() => {
    if (resourcesNeeded.current.size > 0) {
      const isReady = loadedResources.current.size === resourcesNeeded.current.size;
      setAllResourcesReady(isReady);
    }
  }, []);

  // Periodically check resource status
  useEffect(() => {
    checkInterval.current = setInterval(checkAndUpdateStatus, 100);
    return () => {
      if (checkInterval.current) clearInterval(checkInterval.current);
    };
  }, [checkAndUpdateStatus]);

  const preloadImage = useCallback((src, id) => {
    return new Promise((resolve) => {
      registerResource(id);
      const img = new Image();
      img.onload = () => {
        markResourceReady(id);
        checkAndUpdateStatus();
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        markResourceReady(id);
        checkAndUpdateStatus();
        resolve();
      };
      img.src = src;
    });
  }, [registerResource, markResourceReady, checkAndUpdateStatus]);

  const preloadVideo = useCallback((src, id) => {
    return new Promise((resolve) => {
      registerResource(id);
      const video = document.createElement('video');
      video.oncanplaythrough = () => {
        markResourceReady(id);
        checkAndUpdateStatus();
        resolve();
      };
      video.onerror = () => {
        console.warn(`Failed to load video: ${src}`);
        markResourceReady(id);
        checkAndUpdateStatus();
        resolve();
      };
      video.src = src;
      video.load();
    });
  }, [registerResource, markResourceReady, checkAndUpdateStatus]);

  const value = {
    allResourcesReady,
    preloadImage,
    preloadVideo,
    registerResource,
    markResourceReady,
  };

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
};

ResourceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ResourceContext;
