// ============================================
// API Service - TÃ¡ÂºÂ­p trung tÃ¡ÂºÂ¥t cÃ¡ÂºÂ£ API calls
// ============================================

import { API_BASE_URL, CDN_FALLBACK, REVALIDATE_TIME } from '@/constants/config';

/**
 * Fetch mÃ¡Â»â„¢t trang tÃ¡Â»Â« endpoint
 * @param {string} endpoint - Ã„ÂÃ†Â°Ã¡Â»Âng dÃ¡ÂºÂ«n API (VD: '/danh-sach/phim-bo')
 * @param {number} page - SÃ¡Â»â€˜ trang
 * @param {object} options - Fetch options bÃ¡Â»â€¢ sung (signal, cache...)
 * @returns {object|null} JSON data hoÃ¡ÂºÂ·c null nÃ¡ÂºÂ¿u lÃ¡Â»â€”i
 */
async function fetchPage(endpoint, page = 1, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}?page=${page}`;
    const res = await fetch(url, options);
    if (!res.ok) return null;

    const json = await res.json();
    if (json.status !== 'success' || !json.data?.items?.length) return null;
    return json;
  } catch {
    return null;
  }
}

/**
 * Fetch nhiÃ¡Â»Âu trang vÃƒÂ  gÃ¡Â»â„¢p kÃ¡ÂºÂ¿t quÃ¡ÂºÂ£ (loÃ¡ÂºÂ¡i bÃ¡Â»Â trÃƒÂ¹ng lÃ¡ÂºÂ·p)
 * @param {string} endpoint - Ã„ÂÃ†Â°Ã¡Â»Âng dÃ¡ÂºÂ«n API
 * @param {number} maxPages - SÃ¡Â»â€˜ trang tÃ¡Â»â€˜i Ã„â€˜a
 * @param {object} options - Fetch options bÃ¡Â»â€¢ sung
 * @returns {{ movies: Array, cdnUrl: string, title: string }}
 */
export async function fetchMultiplePages(endpoint, maxPages = 3, options = {}) {
  const seenIds = new Set();
  let allMovies = [];
  let cdnUrl = '';
  let title = '';

  // Fetch trang 1 trÃ†Â°Ã¡Â»â€ºc
  const firstJson = await fetchPage(endpoint, 1, options);
  if (!firstJson) return { movies: [], cdnUrl: CDN_FALLBACK, title: '' };

  const firstItems = (firstJson.data.items || []).filter(m => {
    if (!m._id || !m.name || seenIds.has(m._id)) return false;
    seenIds.add(m._id);
    return true;
  });

  cdnUrl = firstJson.data.APP_DOMAIN_CDN_IMAGE || CDN_FALLBACK;
  title = firstJson.data.titlePage || firstJson.data.seoOnPage?.titleHead || '';
  allMovies = firstItems;

  // Fetch cÃƒÂ¡c trang cÃƒÂ²n lÃ¡ÂºÂ¡i song song
  if (maxPages > 1) {
    const pageNumbers = Array.from({ length: maxPages - 1 }, (_, i) => i + 2);
    const results = await Promise.allSettled(
      pageNumbers.map(p => fetchPage(endpoint, p, options))
    );

    for (const result of results) {
      if (result.status !== 'fulfilled' || !result.value) continue;
      const items = (result.value.data.items || []).filter(m => {
        if (!m._id || !m.name || seenIds.has(m._id)) return false;
        seenIds.add(m._id);
        return true;
      });
      allMovies.push(...items);
    }
  }

  return { movies: allMovies, cdnUrl, title };
}

/**
 * Fetch dÃ¡Â»Â¯ liÃ¡Â»â€¡u trang chÃ¡Â»Â§ (home)
 */
export async function fetchHomeData() {
  try {
    const res = await fetch(`${API_BASE_URL}/home`);
    const json = await res.json();

    if (json.status === 'success') {
      return {
        movies: json.data.items || [],
        cdnUrl: json.data.APP_DOMAIN_CDN_IMAGE || CDN_FALLBACK,
      };
    }
  } catch (err) {
    console.error('LÃ¡Â»â€”i fetch home data:', err);
  }
  return { movies: [], cdnUrl: CDN_FALLBACK };
}

/**
 * Fetch danh sÃƒÂ¡ch phim theo loÃ¡ÂºÂ¡i (phim-bo, phim-le, phim-chieu-rap, hoat-hinh...)
 * @param {string} slug - Slug danh sÃƒÂ¡ch
 * @param {number} page - Trang cÃ¡ÂºÂ§n fetch
 */
export async function fetchMovieList(slug, page = 1) {
  try {
    const res = await fetch(`${API_BASE_URL}/danh-sach/${slug}?page=${page}`);
    const json = await res.json();

    if (json.status === 'success') {
      return {
        movies: json.data.items || [],
        cdnUrl: json.data.APP_DOMAIN_CDN_IMAGE || CDN_FALLBACK,
      };
    }
  } catch (err) {
    console.error(`LÃ¡Â»â€”i fetch danh sÃƒÂ¡ch ${slug}:`, err);
  }
  return { movies: [], cdnUrl: CDN_FALLBACK };
}

/**
 * Fetch chi tiÃ¡ÂºÂ¿t phim theo slug
 * @param {string} slug - Slug phim
 * @param {object} options - Fetch options
 */
export async function fetchMovieDetail(slug, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/phim/${slug}`, options);
    const json = await res.json();

    if (json.status === true || json.status === 'success') {
      const item = json.movie || json.data?.item;
      const episodes = json.episodes || item?.episodes || [];
      const cdnUrl = json.data?.APP_DOMAIN_CDN_IMAGE || CDN_FALLBACK;

      return { movie: item, episodes, cdnUrl };
    }
  } catch (err) {
    console.error(`LÃ¡Â»â€”i fetch phim ${slug}:`, err);
  }
  return { movie: null, episodes: [], cdnUrl: CDN_FALLBACK };
}

