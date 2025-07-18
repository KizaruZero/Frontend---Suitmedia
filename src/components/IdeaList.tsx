import React, { useEffect, useState } from "react";
import IdeaCard from "./IdeaCard";
import IdeaCardSkeleton from "./IdeaCardSkeleton";

interface Idea {
  id: string;
  published_at: string;
  title: string;
  small_image?: { url: string };
  medium_image?: { url: string };
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const SORT_OPTIONS = [
  { label: "Newest", value: "-published_at" },
  { label: "Oldest", value: "published_at" },
];

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const updateURL = (page: number, pageSize: number, sort: string) => {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("pageSize", pageSize.toString());
  params.set("sort", sort);

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);
};

const getStoredPreferences = () => {
  try {
    const stored = localStorage.getItem("ideas-preferences");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const storePreferences = (pageSize: number, sort: string) => {
  try {
    localStorage.setItem(
      "ideas-preferences",
      JSON.stringify({
        pageSize,
        sort,
      })
    );
  } catch {}
};

const IdeaList: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return Math.max(1, parseInt(urlParams.get("page") || "1", 10));
  });

  const [pageSize, setPageSize] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPageSize = urlParams.get("pageSize");

    if (urlPageSize) {
      const parsedPageSize = parseInt(urlPageSize, 10);
      return PAGE_SIZE_OPTIONS.includes(parsedPageSize)
        ? parsedPageSize
        : PAGE_SIZE_OPTIONS[0];
    }

    const stored = getStoredPreferences();
    return PAGE_SIZE_OPTIONS.includes(stored.pageSize)
      ? stored.pageSize
      : PAGE_SIZE_OPTIONS[0];
  });

  const [sort, setSort] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSort = urlParams.get("sort");

    if (urlSort) {
      return (
        SORT_OPTIONS.find((opt) => opt.value === urlSort)?.value ||
        SORT_OPTIONS[0].value
      );
    }

    const stored = getStoredPreferences();
    return (
      SORT_OPTIONS.find((opt) => opt.value === stored.sort)?.value ||
      SORT_OPTIONS[0].value
    );
  });

  useEffect(() => {
    updateURL(page, pageSize, sort);
  }, [page, pageSize, sort]);

  useEffect(() => {
    storePreferences(pageSize, sort);
  }, [pageSize, sort]);

  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlPage = Math.max(1, parseInt(urlParams.get("page") || "1", 10));
      const urlPageSize = urlParams.get("pageSize");
      const urlSort = urlParams.get("sort");
      const stored = getStoredPreferences();

      setPage(urlPage);

      if (urlPageSize) {
        const parsedPageSize = parseInt(urlPageSize, 10);
        setPageSize(
          PAGE_SIZE_OPTIONS.includes(parsedPageSize)
            ? parsedPageSize
            : PAGE_SIZE_OPTIONS[0]
        );
      } else {
        setPageSize(
          PAGE_SIZE_OPTIONS.includes(stored.pageSize)
            ? stored.pageSize
            : PAGE_SIZE_OPTIONS[0]
        );
      }

      if (urlSort) {
        setSort(
          SORT_OPTIONS.find((opt) => opt.value === urlSort)?.value ||
            SORT_OPTIONS[0].value
        );
      } else {
        setSort(
          SORT_OPTIONS.find((opt) => opt.value === stored.sort)?.value ||
            SORT_OPTIONS[0].value
        );
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 300));

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          size: pageSize.toString(),
          sort,
        });
        params.append("append[]", "small_image");
        params.append("append[]", "medium_image");

        const apiUrl = `/api/ideas?${params.toString()}`;

        const res = await fetch(apiUrl);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        setIdeas(data.data || []);
        setTotal(data.meta?.total ?? 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching ideas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, [page, pageSize, sort]);

  const pageCount = Math.ceil(total / pageSize);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading ideas: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-orange-500 text-black rounded hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
        <span className="text-sm sm:text-base font-medium text-black order-2 sm:order-1">
          {loading ? (
            <div className="h-4 bg-gray-200 animate-pulse rounded w-48"></div>
          ) : (
            <>
              Showing {(page - 1) * pageSize + 1} -{" "}
              {Math.min(page * pageSize, total)} of {total}
            </>
          )}
        </span>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 order-1 sm:order-2">
          <label className="flex flex-col sm:flex-row sm:items-center text-black font-medium gap-2 text-sm">
            <span className="whitespace-nowrap">Show per page:</span>
            <select
              className="border rounded-full px-4 sm:px-6 lg:px-8 py-2 sm:py-1 w-full sm:w-auto"
              value={pageSize}
              disabled={loading}
              onChange={(e) => {
                const newPageSize = Number(e.target.value);
                setPageSize(newPageSize);
                setPage(1);
              }}
            >
              {PAGE_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col sm:flex-row sm:items-center text-black font-medium gap-2 text-sm">
            <span className="whitespace-nowrap">Sort by:</span>
            <select
              className="border rounded-full px-4 sm:px-6 lg:px-8 py-2 sm:py-1 w-full sm:w-auto"
              value={sort}
              disabled={loading}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div
        key={`${page}-${pageSize}-${sort}`}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12"
      >
        {loading
          ? Array.from({ length: pageSize }).map((_, index) => (
              <IdeaCardSkeleton key={`skeleton-${index}`} />
            ))
          : ideas.map((idea) => {
              const imageUrl = idea.small_image?.url || idea.medium_image?.url;
              return (
                <IdeaCard
                  key={idea.id}
                  imageUrl={imageUrl || ""}
                  title={idea.title}
                  date={formatDate(idea.published_at)}
                />
              );
            })}
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center items-center mt-8 sm:mt-12 mb-6 sm:mb-8">
          <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-lg p-2 sm:p-3 shadow-sm">
            <button
              className="px-2 sm:px-3 py-1 sm:py-2 bg-white text-black disabled:opacity-50 hover:bg-gray-50 rounded text-sm sm:text-base transition-colors"
              disabled={page === 1 || loading}
              onClick={() => setPage(1)}
            >
              &laquo;&laquo;
            </button>

            <button
              className="px-2 sm:px-3 py-1 sm:py-2 bg-white text-black disabled:opacity-50 hover:bg-gray-50 rounded text-sm sm:text-base transition-colors"
              disabled={page === 1 || loading}
              onClick={() => setPage(page - 1)}
            >
              &laquo;
            </button>

            <div className="flex items-center gap-1 sm:gap-2">
              {(() => {
                const maxVisiblePages = 5;
                const halfVisible = Math.floor(maxVisiblePages / 2);

                let startPage = Math.max(1, page - halfVisible);
                let endPage = Math.min(
                  pageCount,
                  startPage + maxVisiblePages - 1
                );

                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                const pages = [];
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-sm sm:text-base transition-colors ${
                        page === i
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-white text-black hover:bg-gray-50"
                      }`}
                      disabled={loading}
                      onClick={() => setPage(i)}
                    >
                      {i}
                    </button>
                  );
                }
                return pages;
              })()}
            </div>

            <button
              className="px-2 sm:px-3 py-1 sm:py-2 bg-white text-black disabled:opacity-50 hover:bg-gray-50 rounded text-sm sm:text-base transition-colors"
              disabled={page === pageCount || loading}
              onClick={() => setPage(page + 1)}
            >
              &raquo;
            </button>

            <button
              className="px-2 sm:px-3 py-1 sm:py-2 bg-white text-black disabled:opacity-50 font-bold hover:bg-gray-50 rounded text-sm sm:text-base transition-colors"
              disabled={page === pageCount || loading}
              onClick={() => setPage(pageCount)}
            >
              &raquo;&raquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaList;
