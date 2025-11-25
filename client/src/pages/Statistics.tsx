import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Loader, AlertCircle, CheckCircle, BarChart3, Calendar, ExternalLink } from "lucide-react";
import { getStatistics, deleteLink } from "../lib/apis";
import { formatDate } from "../utils/common.utils";
import { useParams, useNavigate } from "react-router-dom";

export default function Statistics() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [code]);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const response: any = await getStatistics(code!);
      setStats(response.data);
    
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete link ${code}? This action cannot be undone.`)) return;

    setDeleting(true);
    try {
      await deleteLink(code!);
      navigate("/", { state: { message: "Link deleted successfully!" } });
    } catch (err: any) {
      setError(err.message || "Failed to delete link");
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader size={40} className="animate-spin text-blue-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-600" size={24} />
              <h2 className="text-2xl font-bold text-red-600">Error</h2>
            </div>
            <p className="text-red-600 text-lg mb-6">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}

        {/* Stats Content */}
        {!loading && stats && (
          <>
            {/* Title Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border-l-4 border-purple-600">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Link Statistics
                </h1>
              </div>
              <p className="text-gray-600">Detailed analytics for your shortened link</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Short Code */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Short Code</p>
                <p className="text-3xl font-bold text-blue-600 font-mono mb-4">{stats.short_code}</p>
                <button
                  onClick={() => copyToClipboard(stats.short_code)}
                  className="w-full px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle size={18} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={18} /> Copy Code
                    </>
                  )}
                </button>
              </div>

              {/* Total Clicks */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Total Clicks</p>
                <p className="text-5xl font-bold text-green-600 mb-4">{stats?.clicks || 0}</p>
                <p className="text-sm text-gray-600">clicks tracked</p>
              </div>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Created Date */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="text-gray-600" size={20} />
                  <p className="text-sm font-semibold text-gray-500 uppercase">Created</p>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {formatDate(stats.created_at)}
                </p>
              </div>

              {/* Last Clicked */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="text-gray-600" size={20} />
                  <p className="text-sm font-semibold text-gray-500 uppercase">Last Clicked</p>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {!stats.last_clicked ? formatDate(new Date()) : "Never clicked"}
                </p>
              </div>
            </div>

            {/* Original URL */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <ExternalLink className="text-blue-600" size={20} />
                <p className="text-sm font-semibold text-gray-500 uppercase">Original URL</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={stats.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-mono text-sm break-all hover:bg-blue-100 transition-colors"
                >
                  {stats.original_url}
                </a>
                <button
                  onClick={() => copyToClipboard(stats.original_url)}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  title="Copy URL"
                >
                  {copied ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Short URL */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <ExternalLink className="text-purple-600" size={20} />
                <p className="text-sm font-semibold text-gray-500 uppercase">Short URL</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`${import.meta.env.VITE_BACKEND_URL}/${stats.short_code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 bg-purple-50 text-purple-600 rounded-lg font-mono font-bold text-lg hover:bg-purple-100 transition-colors"
                >
                  {import.meta.env.VITE_BACKEND_URL}/{stats.short_code}
                </a>
                <button
                  onClick={() => copyToClipboard(`${import.meta.env.VITE_BACKEND_URL}/${stats.short_code}`)}
                  className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  title="Copy URL"
                >
                  {copied ? (
                    <CheckCircle size={20} />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Delete Button */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting && <Loader size={18} className="animate-spin" />}
                {deleting ? "Deleting..." : "Delete Link"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}