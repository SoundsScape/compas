import { DisplaySettings } from '@/components/sections/home/SettingsModal';
import * as THREE from 'three';
import { Article } from './article.interface';

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
}

export interface HomeMapProps {
    filters: {
        search: string;
        yearRange: [number, number];
        categories: string[];
        eventTypes: string[];
        regions: string[];
    };
}
