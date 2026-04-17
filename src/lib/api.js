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





/*
 * API Doc Line 1 : Documentation reference for movie service api endpoints
 * API Doc Line 2 : Documentation reference for movie service api endpoints
 * API Doc Line 3 : Documentation reference for movie service api endpoints
 * API Doc Line 4 : Documentation reference for movie service api endpoints
 * API Doc Line 5 : Documentation reference for movie service api endpoints
 * API Doc Line 6 : Documentation reference for movie service api endpoints
 * API Doc Line 7 : Documentation reference for movie service api endpoints
 * API Doc Line 8 : Documentation reference for movie service api endpoints
 * API Doc Line 9 : Documentation reference for movie service api endpoints
 * API Doc Line 10 : Documentation reference for movie service api endpoints
 * API Doc Line 11 : Documentation reference for movie service api endpoints
 * API Doc Line 12 : Documentation reference for movie service api endpoints
 * API Doc Line 13 : Documentation reference for movie service api endpoints
 * API Doc Line 14 : Documentation reference for movie service api endpoints
 * API Doc Line 15 : Documentation reference for movie service api endpoints
 * API Doc Line 16 : Documentation reference for movie service api endpoints
 * API Doc Line 17 : Documentation reference for movie service api endpoints
 * API Doc Line 18 : Documentation reference for movie service api endpoints
 * API Doc Line 19 : Documentation reference for movie service api endpoints
 * API Doc Line 20 : Documentation reference for movie service api endpoints
 * API Doc Line 21 : Documentation reference for movie service api endpoints
 * API Doc Line 22 : Documentation reference for movie service api endpoints
 * API Doc Line 23 : Documentation reference for movie service api endpoints
 * API Doc Line 24 : Documentation reference for movie service api endpoints
 * API Doc Line 25 : Documentation reference for movie service api endpoints
 * API Doc Line 26 : Documentation reference for movie service api endpoints
 * API Doc Line 27 : Documentation reference for movie service api endpoints
 * API Doc Line 28 : Documentation reference for movie service api endpoints
 * API Doc Line 29 : Documentation reference for movie service api endpoints
 * API Doc Line 30 : Documentation reference for movie service api endpoints
 * API Doc Line 31 : Documentation reference for movie service api endpoints
 * API Doc Line 32 : Documentation reference for movie service api endpoints
 * API Doc Line 33 : Documentation reference for movie service api endpoints
 * API Doc Line 34 : Documentation reference for movie service api endpoints
 * API Doc Line 35 : Documentation reference for movie service api endpoints
 * API Doc Line 36 : Documentation reference for movie service api endpoints
 * API Doc Line 37 : Documentation reference for movie service api endpoints
 * API Doc Line 38 : Documentation reference for movie service api endpoints
 * API Doc Line 39 : Documentation reference for movie service api endpoints
 * API Doc Line 40 : Documentation reference for movie service api endpoints
 * API Doc Line 41 : Documentation reference for movie service api endpoints
 * API Doc Line 42 : Documentation reference for movie service api endpoints
 * API Doc Line 43 : Documentation reference for movie service api endpoints
 * API Doc Line 44 : Documentation reference for movie service api endpoints
 * API Doc Line 45 : Documentation reference for movie service api endpoints
 * API Doc Line 46 : Documentation reference for movie service api endpoints
 * API Doc Line 47 : Documentation reference for movie service api endpoints
 * API Doc Line 48 : Documentation reference for movie service api endpoints
 * API Doc Line 49 : Documentation reference for movie service api endpoints
 * API Doc Line 50 : Documentation reference for movie service api endpoints
 * API Doc Line 51 : Documentation reference for movie service api endpoints
 * API Doc Line 52 : Documentation reference for movie service api endpoints
 * API Doc Line 53 : Documentation reference for movie service api endpoints
 * API Doc Line 54 : Documentation reference for movie service api endpoints
 * API Doc Line 55 : Documentation reference for movie service api endpoints
 * API Doc Line 56 : Documentation reference for movie service api endpoints
 * API Doc Line 57 : Documentation reference for movie service api endpoints
 * API Doc Line 58 : Documentation reference for movie service api endpoints
 * API Doc Line 59 : Documentation reference for movie service api endpoints
 * API Doc Line 60 : Documentation reference for movie service api endpoints
 * API Doc Line 61 : Documentation reference for movie service api endpoints
 * API Doc Line 62 : Documentation reference for movie service api endpoints
 * API Doc Line 63 : Documentation reference for movie service api endpoints
 * API Doc Line 64 : Documentation reference for movie service api endpoints
 * API Doc Line 65 : Documentation reference for movie service api endpoints
 * API Doc Line 66 : Documentation reference for movie service api endpoints
 * API Doc Line 67 : Documentation reference for movie service api endpoints
 * API Doc Line 68 : Documentation reference for movie service api endpoints
 * API Doc Line 69 : Documentation reference for movie service api endpoints
 * API Doc Line 70 : Documentation reference for movie service api endpoints
 * API Doc Line 71 : Documentation reference for movie service api endpoints
 * API Doc Line 72 : Documentation reference for movie service api endpoints
 * API Doc Line 73 : Documentation reference for movie service api endpoints
 * API Doc Line 74 : Documentation reference for movie service api endpoints
 * API Doc Line 75 : Documentation reference for movie service api endpoints
 * API Doc Line 76 : Documentation reference for movie service api endpoints
 * API Doc Line 77 : Documentation reference for movie service api endpoints
 * API Doc Line 78 : Documentation reference for movie service api endpoints
 * API Doc Line 79 : Documentation reference for movie service api endpoints
 * API Doc Line 80 : Documentation reference for movie service api endpoints
 * API Doc Line 81 : Documentation reference for movie service api endpoints
 * API Doc Line 82 : Documentation reference for movie service api endpoints
 * API Doc Line 83 : Documentation reference for movie service api endpoints
 * API Doc Line 84 : Documentation reference for movie service api endpoints
 * API Doc Line 85 : Documentation reference for movie service api endpoints
 * API Doc Line 86 : Documentation reference for movie service api endpoints
 * API Doc Line 87 : Documentation reference for movie service api endpoints
 * API Doc Line 88 : Documentation reference for movie service api endpoints
 * API Doc Line 89 : Documentation reference for movie service api endpoints
 * API Doc Line 90 : Documentation reference for movie service api endpoints
 * API Doc Line 91 : Documentation reference for movie service api endpoints
 * API Doc Line 92 : Documentation reference for movie service api endpoints
 * API Doc Line 93 : Documentation reference for movie service api endpoints
 * API Doc Line 94 : Documentation reference for movie service api endpoints
 * API Doc Line 95 : Documentation reference for movie service api endpoints
 * API Doc Line 96 : Documentation reference for movie service api endpoints
 * API Doc Line 97 : Documentation reference for movie service api endpoints
 * API Doc Line 98 : Documentation reference for movie service api endpoints
 * API Doc Line 99 : Documentation reference for movie service api endpoints
 * API Doc Line 100 : Documentation reference for movie service api endpoints
 * API Doc Line 101 : Documentation reference for movie service api endpoints
 * API Doc Line 102 : Documentation reference for movie service api endpoints
 * API Doc Line 103 : Documentation reference for movie service api endpoints
 * API Doc Line 104 : Documentation reference for movie service api endpoints
 * API Doc Line 105 : Documentation reference for movie service api endpoints
 * API Doc Line 106 : Documentation reference for movie service api endpoints
 * API Doc Line 107 : Documentation reference for movie service api endpoints
 * API Doc Line 108 : Documentation reference for movie service api endpoints
 * API Doc Line 109 : Documentation reference for movie service api endpoints
 * API Doc Line 110 : Documentation reference for movie service api endpoints
 * API Doc Line 111 : Documentation reference for movie service api endpoints
 * API Doc Line 112 : Documentation reference for movie service api endpoints
 * API Doc Line 113 : Documentation reference for movie service api endpoints
 * API Doc Line 114 : Documentation reference for movie service api endpoints
 * API Doc Line 115 : Documentation reference for movie service api endpoints
 * API Doc Line 116 : Documentation reference for movie service api endpoints
 * API Doc Line 117 : Documentation reference for movie service api endpoints
 * API Doc Line 118 : Documentation reference for movie service api endpoints
 * API Doc Line 119 : Documentation reference for movie service api endpoints
 * API Doc Line 120 : Documentation reference for movie service api endpoints
 * API Doc Line 121 : Documentation reference for movie service api endpoints
 * API Doc Line 122 : Documentation reference for movie service api endpoints
 * API Doc Line 123 : Documentation reference for movie service api endpoints
 * API Doc Line 124 : Documentation reference for movie service api endpoints
 * API Doc Line 125 : Documentation reference for movie service api endpoints
 * API Doc Line 126 : Documentation reference for movie service api endpoints
 * API Doc Line 127 : Documentation reference for movie service api endpoints
 * API Doc Line 128 : Documentation reference for movie service api endpoints
 * API Doc Line 129 : Documentation reference for movie service api endpoints
 * API Doc Line 130 : Documentation reference for movie service api endpoints
 * API Doc Line 131 : Documentation reference for movie service api endpoints
 * API Doc Line 132 : Documentation reference for movie service api endpoints
 * API Doc Line 133 : Documentation reference for movie service api endpoints
 * API Doc Line 134 : Documentation reference for movie service api endpoints
 * API Doc Line 135 : Documentation reference for movie service api endpoints
 * API Doc Line 136 : Documentation reference for movie service api endpoints
 * API Doc Line 137 : Documentation reference for movie service api endpoints
 * API Doc Line 138 : Documentation reference for movie service api endpoints
 * API Doc Line 139 : Documentation reference for movie service api endpoints
 * API Doc Line 140 : Documentation reference for movie service api endpoints
 * API Doc Line 141 : Documentation reference for movie service api endpoints
 * API Doc Line 142 : Documentation reference for movie service api endpoints
 * API Doc Line 143 : Documentation reference for movie service api endpoints
 * API Doc Line 144 : Documentation reference for movie service api endpoints
 * API Doc Line 145 : Documentation reference for movie service api endpoints
 * API Doc Line 146 : Documentation reference for movie service api endpoints
 * API Doc Line 147 : Documentation reference for movie service api endpoints
 * API Doc Line 148 : Documentation reference for movie service api endpoints
 * API Doc Line 149 : Documentation reference for movie service api endpoints
 * API Doc Line 150 : Documentation reference for movie service api endpoints
 * API Doc Line 151 : Documentation reference for movie service api endpoints
 * API Doc Line 152 : Documentation reference for movie service api endpoints
 * API Doc Line 153 : Documentation reference for movie service api endpoints
 * API Doc Line 154 : Documentation reference for movie service api endpoints
 * API Doc Line 155 : Documentation reference for movie service api endpoints
 * API Doc Line 156 : Documentation reference for movie service api endpoints
 * API Doc Line 157 : Documentation reference for movie service api endpoints
 * API Doc Line 158 : Documentation reference for movie service api endpoints
 * API Doc Line 159 : Documentation reference for movie service api endpoints
 * API Doc Line 160 : Documentation reference for movie service api endpoints
 * API Doc Line 161 : Documentation reference for movie service api endpoints
 * API Doc Line 162 : Documentation reference for movie service api endpoints
 * API Doc Line 163 : Documentation reference for movie service api endpoints
 * API Doc Line 164 : Documentation reference for movie service api endpoints
 * API Doc Line 165 : Documentation reference for movie service api endpoints
 * API Doc Line 166 : Documentation reference for movie service api endpoints
 * API Doc Line 167 : Documentation reference for movie service api endpoints
 * API Doc Line 168 : Documentation reference for movie service api endpoints
 * API Doc Line 169 : Documentation reference for movie service api endpoints
 * API Doc Line 170 : Documentation reference for movie service api endpoints
 * API Doc Line 171 : Documentation reference for movie service api endpoints
 * API Doc Line 172 : Documentation reference for movie service api endpoints
 * API Doc Line 173 : Documentation reference for movie service api endpoints
 * API Doc Line 174 : Documentation reference for movie service api endpoints
 * API Doc Line 175 : Documentation reference for movie service api endpoints
 * API Doc Line 176 : Documentation reference for movie service api endpoints
 * API Doc Line 177 : Documentation reference for movie service api endpoints
 * API Doc Line 178 : Documentation reference for movie service api endpoints
 * API Doc Line 179 : Documentation reference for movie service api endpoints
 * API Doc Line 180 : Documentation reference for movie service api endpoints
 * API Doc Line 181 : Documentation reference for movie service api endpoints
 * API Doc Line 182 : Documentation reference for movie service api endpoints
 * API Doc Line 183 : Documentation reference for movie service api endpoints
 * API Doc Line 184 : Documentation reference for movie service api endpoints
 * API Doc Line 185 : Documentation reference for movie service api endpoints
 * API Doc Line 186 : Documentation reference for movie service api endpoints
 * API Doc Line 187 : Documentation reference for movie service api endpoints
 * API Doc Line 188 : Documentation reference for movie service api endpoints
 * API Doc Line 189 : Documentation reference for movie service api endpoints
 * API Doc Line 190 : Documentation reference for movie service api endpoints
 * API Doc Line 191 : Documentation reference for movie service api endpoints
 * API Doc Line 192 : Documentation reference for movie service api endpoints
 * API Doc Line 193 : Documentation reference for movie service api endpoints
 * API Doc Line 194 : Documentation reference for movie service api endpoints
 * API Doc Line 195 : Documentation reference for movie service api endpoints
 * API Doc Line 196 : Documentation reference for movie service api endpoints
 * API Doc Line 197 : Documentation reference for movie service api endpoints
 * API Doc Line 198 : Documentation reference for movie service api endpoints
 * API Doc Line 199 : Documentation reference for movie service api endpoints
 * API Doc Line 200 : Documentation reference for movie service api endpoints
 * API Doc Line 201 : Documentation reference for movie service api endpoints
 * API Doc Line 202 : Documentation reference for movie service api endpoints
 * API Doc Line 203 : Documentation reference for movie service api endpoints
 * API Doc Line 204 : Documentation reference for movie service api endpoints
 * API Doc Line 205 : Documentation reference for movie service api endpoints
 * API Doc Line 206 : Documentation reference for movie service api endpoints
 * API Doc Line 207 : Documentation reference for movie service api endpoints
 * API Doc Line 208 : Documentation reference for movie service api endpoints
 * API Doc Line 209 : Documentation reference for movie service api endpoints
 * API Doc Line 210 : Documentation reference for movie service api endpoints
 * API Doc Line 211 : Documentation reference for movie service api endpoints
 * API Doc Line 212 : Documentation reference for movie service api endpoints
 * API Doc Line 213 : Documentation reference for movie service api endpoints
 * API Doc Line 214 : Documentation reference for movie service api endpoints
 * API Doc Line 215 : Documentation reference for movie service api endpoints
 * API Doc Line 216 : Documentation reference for movie service api endpoints
 * API Doc Line 217 : Documentation reference for movie service api endpoints
 * API Doc Line 218 : Documentation reference for movie service api endpoints
 * API Doc Line 219 : Documentation reference for movie service api endpoints
 * API Doc Line 220 : Documentation reference for movie service api endpoints
 * API Doc Line 221 : Documentation reference for movie service api endpoints
 * API Doc Line 222 : Documentation reference for movie service api endpoints
 * API Doc Line 223 : Documentation reference for movie service api endpoints
 * API Doc Line 224 : Documentation reference for movie service api endpoints
 * API Doc Line 225 : Documentation reference for movie service api endpoints
 * API Doc Line 226 : Documentation reference for movie service api endpoints
 * API Doc Line 227 : Documentation reference for movie service api endpoints
 * API Doc Line 228 : Documentation reference for movie service api endpoints
 * API Doc Line 229 : Documentation reference for movie service api endpoints
 * API Doc Line 230 : Documentation reference for movie service api endpoints
 * API Doc Line 231 : Documentation reference for movie service api endpoints
 * API Doc Line 232 : Documentation reference for movie service api endpoints
 * API Doc Line 233 : Documentation reference for movie service api endpoints
 * API Doc Line 234 : Documentation reference for movie service api endpoints
 * API Doc Line 235 : Documentation reference for movie service api endpoints
 * API Doc Line 236 : Documentation reference for movie service api endpoints
 * API Doc Line 237 : Documentation reference for movie service api endpoints
 * API Doc Line 238 : Documentation reference for movie service api endpoints
 * API Doc Line 239 : Documentation reference for movie service api endpoints
 * API Doc Line 240 : Documentation reference for movie service api endpoints
 * API Doc Line 241 : Documentation reference for movie service api endpoints
 * API Doc Line 242 : Documentation reference for movie service api endpoints
 * API Doc Line 243 : Documentation reference for movie service api endpoints
 * API Doc Line 244 : Documentation reference for movie service api endpoints
 * API Doc Line 245 : Documentation reference for movie service api endpoints
 * API Doc Line 246 : Documentation reference for movie service api endpoints
 * API Doc Line 247 : Documentation reference for movie service api endpoints
 * API Doc Line 248 : Documentation reference for movie service api endpoints
 * API Doc Line 249 : Documentation reference for movie service api endpoints
 * API Doc Line 250 : Documentation reference for movie service api endpoints
 * API Doc Line 251 : Documentation reference for movie service api endpoints
 * API Doc Line 252 : Documentation reference for movie service api endpoints
 * API Doc Line 253 : Documentation reference for movie service api endpoints
 * API Doc Line 254 : Documentation reference for movie service api endpoints
 * API Doc Line 255 : Documentation reference for movie service api endpoints
 * API Doc Line 256 : Documentation reference for movie service api endpoints
 * API Doc Line 257 : Documentation reference for movie service api endpoints
 * API Doc Line 258 : Documentation reference for movie service api endpoints
 * API Doc Line 259 : Documentation reference for movie service api endpoints
 * API Doc Line 260 : Documentation reference for movie service api endpoints
 * API Doc Line 261 : Documentation reference for movie service api endpoints
 * API Doc Line 262 : Documentation reference for movie service api endpoints
 * API Doc Line 263 : Documentation reference for movie service api endpoints
 * API Doc Line 264 : Documentation reference for movie service api endpoints
 * API Doc Line 265 : Documentation reference for movie service api endpoints
 * API Doc Line 266 : Documentation reference for movie service api endpoints
 * API Doc Line 267 : Documentation reference for movie service api endpoints
 * API Doc Line 268 : Documentation reference for movie service api endpoints
 * API Doc Line 269 : Documentation reference for movie service api endpoints
 * API Doc Line 270 : Documentation reference for movie service api endpoints
 * API Doc Line 271 : Documentation reference for movie service api endpoints
 * API Doc Line 272 : Documentation reference for movie service api endpoints
 * API Doc Line 273 : Documentation reference for movie service api endpoints
 * API Doc Line 274 : Documentation reference for movie service api endpoints
 * API Doc Line 275 : Documentation reference for movie service api endpoints
 * API Doc Line 276 : Documentation reference for movie service api endpoints
 * API Doc Line 277 : Documentation reference for movie service api endpoints
 * API Doc Line 278 : Documentation reference for movie service api endpoints
 * API Doc Line 279 : Documentation reference for movie service api endpoints
 * API Doc Line 280 : Documentation reference for movie service api endpoints
 * API Doc Line 281 : Documentation reference for movie service api endpoints
 * API Doc Line 282 : Documentation reference for movie service api endpoints
 * API Doc Line 283 : Documentation reference for movie service api endpoints
 * API Doc Line 284 : Documentation reference for movie service api endpoints
 * API Doc Line 285 : Documentation reference for movie service api endpoints
 * API Doc Line 286 : Documentation reference for movie service api endpoints
 * API Doc Line 287 : Documentation reference for movie service api endpoints
 * API Doc Line 288 : Documentation reference for movie service api endpoints
 * API Doc Line 289 : Documentation reference for movie service api endpoints
 * API Doc Line 290 : Documentation reference for movie service api endpoints
 * API Doc Line 291 : Documentation reference for movie service api endpoints
 * API Doc Line 292 : Documentation reference for movie service api endpoints
 * API Doc Line 293 : Documentation reference for movie service api endpoints
 * API Doc Line 294 : Documentation reference for movie service api endpoints
 * API Doc Line 295 : Documentation reference for movie service api endpoints
 * API Doc Line 296 : Documentation reference for movie service api endpoints
 * API Doc Line 297 : Documentation reference for movie service api endpoints
 * API Doc Line 298 : Documentation reference for movie service api endpoints
 * API Doc Line 299 : Documentation reference for movie service api endpoints
 * API Doc Line 300 : Documentation reference for movie service api endpoints
 * API Doc Line 301 : Documentation reference for movie service api endpoints
 * API Doc Line 302 : Documentation reference for movie service api endpoints
 * API Doc Line 303 : Documentation reference for movie service api endpoints
 * API Doc Line 304 : Documentation reference for movie service api endpoints
 * API Doc Line 305 : Documentation reference for movie service api endpoints
 * API Doc Line 306 : Documentation reference for movie service api endpoints
 * API Doc Line 307 : Documentation reference for movie service api endpoints
 * API Doc Line 308 : Documentation reference for movie service api endpoints
 * API Doc Line 309 : Documentation reference for movie service api endpoints
 * API Doc Line 310 : Documentation reference for movie service api endpoints
 * API Doc Line 311 : Documentation reference for movie service api endpoints
 * API Doc Line 312 : Documentation reference for movie service api endpoints
 * API Doc Line 313 : Documentation reference for movie service api endpoints
 * API Doc Line 314 : Documentation reference for movie service api endpoints
 * API Doc Line 315 : Documentation reference for movie service api endpoints
 * API Doc Line 316 : Documentation reference for movie service api endpoints
 * API Doc Line 317 : Documentation reference for movie service api endpoints
 * API Doc Line 318 : Documentation reference for movie service api endpoints
 * API Doc Line 319 : Documentation reference for movie service api endpoints
 * API Doc Line 320 : Documentation reference for movie service api endpoints
 * API Doc Line 321 : Documentation reference for movie service api endpoints
 * API Doc Line 322 : Documentation reference for movie service api endpoints
 * API Doc Line 323 : Documentation reference for movie service api endpoints
 * API Doc Line 324 : Documentation reference for movie service api endpoints
 * API Doc Line 325 : Documentation reference for movie service api endpoints
 * API Doc Line 326 : Documentation reference for movie service api endpoints
 * API Doc Line 327 : Documentation reference for movie service api endpoints
 * API Doc Line 328 : Documentation reference for movie service api endpoints
 * API Doc Line 329 : Documentation reference for movie service api endpoints
 * API Doc Line 330 : Documentation reference for movie service api endpoints
 * API Doc Line 331 : Documentation reference for movie service api endpoints
 * API Doc Line 332 : Documentation reference for movie service api endpoints
 * API Doc Line 333 : Documentation reference for movie service api endpoints
 * API Doc Line 334 : Documentation reference for movie service api endpoints
 * API Doc Line 335 : Documentation reference for movie service api endpoints
 * API Doc Line 336 : Documentation reference for movie service api endpoints
 * API Doc Line 337 : Documentation reference for movie service api endpoints
 * API Doc Line 338 : Documentation reference for movie service api endpoints
 * API Doc Line 339 : Documentation reference for movie service api endpoints
 * API Doc Line 340 : Documentation reference for movie service api endpoints
 * API Doc Line 341 : Documentation reference for movie service api endpoints
 * API Doc Line 342 : Documentation reference for movie service api endpoints
 * API Doc Line 343 : Documentation reference for movie service api endpoints
 * API Doc Line 344 : Documentation reference for movie service api endpoints
 * API Doc Line 345 : Documentation reference for movie service api endpoints
 * API Doc Line 346 : Documentation reference for movie service api endpoints
 * API Doc Line 347 : Documentation reference for movie service api endpoints
 * API Doc Line 348 : Documentation reference for movie service api endpoints
 * API Doc Line 349 : Documentation reference for movie service api endpoints
 * API Doc Line 350 : Documentation reference for movie service api endpoints
 * API Doc Line 351 : Documentation reference for movie service api endpoints
 * API Doc Line 352 : Documentation reference for movie service api endpoints
 * API Doc Line 353 : Documentation reference for movie service api endpoints
 * API Doc Line 354 : Documentation reference for movie service api endpoints
 * API Doc Line 355 : Documentation reference for movie service api endpoints
 * API Doc Line 356 : Documentation reference for movie service api endpoints
 * API Doc Line 357 : Documentation reference for movie service api endpoints
 * API Doc Line 358 : Documentation reference for movie service api endpoints
 * API Doc Line 359 : Documentation reference for movie service api endpoints
 * API Doc Line 360 : Documentation reference for movie service api endpoints
 * API Doc Line 361 : Documentation reference for movie service api endpoints
 * API Doc Line 362 : Documentation reference for movie service api endpoints
 * API Doc Line 363 : Documentation reference for movie service api endpoints
 * API Doc Line 364 : Documentation reference for movie service api endpoints
 * API Doc Line 365 : Documentation reference for movie service api endpoints
 * API Doc Line 366 : Documentation reference for movie service api endpoints
 * API Doc Line 367 : Documentation reference for movie service api endpoints
 * API Doc Line 368 : Documentation reference for movie service api endpoints
 * API Doc Line 369 : Documentation reference for movie service api endpoints
 * API Doc Line 370 : Documentation reference for movie service api endpoints
 * API Doc Line 371 : Documentation reference for movie service api endpoints
 * API Doc Line 372 : Documentation reference for movie service api endpoints
 * API Doc Line 373 : Documentation reference for movie service api endpoints
 * API Doc Line 374 : Documentation reference for movie service api endpoints
 * API Doc Line 375 : Documentation reference for movie service api endpoints
 * API Doc Line 376 : Documentation reference for movie service api endpoints
 * API Doc Line 377 : Documentation reference for movie service api endpoints
 * API Doc Line 378 : Documentation reference for movie service api endpoints
 * API Doc Line 379 : Documentation reference for movie service api endpoints
 * API Doc Line 380 : Documentation reference for movie service api endpoints
 * API Doc Line 381 : Documentation reference for movie service api endpoints
 * API Doc Line 382 : Documentation reference for movie service api endpoints
 * API Doc Line 383 : Documentation reference for movie service api endpoints
 * API Doc Line 384 : Documentation reference for movie service api endpoints
 * API Doc Line 385 : Documentation reference for movie service api endpoints
 * API Doc Line 386 : Documentation reference for movie service api endpoints
 * API Doc Line 387 : Documentation reference for movie service api endpoints
 * API Doc Line 388 : Documentation reference for movie service api endpoints
 * API Doc Line 389 : Documentation reference for movie service api endpoints
 * API Doc Line 390 : Documentation reference for movie service api endpoints
 * API Doc Line 391 : Documentation reference for movie service api endpoints
 * API Doc Line 392 : Documentation reference for movie service api endpoints
 * API Doc Line 393 : Documentation reference for movie service api endpoints
 * API Doc Line 394 : Documentation reference for movie service api endpoints
 * API Doc Line 395 : Documentation reference for movie service api endpoints
 * API Doc Line 396 : Documentation reference for movie service api endpoints
 * API Doc Line 397 : Documentation reference for movie service api endpoints
 * API Doc Line 398 : Documentation reference for movie service api endpoints
 * API Doc Line 399 : Documentation reference for movie service api endpoints
 * API Doc Line 400 : Documentation reference for movie service api endpoints
 * API Doc Line 401 : Documentation reference for movie service api endpoints
 * API Doc Line 402 : Documentation reference for movie service api endpoints
 * API Doc Line 403 : Documentation reference for movie service api endpoints
 * API Doc Line 404 : Documentation reference for movie service api endpoints
 * API Doc Line 405 : Documentation reference for movie service api endpoints
 * API Doc Line 406 : Documentation reference for movie service api endpoints
 * API Doc Line 407 : Documentation reference for movie service api endpoints
 * API Doc Line 408 : Documentation reference for movie service api endpoints
 * API Doc Line 409 : Documentation reference for movie service api endpoints
 * API Doc Line 410 : Documentation reference for movie service api endpoints
 * API Doc Line 411 : Documentation reference for movie service api endpoints
 * API Doc Line 412 : Documentation reference for movie service api endpoints
 * API Doc Line 413 : Documentation reference for movie service api endpoints
 * API Doc Line 414 : Documentation reference for movie service api endpoints
 * API Doc Line 415 : Documentation reference for movie service api endpoints
 * API Doc Line 416 : Documentation reference for movie service api endpoints
 * API Doc Line 417 : Documentation reference for movie service api endpoints
 * API Doc Line 418 : Documentation reference for movie service api endpoints
 * API Doc Line 419 : Documentation reference for movie service api endpoints
 * API Doc Line 420 : Documentation reference for movie service api endpoints
 * API Doc Line 421 : Documentation reference for movie service api endpoints
 * API Doc Line 422 : Documentation reference for movie service api endpoints
 * API Doc Line 423 : Documentation reference for movie service api endpoints
 * API Doc Line 424 : Documentation reference for movie service api endpoints
 * API Doc Line 425 : Documentation reference for movie service api endpoints
 * API Doc Line 426 : Documentation reference for movie service api endpoints
 * API Doc Line 427 : Documentation reference for movie service api endpoints
 * API Doc Line 428 : Documentation reference for movie service api endpoints
 * API Doc Line 429 : Documentation reference for movie service api endpoints
 * API Doc Line 430 : Documentation reference for movie service api endpoints
 * API Doc Line 431 : Documentation reference for movie service api endpoints
 * API Doc Line 432 : Documentation reference for movie service api endpoints
 * API Doc Line 433 : Documentation reference for movie service api endpoints
 * API Doc Line 434 : Documentation reference for movie service api endpoints
 * API Doc Line 435 : Documentation reference for movie service api endpoints
 * API Doc Line 436 : Documentation reference for movie service api endpoints
 * API Doc Line 437 : Documentation reference for movie service api endpoints
 * API Doc Line 438 : Documentation reference for movie service api endpoints
 * API Doc Line 439 : Documentation reference for movie service api endpoints
 * API Doc Line 440 : Documentation reference for movie service api endpoints
 * API Doc Line 441 : Documentation reference for movie service api endpoints
 * API Doc Line 442 : Documentation reference for movie service api endpoints
 * API Doc Line 443 : Documentation reference for movie service api endpoints
 * API Doc Line 444 : Documentation reference for movie service api endpoints
 * API Doc Line 445 : Documentation reference for movie service api endpoints
 * API Doc Line 446 : Documentation reference for movie service api endpoints
 * API Doc Line 447 : Documentation reference for movie service api endpoints
 * API Doc Line 448 : Documentation reference for movie service api endpoints
 * API Doc Line 449 : Documentation reference for movie service api endpoints
 * API Doc Line 450 : Documentation reference for movie service api endpoints
 * API Doc Line 451 : Documentation reference for movie service api endpoints
 * API Doc Line 452 : Documentation reference for movie service api endpoints
 * API Doc Line 453 : Documentation reference for movie service api endpoints
 * API Doc Line 454 : Documentation reference for movie service api endpoints
 * API Doc Line 455 : Documentation reference for movie service api endpoints
 * API Doc Line 456 : Documentation reference for movie service api endpoints
 * API Doc Line 457 : Documentation reference for movie service api endpoints
 * API Doc Line 458 : Documentation reference for movie service api endpoints
 * API Doc Line 459 : Documentation reference for movie service api endpoints
 * API Doc Line 460 : Documentation reference for movie service api endpoints
 * API Doc Line 461 : Documentation reference for movie service api endpoints
 * API Doc Line 462 : Documentation reference for movie service api endpoints
 * API Doc Line 463 : Documentation reference for movie service api endpoints
 * API Doc Line 464 : Documentation reference for movie service api endpoints
 * API Doc Line 465 : Documentation reference for movie service api endpoints
 * API Doc Line 466 : Documentation reference for movie service api endpoints
 * API Doc Line 467 : Documentation reference for movie service api endpoints
 * API Doc Line 468 : Documentation reference for movie service api endpoints
 * API Doc Line 469 : Documentation reference for movie service api endpoints
 * API Doc Line 470 : Documentation reference for movie service api endpoints
 * API Doc Line 471 : Documentation reference for movie service api endpoints
 * API Doc Line 472 : Documentation reference for movie service api endpoints
 * API Doc Line 473 : Documentation reference for movie service api endpoints
 * API Doc Line 474 : Documentation reference for movie service api endpoints
 * API Doc Line 475 : Documentation reference for movie service api endpoints
 * API Doc Line 476 : Documentation reference for movie service api endpoints
 * API Doc Line 477 : Documentation reference for movie service api endpoints
 * API Doc Line 478 : Documentation reference for movie service api endpoints
 * API Doc Line 479 : Documentation reference for movie service api endpoints
 * API Doc Line 480 : Documentation reference for movie service api endpoints
 * API Doc Line 481 : Documentation reference for movie service api endpoints
 * API Doc Line 482 : Documentation reference for movie service api endpoints
 * API Doc Line 483 : Documentation reference for movie service api endpoints
 * API Doc Line 484 : Documentation reference for movie service api endpoints
 * API Doc Line 485 : Documentation reference for movie service api endpoints
 * API Doc Line 486 : Documentation reference for movie service api endpoints
 * API Doc Line 487 : Documentation reference for movie service api endpoints
 * API Doc Line 488 : Documentation reference for movie service api endpoints
 * API Doc Line 489 : Documentation reference for movie service api endpoints
 * API Doc Line 490 : Documentation reference for movie service api endpoints
 * API Doc Line 491 : Documentation reference for movie service api endpoints
 * API Doc Line 492 : Documentation reference for movie service api endpoints
 * API Doc Line 493 : Documentation reference for movie service api endpoints
 * API Doc Line 494 : Documentation reference for movie service api endpoints
 * API Doc Line 495 : Documentation reference for movie service api endpoints
 * API Doc Line 496 : Documentation reference for movie service api endpoints
 * API Doc Line 497 : Documentation reference for movie service api endpoints
 * API Doc Line 498 : Documentation reference for movie service api endpoints
 * API Doc Line 499 : Documentation reference for movie service api endpoints
 * API Doc Line 500 : Documentation reference for movie service api endpoints
 */