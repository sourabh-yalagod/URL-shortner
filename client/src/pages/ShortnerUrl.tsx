import { useState, useEffect } from "react";
import { Copy, Trash2, Eye, Plus, Loader, AlertCircle, CheckCircle, Stamp, ChartBar } from "lucide-react";
import { getAllLinks, createShortUrl, deleteLink } from "../lib/apis";
import { formatDate } from "../utils/common.utils";
import { Link } from "react-router-dom"

export default function ShortnerUrl() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ original_url: "", short_code: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    setError("");
    try {
      const response: any = await getAllLinks();
      setLinks(response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch links");
    } finally {
      setLoading(false);
    }
  };
  const handleCreateLink = async () => {
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (!formData.original_url) {
      setError("URL is required");
      setSubmitting(false);
      return;
    }

    try {
      const response: any = await createShortUrl(
        formData.original_url,
        formData.short_code || undefined
      );

      setLinks([response.data, ...links]);
      setFormData({ original_url: "", short_code: "" });
      setShowForm(false);
      setSuccess("Link created successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      const errMsg = err.response?.data?.error || err.message || "Failed to create link";
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLink = async (code: string) => {
    if (!confirm(`Delete link ${code}?`)) return;

    try {
      await deleteLink(code);
      setLinks(links.filter((link) => link.short_code !== code));
      setSuccess("Link deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete link");
    }
  };

  const copyToClipboard = (text: string, code: string) => {
    navigator.clipboard.writeText(text);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredLinks = links.filter(
    (link) =>
      link.short_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.original_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Dashboard
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              New Link
            </button>
          </div>
          <p className="text-gray-600">Manage and track all your shortened links</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3">
            <CheckCircle className="text-green-600" size={20} />
            <p className="text-green-700 font-semibold">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-600" size={20} />
            <p className="text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-600">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Link</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Original URL *
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/very/long/url"
                  value={formData.original_url}
                  onChange={(e) =>
                    setFormData({ ...formData, original_url: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Short Code (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., docs (6-8 chars, alphanumeric only)"
                  value={formData.short_code}
                  onChange={(e) =>
                    setFormData({ ...formData, short_code: e.target.value })
                  }
                  maxLength={8}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to auto-generate. Must be 6-8 alphanumeric characters.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateLink}
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader size={18} className="animate-spin" />}
                  {submitting ? "Creating..." : "Create Link"}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ original_url: "", short_code: "" });
                  }}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by code or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader size={32} className="animate-spin text-blue-600" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredLinks.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? "No links match your search"
                : "No links yet. Create your first shortened link!"}
            </p>
          </div>
        )}

        {/* Links Table */}
        {!loading && filteredLinks.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Short Code
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Original URL
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Clicks
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Last Clicked
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map((link) => (
                    <tr
                      key={link.short_code}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {link.short_code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 truncate max-w-xs" title={link.original_url}>
                          {link.original_url}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900 font-bold text-lg">
                          {link.total_clicks || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 text-sm">
                          {link.last_clicked ? formatDate(link.last_clicked) : "Never"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              copyToClipboard(link.short_url || `${import.meta.env.VITE_BACKEND_URL}/${link.short_code}`, link.short_code)
                            }
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Copy short URL"
                          >
                            {copied === link.short_code ? (
                              <CheckCircle size={18} className="text-green-600" />
                            ) : (
                              <Copy size={18} className="text-blue-600" />
                            )}
                          </button>
                          <a
                            target="_blank"
                            href={`${import.meta.env.VITE_BACKEND_URL}/${link.short_code}`}
                            className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                            title="View stats"
                          >
                            <Eye size={18} className="text-purple-600" />
                          </a>
                          <button
                            onClick={() => handleDeleteLink(link.short_code)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete link"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                          <Link to={`/statistics/${link.short_code}`}><ChartBar size={18} className="text-purple-600 mt-2 ml-2" /></Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        {!loading && filteredLinks.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-gray-600 text-sm">Total Links</p>
              <p className="text-3xl font-bold text-gray-900">{links.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-gray-600 text-sm">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900">
                {links.reduce((sum, link) => sum + (link.total_clicks || 0), 0)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-gray-600 text-sm">Avg Clicks</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(
                  links.reduce((sum, link) => sum + (link.total_clicks || 0), 0) / links.length
                )}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-gray-600 text-sm">Matches</p>
              <p className="text-3xl font-bold text-gray-900">{filteredLinks.length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}