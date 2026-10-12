import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SmartBin,
  CitizenComplaint,
  CollectionWorker,
  CollectionRoute,
  UserProfile,
  UserRole,
  SystemAlert,
  RouteWaypoint,
} from '../types';
import {
  INITIAL_BINS,
  INITIAL_COMPLAINTS,
  INITIAL_WORKERS,
  INITIAL_ROUTES,
  MUNICIPAL_DEPOT,
} from '../data/mockData';

interface ClaimedReward {
  rewardId: string;
  claimedAt: string;
  code: string;
}

interface WasteContextType {
  // Current user & role
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Bins
  bins: SmartBin[];
  emptyBin: (binId: string) => void;
  updateBinFill: (binId: string, fillLevel: number) => void;
  addNewBin: (newBin: Omit<SmartBin, 'id' | 'historicalFill' | 'status'>) => void;
  triggerSimulatedSpike: () => void;
  isSimulating: boolean;
  setIsSimulating: React.Dispatch<React.SetStateAction<boolean>>;

  // Complaints
  complaints: CitizenComplaint[];
  addComplaint: (newComplaint: Omit<CitizenComplaint, 'id' | 'createdAt' | 'upvotes' | 'status'>) => Promise<CitizenComplaint>;
  upvoteComplaint: (complaintId: string) => void;
  updateComplaintStatus: (
    complaintId: string,
    status: CitizenComplaint['status'],
    assignedWorkerId?: string,
    resolutionNotes?: string
  ) => void;

  // Workers
  workers: CollectionWorker[];
  updateWorkerStatus: (workerId: string, status: CollectionWorker['status']) => void;

  // Routes
  routes: CollectionRoute[];
  generateOptimizedRoute: (workerId: string) => CollectionRoute;
  markWaypointCollected: (routeId: string, waypointOrder: number, wasteKg?: number) => void;
  completeRoute: (routeId: string) => void;

  // Alerts
  alerts: SystemAlert[];
  markAlertRead: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  clearAllAlerts: () => void;

  // Eco Rewards
  awardEcoPoints: (points: number, reason: string) => void;
  claimedRewards: ClaimedReward[];
  redeemReward: (rewardId: string, pointsCost: number, voucherCode: string) => boolean;

  // Metrics
  metrics: {
    totalBins: number;
    overflowingBins: number;
    nearlyFullBins: number;
    normalBins: number;
    avgFillLevel: number;
    totalComplaints: number;
    pendingComplaints: number;
    resolvedComplaints: number;
    totalWasteCollectedKg: number;
    totalCO2SavedKg: number;
    efficiencyRating: number;
  };
}

const WasteContext = createContext<WasteContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  BINS: 'ecopulse_bins_v1',
  COMPLAINTS: 'ecopulse_complaints_v1',
  WORKERS: 'ecopulse_workers_v1',
  ROUTES: 'ecopulse_routes_v1',
  USER: 'ecopulse_user_v1',
  ALERTS: 'ecopulse_alerts_v1',
  REWARDS: 'ecopulse_rewards_v1',
};

