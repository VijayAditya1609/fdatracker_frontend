import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import Overlay from 'ol/Overlay';
import 'ol/ol.css';

interface Facility {
  id: string;
  name: string;
  companyName: string;
  location: string;
  coordinates: [number, number];
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface FacilityMapProps {
  facilities: Facility[];
}

export default function FacilityMap({ facilities }: FacilityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create vector source and features
    const features = facilities.map(facility => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(facility.coordinates)),
        ...facility
      });
      return feature;
    });

    const vectorSource = new VectorSource({
      features
    });

    // Create vector layer with custom styles
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => {
        const riskLevel = feature.get('riskLevel');
        let color = '#4ade80'; // Low risk - green
        if (riskLevel === 'Medium') color = '#fbbf24'; // Medium risk - yellow
        if (riskLevel === 'High') color = '#ef4444'; // High risk - red

        return new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color }),
            stroke: new Stroke({
              color: '#ffffff',
              width: 2
            })
          })
        });
      }
    });

    // Create map
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([-95.7129, 37.0902]), // Center of US
        zoom: 4
      })
    });

    // Create popup overlay
    const popup = new Overlay({
      element: popupRef.current!,
      positioning: 'bottom-center',
      offset: [0, -10],
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    map.addOverlay(popup);

    // Add click handler for features
    map.on('click', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, feature => feature);
      
      if (feature) {
        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        const name = feature.get('name');
        const companyName = feature.get('companyName');
        const location = feature.get('location');

        popup.setPosition(coordinates);
        if (popupRef.current) {
          popupRef.current.innerHTML = `
            <div class="p-2 text-sm">
              <div class="font-semibold">${name}</div>
              <div class="text-gray-600">${companyName}</div>
              <div class="text-gray-600">${location}</div>
            </div>
          `;
        }
      } else {
        popup.setPosition(undefined);
      }
    });

    mapInstance.current = map;

    return () => {
      map.setTarget(undefined);
    };
  }, [facilities]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      <div ref={popupRef} className="absolute hidden bg-white rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2" />
    </div>
  );
}