import { ReactNode } from 'react';
import { LatLngExpression, DivIcon, PolylineOptions, Map as LeafletMap, Marker as LeafletMarker, TileLayer as LeafletTileLayer, Polyline as LeafletPolyline } from 'leaflet';

declare module 'react-leaflet' {
  export interface MapContainerProps {
    center: LatLngExpression;
    zoom: number;
    children?: ReactNode;
    style?: React.CSSProperties;
    className?: string;
    scrollWheelZoom?: boolean;
    whenCreated?: (map: LeafletMap) => void;
    whenReady?: () => void;
  }

  export interface TileLayerProps {
    attribution: string;
    url: string;
  }

  export interface MarkerProps {
    position: LatLngExpression;
    icon?: DivIcon | L.Icon;
  }

  export interface PolylineProps {
    positions: LatLngExpression[];
    pathOptions?: PolylineOptions;
  }

  export interface PopupProps {
    children: ReactNode;
  }

  export function MapContainer(props: MapContainerProps & React.RefAttributes<LeafletMap>): JSX.Element;
  export function TileLayer(props: TileLayerProps & React.RefAttributes<LeafletTileLayer>): JSX.Element;
  export function Marker(props: MarkerProps & { children?: ReactNode } & React.RefAttributes<LeafletMarker<any>>): JSX.Element;
  export function Popup(props: PopupProps): JSX.Element;
  export function Polyline(props: PolylineProps & React.RefAttributes<LeafletPolyline<any, any>>): JSX.Element;
  export function useMap(): LeafletMap;
}
