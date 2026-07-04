"use client";

import { useState, useEffect } from "react";
import { upload } from "@imagekit/next";
import Image from "next/image";
import { Save, AlertCircle, Upload, Check, RefreshCw } from "lucide-react";

export default function WildcardManager() {
  const [wildcard, setWildcard] = useState({
    isActive: false,
    title: "",
    description: "",
    poster: "",
    googleFormUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWildcard();
  }, []);

  const fetchWildcard = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/wildcard");
      const data = await res.json();
      if (data) {
        setWildcard({
          isActive: data.isActive || false,
          title: data.title || "",
          description: data.description || "",
          poster: data.poster || "",
          googleFormUrl: data.googleFormUrl || "",
        });
      }
    } catch (err: any) {
      console.error("Error fetching wildcard details:", err);
      setError("Failed to fetch wildcard configurations.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 3MB Size Limit
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File is too large! Please upload a poster smaller than 3MB.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // 1. Get Auth Params
      const authResponse = await fetch("/api/imagekit/auth");
      const { token, expire, signature, publicKey } = await authResponse.json();

      // 2. Upload to ImageKit
      const result = await upload({
        file,
        fileName: `wildcard_${Date.now()}_${file.name}`,
        publicKey,
        token,
        expire,
        signature,
        folder: "hyd_site_wildcard_posters",
      });

      setWildcard((prev) => ({ ...prev, poster: result.url || "" }));
    } catch (err: any) {
      setError("Image upload failed: " + err.message);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/wildcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(wildcard),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save changes.");
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error saving wildcard config:", err);
      setError(err.message || "Failed to update wildcard settings.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !wildcard.title) {
    return (
      <div className="glass-effect border border-white/10 p-6 rounded-xl shadow-lg h-[32rem] flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="animate-spin text-blue-500 w-10 h-10" />
          <p className="text-white/60">Loading Wildcard settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-effect border border-white/10 p-6 rounded-xl shadow-lg h-[36rem] overflow-y-auto text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0066FF]">Manage Wildcard</h2>
            <p className="text-sm text-white/60 mt-1">
              Toggle the wildcard submission section, customize details, upload posters, and edit submission links.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-white/5 border border-white/10 py-2 px-4 rounded-xl">
            <span className="text-sm font-semibold">Status:</span>
            <button
              type="button"
              onClick={() => setWildcard((prev) => ({ ...prev, isActive: !prev.isActive }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                wildcard.isActive ? "bg-green-600" : "bg-white/20"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  wildcard.isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-bold ${wildcard.isActive ? "text-green-400" : "text-white/40"}`}>
              {wildcard.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Wildcard Section Title</label>
              <input
                type="text"
                value={wildcard.title}
                onChange={(e) => setWildcard((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Beatbox Championship Wildcard Submission"
                className="w-full p-3 bg-white/10 backdrop-blur-md text-white placeholder:text-gray-500 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Google Form Submission Link</label>
              <input
                type="url"
                value={wildcard.googleFormUrl}
                onChange={(e) => setWildcard((prev) => ({ ...prev, googleFormUrl: e.target.value }))}
                placeholder="https://docs.google.com/forms/..."
                className="w-full p-3 bg-white/10 backdrop-blur-md text-white placeholder:text-gray-500 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">
                Submission Guidelines & Details (Markdown Supported)
              </label>
              <textarea
                value={wildcard.description}
                onChange={(e) => setWildcard((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Provide eligibility criteria, rules, submission deadlines, etc."
                rows={7}
                className="w-full p-3 bg-white/10 backdrop-blur-md text-white placeholder:text-gray-500 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all shadow-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Wildcard Poster Image</label>
              <div className="p-4 rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center relative min-h-[160px] transition-all hover:bg-white/10">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {uploading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <RefreshCw className="animate-spin text-blue-500 w-8 h-8" />
                    <p className="text-xs text-white/60">Uploading poster to ImageKit...</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2 pointer-events-none">
                    <Upload className="w-8 h-8 mx-auto text-white/40" />
                    <p className="text-sm font-semibold">Click or drag a file to upload</p>
                    <p className="text-xs text-white/40">PNG, JPG, WEBP up to 3MB</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm font-medium">Poster Image URL (or upload above)</label>
              <input
                type="text"
                value={wildcard.poster}
                onChange={(e) => setWildcard((prev) => ({ ...prev, poster: e.target.value }))}
                placeholder="ImageKit CDN URL"
                className="w-full p-3 bg-white/10 backdrop-blur-md text-white placeholder:text-gray-500 rounded-xl border border-white/20 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all shadow-sm text-xs"
              />
            </div>

            {wildcard.poster && (
              <div className="relative w-full h-44 border border-white/10 rounded-xl overflow-hidden shadow-inner">
                <Image
                  src={wildcard.poster}
                  alt="Poster Preview"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-2 border-t border-white/10 pt-6 flex items-center justify-end gap-4">
            {saveSuccess && (
              <span className="text-green-400 text-sm font-semibold flex items-center gap-1.5 animate-in fade-in duration-300">
                <Check className="w-4 h-4" /> Settings updated successfully!
              </span>
            )}
            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin w-4 h-4" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
