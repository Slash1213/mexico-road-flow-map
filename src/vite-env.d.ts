
/// <reference types="vite/client" />
/// <reference types="@types/google.maps" />
/// <reference types="leaflet" />

// Extend Google Maps namespace to include Routes API types if needed
declare namespace google.maps {
  // Routes API types (simplified for now)
  namespace routes {
    interface RoutesService {
      route(request: RouteRequest, callback: (response: RouteResponse, status: RoutesStatus) => void): void;
    }
    
    interface RouteRequest {
      origin: LatLng | string;
      destination: LatLng | string;
      travelMode?: TravelMode;
      optimizeWaypoints?: boolean;
    }
    
    interface RouteResponse {
      routes: Route[];
    }
    
    enum RoutesStatus {
      OK = "OK",
      ZERO_RESULTS = "ZERO_RESULTS",
      INVALID_REQUEST = "INVALID_REQUEST",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      UNKNOWN_ERROR = "UNKNOWN_ERROR"
    }
  }
  
  // Roads API types (simplified)
  namespace roads {
    interface RoadsService {
      snapToRoads(request: SnapToRoadsRequest, callback: (response: SnapToRoadsResponse) => void): void;
    }
    
    interface SnapToRoadsRequest {
      path: LatLng[] | string;
      interpolate?: boolean;
    }
    
    interface SnapToRoadsResponse {
      snappedPoints: SnappedPoint[];
    }
    
    interface SnappedPoint {
      location: LatLng;
      originalIndex?: number;
      placeId?: string;
    }
  }
}

declare module 'leaflet-routing-machine' {
  export = L;
}