export const WasteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current logged in profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      id: 'USR-CITIZEN-01',
      name: 'Elena Rostova',
      email: 'elena.rostova@ecopulse.org',
      role: 'admin', // default to admin to showcase municipal command center immediately
      ecoPoints: 340,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };
  });

  // State
  const [bins, setBins] = useState<SmartBin[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BINS);
    return saved ? JSON.parse(saved) : INITIAL_BINS;
  });

  const [complaints, setComplaints] = useState<CitizenComplaint[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPLAINTS);
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [workers, setWorkers] = useState<CollectionWorker[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WORKERS);
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [routes, setRoutes] = useState<CollectionRoute[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ROUTES);
    return saved ? JSON.parse(saved) : INITIAL_ROUTES;
  });

  const [claimedRewards, setClaimedRewards] = useState<ClaimedReward[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REWARDS);
    return saved ? JSON.parse(saved) : [];
  });

  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  const [alerts, setAlerts] = useState<SystemAlert[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ALERTS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ALT-01',
        title: 'Critical Overflow Alert',
        message: 'Bin BIN-101 (Market St & 4th Ave) has reached 94% fill capacity.',
        severity: 'critical',
        timestamp: '10 mins ago',
        targetId: 'BIN-101',
        read: false,
      },
      {
        id: 'ALT-02',
        title: 'Urgent Citizen Hazard Report',
        message: 'Lead-acid accumulator and chemical spillage reported at 2600 Bryant St.',
        severity: 'critical',
        timestamp: '25 mins ago',
        targetId: 'CMP-2026-104',
        read: false,
      },
      {
        id: 'ALT-03',
        title: 'Route Clearance Notice',
        message: 'Route North Alpha active: 1 of 5 targets cleared by Truck #12.',
        severity: 'info',
        timestamp: '1 hour ago',
        read: true,
      },
    ];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.BINS, JSON.stringify(bins));
  }, [bins]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.WORKERS, JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REWARDS, JSON.stringify(claimedRewards));
  }, [claimedRewards]);

  // Periodic IoT telemetry simulation: slight fill changes
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setBins((prev) =>
        prev.map((bin) => {
          // Occasionally add 1-2% fill, rarely 0
          const increment = Math.random() > 0.4 ? Math.floor(Math.random() * 2) + 1 : 0;
          const newFill = Math.min(100, bin.fillLevel + increment);
          const newStatus: SmartBin['status'] =
            newFill > 80 ? 'overflowing' : newFill >= 50 ? 'nearly_full' : 'normal';

          // Battery drain or temperature fluctuations
          const tempDelta = (Math.random() - 0.5) * 0.2;
          const newTemp = Math.round((bin.temperature + tempDelta) * 10) / 10;

          return {
            ...bin,
            fillLevel: newFill,
            status: newStatus,
            temperature: newTemp,
          };
        })
      );
    }, 12000); // every 12 seconds

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Role switching
  const switchRole = (role: UserRole) => {
    if (role === 'citizen') {
      setCurrentUser((prev) => ({
        ...prev,
        role: 'citizen',
        name: 'Maya Lin',
        email: 'maya.lin@cleanurban.org',
      }));
    } else if (role === 'worker') {
      setCurrentUser((prev) => ({
        ...prev,
        role: 'worker',
        name: 'David Chen',
        email: 'david.chen@ecopulse.gov',
        workerDetails: {
          workerId: 'WRK-01',
          vehicleNumber: 'Truck #12 (Heavy Compactor)',
        },
      }));
    } else {
      setCurrentUser((prev) => ({
        ...prev,
        role: 'admin',
        name: 'Director Marcus Vance',
        email: 'admin.director@ecopulse.gov',
      }));
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  // Bin actions
  const emptyBin = (binId: string) => {
    setBins((prev) =>
      prev.map((b) => {
        if (b.id === binId) {
          const nowStr = 'Just now';
          const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...b,
            fillLevel: 0,
            status: 'normal',
            lastCollected: nowStr,
            historicalFill: [...b.historicalFill.slice(-5), { timestamp: nowTime, fill: 0 }],
          };
        }
        return b;
      })
    );

    // Dismiss any critical alerts for this bin
    setAlerts((prev) =>
      prev.map((a) => (a.targetId === binId ? { ...a, read: true } : a))
    );
  };

  const updateBinFill = (binId: string, fillLevel: number) => {
    const clamped = Math.max(0, Math.min(100, fillLevel));
    const status: SmartBin['status'] =
      clamped > 80 ? 'overflowing' : clamped >= 50 ? 'nearly_full' : 'normal';

    setBins((prev) =>
      prev.map((b) => (b.id === binId ? { ...b, fillLevel: clamped, status } : b))
    );

    if (clamped > 85) {
      const newAlert: SystemAlert = {
        id: `ALT-${Date.now()}`,
        title: `Bin ${binId} Fill Warning`,
        message: `Fill level reached ${clamped}%. Collection dispatch recommended.`,
        severity: 'critical',
        timestamp: 'Just now',
        targetId: binId,
        read: false,
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
  };

  const addNewBin = (newBinData: Omit<SmartBin, 'id' | 'historicalFill' | 'status'>) => {
    const newId = `BIN-${100 + bins.length + 1}`;
    const status: SmartBin['status'] =
      newBinData.fillLevel > 80 ? 'overflowing' : newBinData.fillLevel >= 50 ? 'nearly_full' : 'normal';

    const createdBin: SmartBin = {
      ...newBinData,
      id: newId,
      status,
      historicalFill: [
        { timestamp: '08:00', fill: Math.max(0, newBinData.fillLevel - 20) },
        { timestamp: '12:00', fill: newBinData.fillLevel },
      ],
      isSimulated: true,
    };

    setBins((prev) => [createdBin, ...prev]);
  };

  const triggerSimulatedSpike = () => {
    // Pick the first normal bin and simulate sudden overflow spike
    const target = bins.find((b) => b.fillLevel < 70) || bins[0];
    if (target) {
      updateBinFill(target.id, 96);
    }
  };

  // Complaint actions
  const addComplaint = async (
    newComplaintData: Omit<CitizenComplaint, 'id' | 'createdAt' | 'upvotes' | 'status'>
  ): Promise<CitizenComplaint> => {
    const newId = `CMP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const created: CitizenComplaint = {
      ...newComplaintData,
      id: newId,
      createdAt: new Date().toISOString(),
      upvotes: 1,
      status: 'Pending',
    };

    setComplaints((prev) => [created, ...prev]);

    // Create system alert
    const newAlert: SystemAlert = {
      id: `ALT-CMP-${Date.now()}`,
      title: `New Citizen Complaint: ${created.title}`,
      message: `Location: ${created.location.address}. Severity: ${created.severity}.`,
      severity: created.severity === 'Urgent' ? 'critical' : 'warning',
      timestamp: 'Just now',
      targetId: newId,
      read: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);

    // Award citizen points for reporting
    awardEcoPoints(30, 'Reporting uncollected waste');

    return created;
  };

  const upvoteComplaint = (complaintId: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, upvotes: c.upvotes + 1 } : c))
    );
  };

  const updateComplaintStatus = (
    complaintId: string,
    status: CitizenComplaint['status'],
    assignedWorkerId?: string,
    resolutionNotes?: string
  ) => {
    const worker = workers.find((w) => w.id === assignedWorkerId);

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          return {
            ...c,
            status,
            assignedWorkerId: assignedWorkerId || c.assignedWorkerId,
            assignedWorkerName: worker ? `${worker.name} (${worker.vehicleNumber})` : c.assignedWorkerName,
            resolutionNotes: resolutionNotes || c.resolutionNotes,
            resolvedAt: status === 'Resolved' ? new Date().toISOString() : c.resolvedAt,
          };
        }
        return c;
      })
    );
  };

  // Worker status
  const updateWorkerStatus = (workerId: string, status: CollectionWorker['status']) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, status } : w))
    );
  };

  // Route optimization algorithm (Nearest-Neighbor Traveling Salesperson heuristic)
  const generateOptimizedRoute = (workerId: string): CollectionRoute => {
    const worker = workers.find((w) => w.id === workerId) || workers[0];

    // Identify candidate targets:
    // 1. All overflowing bins (>80%) and high fill bins (>50%)
    // 2. Pending or Dispatched complaints with Urgent or High severity
    const criticalBins = bins.filter((b) => b.fillLevel >= 50);
    const criticalComplaints = complaints.filter(
      (c) => c.status !== 'Resolved' && (c.severity === 'Urgent' || c.severity === 'High')
    );

    // Build raw waypoints pool
    const candidates: Array<{
      targetId: string;
      type: 'bin' | 'complaint';
      name: string;
      address: string;
      lat: number;
      lng: number;
      fillLevel?: number;
      urgency: 'Normal' | 'High' | 'Critical';
    }> = [];

    criticalBins.forEach((b) => {
      candidates.push({
        targetId: b.id,
        type: 'bin',
        name: b.name,
        address: b.location.address,
        lat: b.location.lat,
        lng: b.location.lng,
        fillLevel: b.fillLevel,
        urgency: b.fillLevel > 80 ? 'Critical' : 'High',
      });
    });

    criticalComplaints.forEach((c) => {
      candidates.push({
        targetId: c.id,
        type: 'complaint',
        name: c.title,
        address: c.location.address,
        lat: c.location.lat,
        lng: c.location.lng,
        urgency: c.severity === 'Urgent' ? 'Critical' : 'High',
      });
    });

    // Euclidean distance helper (lat/lng approx in city)
    const getDist = (lat1: number, lng1: number, lat2: number, lng2: number) => {
      const dx = (lat1 - lat2) * 111;
      const dy = (lng1 - lng2) * 88;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Nearest Neighbor sequence starting from Municipal Depot
    let currentLat = MUNICIPAL_DEPOT.lat;
    let currentLng = MUNICIPAL_DEPOT.lng;
    const remaining = [...candidates];
    const orderedWaypoints: RouteWaypoint[] = [
      {
        order: 1,
        targetId: 'DEPOT',
        type: 'depot',
        name: MUNICIPAL_DEPOT.name,
        address: MUNICIPAL_DEPOT.address,
        lat: MUNICIPAL_DEPOT.lat,
        lng: MUNICIPAL_DEPOT.lng,
        urgency: 'Normal',
        collected: true,
        collectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    let totalDistKm = 0;

    // Pick up to 8 top priority stops
    while (remaining.length > 0 && orderedWaypoints.length <= 8) {
      let nearestIdx = 0;
      let minScore = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const item = remaining[i];
        const dist = getDist(currentLat, currentLng, item.lat, item.lng);
        // Priority weight: Critical urgency gets lower score distance multiplier
        const urgencyWeight = item.urgency === 'Critical' ? 0.6 : 1.0;
        const score = dist * urgencyWeight;

        if (score < minScore) {
          minScore = score;
          nearestIdx = i;
        }
      }

      const nextStop = remaining.splice(nearestIdx, 1)[0];
      const legDist = getDist(currentLat, currentLng, nextStop.lat, nextStop.lng);
      totalDistKm += legDist;
      currentLat = nextStop.lat;
      currentLng = nextStop.lng;

      orderedWaypoints.push({
        order: orderedWaypoints.length + 1,
        targetId: nextStop.targetId,
        type: nextStop.type,
        name: nextStop.name,
        address: nextStop.address,
        lat: nextStop.lat,
        lng: nextStop.lng,
        fillLevel: nextStop.fillLevel,
        urgency: nextStop.urgency,
        collected: false,
      });
    }

    // Return to depot
    totalDistKm += getDist(currentLat, currentLng, MUNICIPAL_DEPOT.lat, MUNICIPAL_DEPOT.lng);

    const estTimeMinutes = Math.round(totalDistKm * 3.5 + (orderedWaypoints.length - 1) * 6);
    const fuelSaved = Math.min(45, Math.max(25, Math.round(38 + (Math.random() * 8 - 4))));

    const newRoute: CollectionRoute = {
      id: `ROUTE-OPT-${Date.now().toString().slice(-4)}`,
      name: `Optimized Surge Loop #${Math.floor(100 + Math.random() * 900)}`,
      workerId: worker.id,
      workerName: worker.name,
      truckId: worker.vehicleNumber,
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
      waypoints: orderedWaypoints,
      estimatedDistanceKm: Math.round(totalDistKm * 10) / 10,
      estimatedTimeMinutes: estTimeMinutes,
      estimatedFuelSavedPercent: fuelSaved,
      totalWasteCollectedKg: 0,
    };

    setRoutes((prev) => [newRoute, ...prev]);

    // Update worker's assigned route
    setWorkers((prev) =>
      prev.map((w) => (w.id === worker.id ? { ...w, assignedRouteId: newRoute.id, status: 'In Transit' } : w))
    );

    return newRoute;
  };

  const markWaypointCollected = (routeId: string, waypointOrder: number, wasteKg: number = 45) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id !== routeId) return r;

        let waypointTargetId = '';
        let waypointType = '';

        const updatedWaypoints = r.waypoints.map((wp) => {
          if (wp.order === waypointOrder) {
            waypointTargetId = wp.targetId;
            waypointType = wp.type;
            return {
              ...wp,
              collected: true,
              collectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              wasteCollectedKg: wasteKg,
            };
          }
          return wp;
        });

        // Trigger side-effects based on target type
        if (waypointType === 'bin' && waypointTargetId) {
          emptyBin(waypointTargetId);
        } else if (waypointType === 'complaint' && waypointTargetId) {
          updateComplaintStatus(waypointTargetId, 'Resolved', r.workerId, 'Collected during automated surge route.');
        }

        const newTotalWaste = r.totalWasteCollectedKg + wasteKg;
        const allCollected = updatedWaypoints.every((wp) => wp.collected);

        return {
          ...r,
          waypoints: updatedWaypoints,
          totalWasteCollectedKg: newTotalWaste,
          status: allCollected ? 'Completed' : r.status,
        };
      })
    );

    // Update worker stats
    setWorkers((prev) =>
      prev.map((w) => {
        const matchingRoute = routes.find((r) => r.id === routeId);
        if (matchingRoute && w.id === matchingRoute.workerId) {
          return {
            ...w,
            completedTasksToday: w.completedTasksToday + 1,
          };
        }
        return w;
      })
    );
  };

  const completeRoute = (routeId: string) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === routeId ? { ...r, status: 'Completed' } : r))
    );
  };

  // Alert management
  const markAlertRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, read: true } : a))
    );
  };

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
  };

  // Eco Points and Rewards
  const awardEcoPoints = (points: number, reason: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      ecoPoints: prev.ecoPoints + points,
    }));

    // Notification toast alert
    const newAlert: SystemAlert = {
      id: `ALT-ECO-${Date.now()}`,
      title: `+${points} Eco Points Awarded!`,
      message: `Earned points for: ${reason}. Total Balance: ${currentUser.ecoPoints + points} pts.`,
      severity: 'info',
      timestamp: 'Just now',
      read: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const redeemReward = (rewardId: string, pointsCost: number, voucherCode: string): boolean => {
    if (currentUser.ecoPoints < pointsCost) {
      return false;
    }

    setCurrentUser((prev) => ({
      ...prev,
      ecoPoints: prev.ecoPoints - pointsCost,
    }));

    setClaimedRewards((prev) => [
      {
        rewardId,
        claimedAt: new Date().toISOString(),
        code: voucherCode,
      },
      ...prev,
    ]);

    return true;
  };

  // Aggregated metrics
  const totalBins = bins.length;
  const overflowingBins = bins.filter((b) => b.status === 'overflowing').length;
  const nearlyFullBins = bins.filter((b) => b.status === 'nearly_full').length;
  const normalBins = bins.filter((b) => b.status === 'normal').length;
  const avgFillLevel = Math.round(
    bins.reduce((acc, b) => acc + b.fillLevel, 0) / (bins.length || 1)
  );

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter((c) => c.status === 'Pending').length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;

  const totalWasteCollectedKg = routes.reduce(
    (acc, r) => acc + (r.totalWasteCollectedKg || 0),
    1840
  );
  const totalCO2SavedKg = Math.round(totalWasteCollectedKg * 1.82);
  const efficiencyRating = Math.round(
    92 - (overflowingBins / (totalBins || 1)) * 15
  );

  return (
    <WasteContext.Provider
      value={{
        currentUser,
        switchRole,
        updateUserProfile,
        bins,
        emptyBin,
        updateBinFill,
        addNewBin,
        triggerSimulatedSpike,
        isSimulating,
        setIsSimulating,
        complaints,
        addComplaint,
        upvoteComplaint,
        updateComplaintStatus,
        workers,
        updateWorkerStatus,
        routes,
        generateOptimizedRoute,
        markWaypointCollected,
        completeRoute,
        alerts,
        markAlertRead,
        dismissAlert,
        clearAllAlerts,
        awardEcoPoints,
        claimedRewards,
        redeemReward,
        metrics: {
          totalBins,
          overflowingBins,
          nearlyFullBins,
          normalBins,
          avgFillLevel,
          totalComplaints,
          pendingComplaints,
          resolvedComplaints,
          totalWasteCollectedKg,
          totalCO2SavedKg,
          efficiencyRating,
        },
      }}
    >
      {children}
    </WasteContext.Provider>
  );
};

export const useWaste = () => {
  const context = useContext(WasteContext);
  if (!context) {
    throw new Error('useWaste must be used within a WasteProvider');
  }
  return context;
};