/**
 * Fetch phim theo thÃ¡Â»Æ’ loÃ¡ÂºÂ¡i (Server Component)
 * @param {string} slug - Slug thÃ¡Â»Æ’ loÃ¡ÂºÂ¡i
 * @param {number} maxPages - SÃ¡Â»â€˜ trang tÃ¡Â»â€˜i Ã„â€˜a
 */
export async function fetchByGenre(slug, maxPages = 3) {
  return fetchMultiplePages(`/the-loai/${slug}`, maxPages, {
    next: { revalidate: REVALIDATE_TIME },
  });
}

/**
 * Fetch phim theo quÃ¡Â»â€˜c gia (Server Component)
 * @param {string} slug - Slug quÃ¡Â»â€˜c gia
 * @param {number} maxPages - SÃ¡Â»â€˜ trang tÃ¡Â»â€˜i Ã„â€˜a
 */
export async function fetchByCountry(slug, maxPages = 3) {
  return fetchMultiplePages(`/quoc-gia/${slug}`, maxPages, {
    next: { revalidate: REVALIDATE_TIME },
  });
}

/**
 * TÃƒÂ¬m kiÃ¡ÂºÂ¿m phim (Server Component)
 * @param {string} keyword - TÃ¡Â»Â« khÃƒÂ³a tÃƒÂ¬m kiÃ¡ÂºÂ¿m
 * @param {number} maxPages - SÃ¡Â»â€˜ trang tÃ¡Â»â€˜i Ã„â€˜a
 */
export async function searchMovies(keyword, maxPages = 3) {
  const seenIds = new Set();
  let allMovies = [];
  let cdnUrl = CDN_FALLBACK;

  for (let page = 1; page <= maxPages; page++) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`,
        { next: { revalidate: REVALIDATE_TIME } }
      );
      const json = await res.json();

      if (json.status === 'success') {
        const items = (json.data.items || []).filter(m => {
          if (!m._id || seenIds.has(m._id)) return false;
          seenIds.add(m._id);
          return true;
        });
        allMovies.push(...items);
        cdnUrl = json.data.APP_DOMAIN_CDN_IMAGE || cdnUrl;
      }
    } catch {
      break;
    }
  }

  return { movies: allMovies, cdnUrl };
}



