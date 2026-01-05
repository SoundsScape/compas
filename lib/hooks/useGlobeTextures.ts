import { useState, useMemo } from 'react';
import * as THREE from 'three';

export function useGlobeTextures() {
    const [texturesLoaded, setTexturesLoaded] = useState(false);

    const textures = useMemo(() => {
        const loader = new THREE.TextureLoader();
        loader.manager.onLoad = () => setTexturesLoaded(true);

        return {
            earth: loader.load('/assets/images/earth/10k-earthmap.avif'),
            clouds: loader.load(
                '/assets/images/clouds/4k-earth_blue_marble_cloud_map__.webp'
            ),
        };
    }, []);

    return {
        earthTexture: textures.earth,
        cloudsTexture: textures.clouds,
        texturesLoaded,
    };
}
