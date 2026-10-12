import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { SmartBin, CitizenComplaint, CollectionWorker, CollectionRoute } from '../../types';
import { MUNICIPAL_DEPOT } from '../../data/mockData';
import { Layers, MapPin, Truck, AlertTriangle, RefreshCw, CheckCircle2, Trash2 } from 'lucide-react';

interface LiveWasteMapProps {
  bins: SmartBin[];
  complaints: CitizenComplaint[];
  workers: CollectionWorker[];
  activeRoute?: CollectionRoute;
  onSelectBin?: (bin: SmartBin) => void;
  onSelectComplaint?: (complaint: CitizenComplaint) => void;
  onEmptyBin?: (binId: string) => void;
  highlightTargetId?: string;
}

export const LiveWasteMap: React.FC<LiveWasteMapProps> = ({
  bins,
  complaints,
  workers,
  activeRoute,
  onSelectBin,
  onSelectComplaint,
  onEmptyBin,
  highlightTargetId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Filter toggles
  const [showBins, setShowBins] = useState(true);
  const [showComplaints, setShowComplaints] = useState(true);
  const [showWorkers, setShowWorkers] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
  const [mapLayer, setMapLayer] = useState<'carto' | 'osm'>('carto');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on city depot
    const map = L.map(mapContainerRef.current, {
      center: [MUNICIPAL_DEPOT.lat, MUNICIPAL_DEPOT.lng],
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark styled tile layer by default for sleek modern civic tech aesthetic
    const tileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        subdomains: 'abcd',
      }
    ).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update base tiles if changed
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl =
      mapLayer === 'carto'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, { maxZoom: 19, subdomains: 'abcd' }).addTo(map);
  }, [mapLayer]);

  // Update Markers and Polyline whenever data or filter toggles change
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // 1. Municipal Depot Marker
    const depotIcon = L.divIcon({
      className: 'custom-depot-marker',
      html: `
        <div style="background:#0f172a; border: 2px solid #10b981; border-radius: 9999px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
          <span style="font-size: 16px;">🏢</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const depotMarker = L.marker([MUNICIPAL_DEPOT.lat, MUNICIPAL_DEPOT.lng], { icon: depotIcon });
    depotMarker.bindPopup(`
      <div style="padding: 4px;">
        <h4 style="font-weight: 700; color: #10b981; margin: 0 0 4px 0; font-size: 14px;">${MUNICIPAL_DEPOT.name}</h4>
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">${MUNICIPAL_DEPOT.address}</p>
        <span style="display: inline-block; margin-top: 6px; font-size: 11px; background: #064e3b; color: #6ee7b7; padding: 2px 8px; border-radius: 4px;">Municipal Hub & Fleet Depot</span>
      </div>
    `);
    layerGroup.addLayer(depotMarker);

    // 2. Smart Bins Markers
    if (showBins) {
      bins.forEach((bin) => {
        const isCritical = bin.fillLevel > 80;
        const isNearlyFull = bin.fillLevel >= 50 && bin.fillLevel <= 80;
        const isHighlighted = highlightTargetId === bin.id;

        const colorBg = isCritical ? '#ef4444' : isNearlyFull ? '#eab308' : '#10b981';
        const ringClass = isCritical ? 'pulsing-alert-marker' : '';

        const binHtml = `
          <div class="${ringClass}" style="
            background: ${colorBg};
            color: #ffffff;
            width: ${isHighlighted ? '38px' : '30px'};
            height: ${isHighlighted ? '38px' : '30px'};
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 11px;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${bin.fillLevel}%
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-bin-marker',
          html: binHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([bin.location.lat, bin.location.lng], { icon });

        // Popup content with action triggers
        const popupContent = `
          <div style="min-width: 200px; padding: 2px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 11px; font-weight: 700; color: #94a3b8;">${bin.id}</span>
              <span style="font-size: 11px; font-weight: 700; color: ${colorBg}; text-transform: uppercase;">
                ${isCritical ? '⚠️ Overflowing' : isNearlyFull ? '🟡 Nearly Full' : '🟢 Normal'}
              </span>
            </div>
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #f8fafc;">${bin.name}</h4>
            <p style="margin: 0 0 6px 0; font-size: 12px; color: #cbd5e1;">${bin.location.address}</p>
            
            <div style="background: rgba(30, 41, 59, 0.7); padding: 8px; border-radius: 6px; margin-bottom: 8px; font-size: 11px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #94a3b8;">Stream:</span>
                <span style="font-weight: 600; color: #f8fafc;">${bin.type}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #94a3b8;">Fill Level:</span>
                <span style="font-weight: 700; color: ${colorBg};">${bin.fillLevel}% (${bin.capacityLiters}L)</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8;">Temp / Battery:</span>
                <span style="font-weight: 600; color: #f8fafc;">${bin.temperature}°C · ${bin.battery}%</span>
              </div>
            </div>

            <div style="display: flex; gap: 6px;">
              <button id="btn-empty-${bin.id}" style="
                flex: 1;
                background: #059669;
                color: #ffffff;
                border: none;
                border-radius: 6px;
                padding: 6px 8px;
                font-size: 11px;
                font-weight: 600;
                cursor: pointer;
              ">Empty Now</button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-empty-${bin.id}`);
          if (btn && onEmptyBin) {
            btn.onclick = () => {
              onEmptyBin(bin.id);
              marker.closePopup();
            };
          }
        });

        marker.on('click', () => {
          if (onSelectBin) onSelectBin(bin);
        });

        layerGroup.addLayer(marker);
      });
    }

    // 3. Citizen Complaints Markers
    if (showComplaints) {
      complaints.forEach((comp) => {
        if (comp.status === 'Resolved') return;

        const isUrgent = comp.severity === 'Urgent';
        const color = isUrgent ? '#dc2626' : '#d97706';

        const compHtml = `
          <div style="
            background: #1e1b4b;
            color: ${color};
            border: 2px solid ${color};
            border-radius: 8px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            cursor: pointer;
            font-size: 16px;
          ">
            🚨
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-complaint-marker',
          html: compHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([comp.location.lat, comp.location.lng], { icon });

        marker.bindPopup(`
          <div style="min-width: 220px; padding: 2px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 700; color: #94a3b8;">${comp.id}</span>
              <span style="font-size: 10px; font-weight: 700; color: ${color}; text-transform: uppercase;">
                ${comp.severity} Severity
              </span>
            </div>
            <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #f8fafc;">${comp.title}</h4>
            <p style="margin: 0 0 6px 0; font-size: 11px; color: #cbd5e1;">${comp.location.address}</p>
            ${
              comp.imageUrl
                ? `<img src="${comp.imageUrl}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;" alt="Issue evidence" />`
                : ''
            }
            <div style="font-size: 11px; color: #94a3b8;">
              Status: <strong style="color: #38bdf8;">${comp.status}</strong> · Upvotes: <strong>${comp.upvotes}</strong>
            </div>
          </div>
        `);

        marker.on('click', () => {
          if (onSelectComplaint) onSelectComplaint(comp);
        });

        layerGroup.addLayer(marker);
      });
    }

    // 4. Collection Workers / Trucks
    if (showWorkers) {
      workers.forEach((worker) => {
        const truckHtml = `
          <div style="
            background: #2563eb;
            color: #ffffff;
            border: 2px solid #60a5fa;
            border-radius: 9999px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(37,99,235,0.4);
            font-size: 14px;
          ">
            🚚
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-worker-marker',
          html: truckHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([worker.currentLocation.lat, worker.currentLocation.lng], { icon });

        marker.bindPopup(`
          <div style="padding: 2px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 10px; color: #94a3b8;">${worker.id}</span>
              <span style="font-size: 10px; color: #38bdf8; font-weight: 600;">${worker.status}</span>
            </div>
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #f8fafc;">${worker.name}</h4>
            <p style="margin: 0 0 4px 0; font-size: 11px; color: #94a3b8;">${worker.vehicleNumber}</p>
            <p style="margin: 0; font-size: 11px; color: #cbd5e1;">Assigned: ${worker.zone}</p>
          </div>
        `);

        layerGroup.addLayer(marker);
      });
    }

    // 5. Active Collection Route Line Overlay
    if (showRoute && activeRoute && activeRoute.waypoints.length > 1) {
      const latLngs: [number, number][] = activeRoute.waypoints.map((wp) => [wp.lat, wp.lng]);

      if (routePolylineRef.current) {
        layerGroup.removeLayer(routePolylineRef.current);
      }

      const polyline = L.polyline(latLngs, {
        color: '#10b981',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
      });

      polyline.bindTooltip(
        `<strong>${activeRoute.name}</strong><br/>${activeRoute.estimatedDistanceKm} km · ${activeRoute.estimatedTimeMinutes} mins`,
        { sticky: true }
      );

      layerGroup.addLayer(polyline);
      routePolylineRef.current = polyline;
    }
  }, [bins, complaints, workers, activeRoute, showBins, showComplaints, showWorkers, showRoute, highlightTargetId]);

  // Center on highlight item if changed
  useEffect(() => {
    if (!highlightTargetId || !mapInstanceRef.current) return;
    const targetBin = bins.find((b) => b.id === highlightTargetId);
    if (targetBin) {
      mapInstanceRef.current.flyTo([targetBin.location.lat, targetBin.location.lng], 16, { duration: 1.2 });
    }
  }, [highlightTargetId, bins]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([MUNICIPAL_DEPOT.lat, MUNICIPAL_DEPOT.lng], 13, { duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Control Overlay Bar */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-800 text-xs shadow-lg">
        <button
          onClick={() => setShowBins(!showBins)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
            showBins ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Bins ({bins.length})</span>
        </button>

        <button
          onClick={() => setShowComplaints(!showComplaints)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
            showComplaints ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Complaints ({complaints.filter((c) => c.status !== 'Resolved').length})</span>
        </button>

        <button
          onClick={() => setShowWorkers(!showWorkers)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
            showWorkers ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Trucks ({workers.length})</span>
        </button>

        {activeRoute && (
          <button
            onClick={() => setShowRoute(!showRoute)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
              showRoute ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Route</span>
          </button>
        )}

        <button
          onClick={() => setMapLayer(mapLayer === 'carto' ? 'osm' : 'carto')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium text-slate-400 hover:text-slate-200 transition-colors"
          title="Toggle Tile Style"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{mapLayer === 'carto' ? 'Voyager' : 'OSM'}</span>
        </button>

        <button
          onClick={resetView}
          className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md transition-colors"
          title="Center on City"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 right-3 z-[1000] p-2.5 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-800 text-xs shadow-lg space-y-1.5">
        <div className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1">Live Map Legend</div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          <span>Normal Bin (&lt;50%)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
          <span>Nearly Full (50-80%)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
          <span className="text-red-400 font-medium">Overflowing (&gt;80%)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-sm">🚨</span>
          <span>Citizen Waste Hotspot</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-sm">🚚</span>
          <span>Active Collection Truck</span>
        </div>
      </div>
    </div>
  );
};
