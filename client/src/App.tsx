import { useState } from "react";
import { Copy, CheckCircle, BarChart3, Loader } from "lucide-react";
import { createShortUrl, getStatistics } from "./lib/apis";
import { formatDate } from "./utils/common.utils";

export default function URLShortener() {
  const [url, setUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("shorten");

  const handleShorten = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response: any = await createShortUrl(url);

      if (!response?.data?.short_code) throw new Error("Failed to shorten URL");

      setShortCode(response.data.short_code);
      setShortUrl(response.data.short_url);
      setStats(null);
    } catch (err: any) {
      setError(err.message || "Error shortening URL");
    } finally {
      setLoading(false);
    }
  };

  const handleGetStats = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response: any = await getStatistics(shortCode);
      if (!response?.data) throw new Error("URL not found");

      setStats(response.data);
    } catch (err: any) {
      setError(err.message || "Error fetching stats");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🔗</span>
            </div>
            <h1 className="text-4xl font-bold text-white">URL Shortener</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Create short, shareable links and track their performance
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("shorten")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${activeTab === "shorten"
              ? "bg-white text-blue-600 shadow-lg"
              : "bg-white/20 text-white hover:bg-white/30"
              }`}
          >
            Create
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${activeTab === "stats"
              ? "bg-white text-blue-600 shadow-lg"
              : "bg-white/20 text-white hover:bg-white/30"
              }`}
          >
            View Stats
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          {/* Shorten Tab */}
          {activeTab === "shorten" && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Your URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/very/long/url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <button
                onClick={handleShorten}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader size={20} className="animate-spin" />}
                {loading ? "Shortening..." : "Shorten URL"}
              </button>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Short Code
                </label>
                <input
                  type="text"
                  placeholder="e.g., abc12345"
                  value={shortCode}
                  onChange={(e) => setShortCode(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <button
                onClick={handleGetStats}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader size={20} className="animate-spin" />}
                {loading ? "Loading..." : "Get Stats"}
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-700 font-semibold">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Result Card */}
        {shortUrl && activeTab === "shorten" && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-800">
                URL Shortened Successfully!
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Original URL
                </label>
                <p className="text-gray-700 p-3 bg-gray-50 rounded-lg break-all">
                  {url}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Short URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shortUrl}
                    readOnly
                    className="flex-1 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-semibold border-2 border-blue-200"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Short Code
                </label>
                <p className="text-gray-700 p-3 bg-gray-50 rounded-lg font-mono font-bold">
                  {shortCode}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Card */}
        {stats && activeTab === "stats" && (
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                URL Statistics
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-blue-600 uppercase mb-1">
                    Clicks
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    {stats.clicks}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <p className="text-xs font-semibold text-purple-600 uppercase mb-1">
                    Short Code
                  </p>
                  <p className="text-xl font-bold text-purple-900 break-all">
                    {stats.short_code}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Original URL
                </label>
                <p className="text-gray-700 p-3 bg-gray-50 rounded-lg break-all">
                  {stats.original_url}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                  Created
                </label>
                <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">
                  {formatDate(stats.created_at)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
