import React from "react";
import { useAuth } from "../AuthContext";
import { api } from "../api";

export default function VipCoupon() {
    const { token } = useAuth();
    const [couponCode, setCouponCode] = React.useState("");
    const [isVip, setIsVip] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    // Check VIP status on load
    React.useEffect(() => {
        if (!token) return;
        
        api<{ is_vip: boolean; storage_limit_mb: number }>("/api/coupons/status", {
            headers: { authorization: `Bearer ${token}` }
        })
            .then((data) => {
                setIsVip(data.is_vip);
            })
            .catch(() => {
                // Ignore errors for status check
            });
    }, [token]);

    const handleRedeem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponCode.trim()) return;

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await api<{ success: boolean; message: string; is_vip: boolean }>(`/api/coupons/redeem/${encodeURIComponent(couponCode.trim())}`, {
                method: "POST",
                headers: { authorization: `Bearer ${token}` },
            });

            if (response.success) {
                setMessage(response.message);
                setIsVip(response.is_vip);
                setCouponCode("");
            }
        } catch (err: any) {
            setError(err.message || "Failed to redeem coupon");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="max-w-md mx-auto">
                <div className="mb-8 text-center">
                    <img src="/logos/05-elegant-vault.svg" alt="FutureBox" className="h-16 w-16 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold">VIP Coupon</h2>
                    <p className="text-slate-600">Please log in to redeem your VIP coupon.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="mb-8 text-center">
                <img src="/logos/05-elegant-vault.svg" alt="FutureBox" className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold">VIP Coupon</h2>
                <p className="text-slate-600">Redeem your VIP coupon to unlock 100MB storage.</p>
            </div>

            {/* VIP Status */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${isVip ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    <div>
                        <div className="font-medium text-slate-900">
                            {isVip ? 'VIP Status: Active' : 'VIP Status: Inactive'}
                        </div>
                        <div className="text-sm text-slate-600">
                            Storage limit: {isVip ? '100MB' : '10MB'}
                        </div>
                    </div>
                </div>
            </div>

            {!isVip && (
                <form onSubmit={handleRedeem} className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Coupon Code
                        </label>
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter your VIP coupon code"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            required
                        />
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 border border-red-200 p-3">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    {message && (
                        <div className="rounded-md bg-emerald-50 border border-emerald-200 p-3">
                            <div className="text-sm text-emerald-700">{message}</div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !couponCode.trim()}
                        className="w-full rounded-md bg-brand-600 text-white px-4 py-2 text-sm hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Redeeming..." : "Redeem Coupon"}
                    </button>
                </form>
            )}

            {isVip && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 shadow-sm p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                        </div>
                        <div>
                            <div className="font-medium text-emerald-900">VIP Active!</div>
                            <div className="text-sm text-emerald-700">
                                You now have access to 100MB storage and all VIP features.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
