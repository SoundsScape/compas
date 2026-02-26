import * as THREE from 'three';
import { Article } from './article.interface';

import { RefObject } from 'react';
import { DisplaySettings, Settings } from './rightPanel.interface';

export interface GlobeControls {
    target: THREE.Vector3;
    object: THREE.Camera;
    getDistance: () => number;
    reset: () => void;
    minDistance: number;
    maxDistance: number;
}

export interface GlobeProps {
    filters: {
        search: string;
        yearRange: [number, number];
        categories: string[];
        eventTypes: string[];
        regions: string[];
    };
    isPaused: boolean;
    settings: {
        visual: {
            rotationSpeed: number;
            showEffects: boolean;
            clusterThreshold?: number;
        };
        display: DisplaySettings;
    };
    setIsModalOpen: (value: boolean) => void;
}

export interface ClusterGroup {
    center: [number, number, number];
    markers: {
        article: Article;
        position: [number, number, number];
    }[];
    isVisible?: boolean;
}

export interface MarkersLayerProps {
    clusterGroups: ClusterGroup[];
    onHover: (isHovered: boolean) => void;
    cameraDistance: number;
    setIsModalOpen: (value: boolean) => void;
}

export interface HomeMapProps {
    filters: {
        search: string;
        yearRange: [number, number];
        categories: string[];
        eventTypes: string[];
        regions: string[];
    };
    setIsModalOpen: (value: boolean) => void;
}

export interface LocationMarkerProps {
    position: [number, number, number];
    name: string;
    description: string;
    onHover: (isHovered: boolean) => void;
    category: string;
    region: string;
    year: number;
    tags?: { id: number; name: string; pivot: any }[];
    autor: string;
    apellidos: string;
    cameraDistance?: number;
    id: number;
    setIsModalOpen: (value: boolean) => void;
}

export interface MarkerInfo {
    article: Article;
    position: [number, number, number];
}

export interface MarkerClusterProps {
    position: [number, number, number];
    markers: MarkerInfo[];
    onHover: (isHovered: boolean) => void;
    cameraDistance?: number;
    setIsModalOpen: (value: boolean) => void;
}

export interface GlobeMainProps {
    selectedYearRange: [number, number];
    filters: {
        search: string;
        yearRange: [number, number];
        categories: string[];
        eventTypes: string[];
        regions: string[];
    };
    isPaused: boolean;
    setIsPaused: (paused: boolean) => void;
    setIsModalOpen: (value: boolean) => void;
    settings: Settings;
    orbitControlsRef: RefObject<{
        target: THREE.Vector3;
        object: THREE.Camera;
        getDistance: () => number;
        reset: () => void;
        minDistance: number;
        maxDistance: number;
    } | null>;
}

export interface GlobeControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
    isPaused: boolean;
    setIsPaused: (val: boolean) => void;
}
