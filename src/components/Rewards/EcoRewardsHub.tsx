import React, { useState } from 'react';
import { useWaste } from '../../context/WasteContext';
import { ECO_REWARDS_CATALOG } from '../../data/mockData';
import {
  Award,
  Sparkles,
  Gift,
  CheckCircle,
  Copy,
  TreePine,
  Train,
  Droplets,
  Sprout,
  ShoppingBag,
  Trophy,
  Users,
} from 'lucide-react';

export const EcoRewardsHub: React.FC = () => {
  const { currentUser, redeemReward, claimedRewards } = useWaste();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeemFeedback, setRedeemFeedback] = useState<string | null>(null);

  // Leaderboard mock data
  const communityLeaderboard = [
    { rank: 1, name: 'Maya Lin', points: 680, tier: 'Zero Waste Pioneer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80' },
    { rank: 2, name: 'Carlos Rivera', points: 540, tier: 'Green Champion', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
    { rank: 3, name: 'Elena Rostova (You)', points: currentUser.ecoPoints, tier: 'Eco Guardian', avatar: currentUser.avatar },
    { rank: 4, name: 'Sanjay Gupta', points: 310, tier: 'Eco Novice', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
    { rank: 5, name: 'Aria Foster', points: 290, tier: 'Eco Novice', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
  ];

  const handleRedeem = (reward: (typeof ECO_REWARDS_CATALOG)[0]) => {
    const success = redeemReward(reward.id, reward.pointsCost, reward.voucherCode || `ECO-${Date.now().toString().slice(-4)}`);
    if (success) {
      setRedeemFeedback(`Successfully redeemed: ${reward.title}! Check your claimed vouchers below.`);
      setTimeout(() => setRedeemFeedback(null), 5000);
    } else {
      setRedeemFeedback(`Insufficient points. You need ${reward.pointsCost} points to claim this perk.`);
      setTimeout(() => setRedeemFeedback(null), 5000);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getRewardIcon = (icon: string) => {
    switch (icon) {
      case 'train':
        return <Train className="w-5 h-5 text-blue-400" />;
      case 'droplets':
        return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'tree-pine':
        return <TreePine className="w-5 h-5 text-emerald-400" />;
      case 'sprout':
        return <Sprout className="w-5 h-5 text-green-400" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Banner */}
      <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-emerald-950/50 rounded-2xl border border-amber-800/30 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Citizen Eco Incentive Wallet</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Eco Rewards & Segregation Credits</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Earn points by correctly segregating waste via AI classification, reporting street spills, and keeping bins clear.
            Redeem points for utility bill discounts and transit vouchers.
          </p>
        </div>

        <div className="bg-slate-950/80 px-6 py-4 rounded-xl border border-slate-800 text-center shrink-0">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Available Balance</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">{currentUser.ecoPoints}</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-0.5">Rank: Eco Guardian</div>
        </div>
      </div>

      {redeemFeedback && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{redeemFeedback}</span>
        </div>
      )}

      {/* Grid: Rewards Catalog & Community Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rewards Catalog */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Redemption Catalog</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ECO_REWARDS_CATALOG.map((reward) => {
              const canAfford = currentUser.ecoPoints >= reward.pointsCost;

              return (
                <div
                  key={reward.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                        {getRewardIcon(reward.icon)}
                      </div>
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {reward.pointsCost} pts
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm">{reward.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{reward.description}</p>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{canAfford ? 'Redeem Voucher' : 'Need More Points'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Claimed Vouchers List */}
          {claimedRewards.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-md space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Your Claimed Vouchers & Discount Codes
              </h4>

              <div className="space-y-2">
                {claimedRewards.map((cr, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-mono text-emerald-400 font-bold">{cr.code}</div>
                      <div className="text-[10px] text-slate-500">
                        Claimed on {new Date(cr.claimedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <button
                      onClick={() => copyToClipboard(cr.code)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      {copiedCode === cr.code ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Community Leaderboard */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Community Leaderboard</span>
            </h3>
            <span className="text-[11px] text-slate-400">Monthly</span>
          </div>

          <div className="space-y-2.5">
            {communityLeaderboard.map((user) => (
              <div
                key={user.rank}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                  user.name.includes('(You)')
                    ? 'bg-emerald-950/30 border-emerald-800/40'
                    : 'bg-slate-950/60 border-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono text-xs ${
                      user.rank === 1
                        ? 'bg-amber-500 text-slate-950'
                        : user.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : user.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {user.rank}
                  </span>

                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />

                  <div>
                    <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
                    <div className="text-[10px] text-emerald-400">{user.tier}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-amber-400 text-xs">{user.points}</div>
                  <div className="text-[10px] text-slate-500">pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
