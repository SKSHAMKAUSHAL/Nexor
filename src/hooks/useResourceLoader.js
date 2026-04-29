import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to preload resources (images and videos) and track their loading status
 * Returns the loading state and methods to report when resources are ready
 */
export const useResourceLoader = () => {
  const loadedResources = useRef(new Set());
  const resourcesNeeded = useRef(new Set());

  const registerResource = useCallback((id) => {
    resourcesNeeded.current.add(id);
  }, []);

  const markResourceReady = useCallback((id) => {
    loadedResources.current.add(id);
  }, []);

  const areAllResourcesReady = useCallback(() => {
    if (resourcesNeeded.current.size === 0) return false;
    return loadedResources.current.size === resourcesNeeded.current.size;
  }, []);

  const preloadImage = useCallback((src, id) => {
    return new Promise((resolve, reject) => {
      registerResource(id);
      const img = new Image();
      img.onload = () => {
        markResourceReady(id);
        resolve();
      };
      img.onerror = () => {
        markResourceReady(id); // Mark as ready even on error to prevent infinite loading
        reject(`Failed to load image: ${src}`);
      };
      img.src = src;
    });
  }, [registerResource, markResourceReady]);

  const preloadVideo = useCallback((src, id) => {
    return new Promise((resolve) => {
      registerResource(id);
      const video = document.createElement('video');
      video.oncanplaythrough = () => {
        markResourceReady(id);
        resolve();
      };
      video.onerror = () => {
        markResourceReady(id); // Mark as ready even on error
        resolve();
      };
      video.src = src;
      video.load();
    });
  }, [registerResource, markResourceReady]);

  return {
    preloadImage,
    preloadVideo,
    markResourceReady,
    registerResource,
    areAllResourcesReady,
  };
};

export default useResourceLoader;
