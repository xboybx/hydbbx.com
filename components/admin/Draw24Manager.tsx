"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  AlertCircle, 
  Check, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Trophy, 
  CreditCard, 
  ExternalLink,
  Sparkles
} from "lucide-react";
import { DEFAULT_25_BEATBOXERS, BeatboxerItem } from "@/lib/draw24Defaults";

interface Beatboxer {
  id: number;
  name: string;
  status: string;
}

export default function Draw24Manager() {
  const [isActive, setIsActive] = useState(true);
  const [title, setTitle] = useState("Hyderabad Beatbox Championship 2026");
  const [registrationFee, setRegistrationFee] = useState("₹350");
  const [googleFormUrl, setGoogleFormUrl] = useState("https://docs.google.com/forms/d/e/1FAIpQLSengmcfx01WNUSI_ECZhjAkPEwlhn-i-au-cczkLme5yH9qtg/viewform");
  const [instagramHandle, setInstagramHandle] = useState("@hydbeatboxcommunity");
  const [beatboxers, setBeatboxers] = useState<Beatboxer[]>(DEFAULT_25_BEATBOXERS);

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDraw24();
  }, []);

  const fetchDraw24 = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/draw-24");
      const data = await res.json();
      if (data) {
        setIsActive(data.isActive !== undefined ? data.isActive : true);
        setTitle(data.title || "Hyderabad Beatbox Championship 2026");
        setRegistrationFee(data.registrationFee || "₹350");
        setGoogleFormUrl(data.googleFormUrl || "");
        setInstagramHandle(data.instagramHandle || "@hydbeatboxcommunity");
        if (Array.isArray(data.beatboxers) && data.beatboxers.length > 0) {
          setBeatboxers(data.beatboxers);
        }
      }
    } catch (err: any) {
      console.error("Error fetching Draw 24 configurations:", err);
      setError("Failed to fetch Draw 24 configurations.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBeatboxer = () => {
    const nextId = beatboxers.length > 0 ? Math.max(...beatboxers.map((b) => b.id)) + 1 : 1;
    setBeatboxers([...beatboxers, { id: nextId, name: `Artist ${nextId}`, status: "Confirmed" }]);
  };

  const handleRemoveBeatboxer = (index: number) => {
    const updated = beatboxers.filter((_, i) => i !== index);
    setBeatboxers(updated);
  };

  const handleUpdateBeatboxer = (index: number, field: keyof Beatboxer, value: any) => {
    const updated = [...beatboxers];
    updated[index] = { ...updated[index], [field]: value };
    setBeatboxers(updated);
  };

  const handleResetDefault = () => {
    if (confirm("Reset roster to the default Top 25 Beatboxers list?")) {
      setBeatboxers(DEFAULT_25_BEATBOXERS);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/draw-24", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive,
          title,
          registrationFee,
          googleFormUrl,
          instagramHandle,
          beatboxers,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update configurations");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || "Failed to save configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-effect p-6 md:p-8 rounded-xl max-w-5xl mx-auto shadow-2xl border border-white/10 text-white font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" /> Championship Management
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Manage Wildcard Winners (Draw 24)
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Control registration active status, edit the Top Beatboxers roster, fee, and Google Form link.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDraw24}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400 text-sm font-medium">
          <Check className="w-5 h-5 shrink-0" />
          <span>Draw 24 configurations saved successfully! Changes are live on the website.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Status Toggle Box */}
        <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-lg">Registration & Roster Status</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : "bg-red-500/15 text-red-400 border-red-500/30"
                }`}
              >
                {isActive ? "● Active & Visible" : "○ Disabled / Closed"}
              </span>
            </div>
            <p className="text-xs text-white/50 mt-1">
              When Active, the navbar link, home hero button, and public roster page are visible. When Inactive, the button is hidden from home, and the page shows "Registration Closed".
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* 2. Core Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80">
              Championship / Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hyderabad Beatbox Championship 2026"
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-blue-500 focus:outline-none text-sm transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-white/80 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Registration Fee</span>
            </label>
            <input
              type="text"
              value={registrationFee}
              onChange={(e) => setRegistrationFee(e.target.value)}
              placeholder="e.g. ₹350"
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-emerald-500 focus:outline-none text-sm transition-all font-mono font-semibold"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-white/80 flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-blue-400" />
              <span>Google Form Registration URL</span>
            </label>
            <input
              type="url"
              value={googleFormUrl}
              onChange={(e) => setGoogleFormUrl(e.target.value)}
              placeholder="https://docs.google.com/forms/d/e/.../viewform"
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-blue-500 focus:outline-none text-sm transition-all"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-white/80">
              Support Instagram Handle
            </label>
            <input
              type="text"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
              placeholder="@hydbeatboxcommunity"
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-blue-500 focus:outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* 3. Beatboxers Roster Section */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Selected Beatboxers Roster ({beatboxers.length} Artists)</span>
              </h3>
              <p className="text-xs text-white/50">
                Edit artist names and seed numbers. Drag/order or modify individually.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefault}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-all text-white/70 hover:text-white"
              >
                Reset to Default 25
              </button>
              <button
                type="button"
                onClick={handleAddBeatboxer}
                className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Beatboxer</span>
              </button>
            </div>
          </div>

          {/* Roster Grid Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto p-1 scrollbar-hide">
            {beatboxers.map((bbx, index) => (
              <div
                key={index}
                className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center gap-2 hover:border-blue-500/30 transition-all"
              >
                <input
                  type="number"
                  value={bbx.id}
                  onChange={(e) => handleUpdateBeatboxer(index, "id", parseInt(e.target.value) || 0)}
                  className="w-12 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-center text-xs font-mono font-bold text-blue-400 focus:outline-none"
                  title="Seed / Number"
                />

                <input
                  type="text"
                  value={bbx.name}
                  onChange={(e) => handleUpdateBeatboxer(index, "name", e.target.value)}
                  placeholder="Artist Name"
                  className="flex-grow bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                  required
                />

                <input
                  type="text"
                  value={bbx.status}
                  onChange={(e) => handleUpdateBeatboxer(index, "status", e.target.value)}
                  placeholder="Status"
                  className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-emerald-400 focus:outline-none text-center"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveBeatboxer(index)}
                  className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Remove Artist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Configurations...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
