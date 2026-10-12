export type BinType = 'General' | 'Plastic' | 'Organic' | 'Paper' | 'Glass' | 'Hazardous';

export type BinStatus = 'normal' | 'nearly_full' | 'overflowing';

export interface SmartBin {
  id: string;
  name: string;
  type: BinType;
  fillLevel: number; // 0 - 100
  capacityLiters: number;
  battery: number; // 0 - 100%
  temperature: number; // Celsius
  location: {
    lat: number;
    lng: number;
    address: string;
    zone: string;
  };
  lastCollected: string;
  status: BinStatus;
  historicalFill: { timestamp: string; fill: number }[];
  isSimulated?: boolean;
}

export type ComplaintStatus = 'Pending' | 'Dispatched' | 'In Progress' | 'Resolved';
export type ComplaintSeverity = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface CitizenComplaint {
  id: string;
  title: string;
  description: string;
  category: 'Overflowing Bin' | 'Illegal Dumping' | 'Damaged Bin' | 'Hazardous Waste' | 'Biohazard';
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
    zone: string;
  };
  imageUrl: string;
  citizenName: string;
  citizenEmail: string;
  createdAt: string;
  resolvedAt?: string;
  upvotes: number;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  resolutionNotes?: string;
  aiVerified?: boolean;
  aiSummary?: {
    detectedItem: string;
    confidence: number;
    severityRecommendation: ComplaintSeverity;
  };
}

export interface RouteWaypoint {
  order: number;
  targetId: string;
  type: 'bin' | 'complaint' | 'depot';
  name: string;
  address: string;
  lat: number;
  lng: number;
  fillLevel?: number;
  urgency: 'Normal' | 'High' | 'Critical';
  collected: boolean;
  collectedAt?: string;
  wasteCollectedKg?: number;
}

export interface CollectionRoute {
  id: string;
  name: string;
  workerId: string;
  workerName: string;
  truckId: string;
  date: string;
  status: 'Planned' | 'Active' | 'Completed';
  waypoints: RouteWaypoint[];
  estimatedDistanceKm: number;
  estimatedTimeMinutes: number;
  estimatedFuelSavedPercent: number;
  totalWasteCollectedKg: number;
}

export interface CollectionWorker {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  zone: string;
  status: 'On Duty' | 'In Transit' | 'Off Duty';
  currentLocation: {
    lat: number;
    lng: number;
  };
  assignedRouteId?: string;
  completedTasksToday: number;
}

export type UserRole = 'citizen' | 'admin' | 'worker';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  ecoPoints: number;
  avatar: string;
  workerDetails?: {
    workerId: string;
    vehicleNumber: string;
  };
}

export interface EcoRewardItem {
  id: string;
  title: string;
  pointsCost: number;
  category: 'Transit' | 'Utility' | 'Community' | 'Goods';
  description: string;
  icon: string;
  voucherCode?: string;
}

export interface WasteClassificationData {
  item_name: string;
  category: 'Plastic' | 'Paper' | 'Metal' | 'Glass' | 'Organic' | 'E-Waste' | 'Hazardous' | 'Other';
  confidence_score: number;
  recyclable: boolean;
  recommended_bin: string;
  disposal_steps: string[];
  contamination_risks: string[];
  environmental_impact: string;
  eco_points: number;
  severity_level: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  targetId?: string;
  read: boolean;
}
