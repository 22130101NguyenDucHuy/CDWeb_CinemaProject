// ============================================
// CÃƒÂ¡c hÃƒÂ m tiÃ¡Â»â€¡n ÃƒÂ­ch dÃƒÂ¹ng chung
// ============================================

import { CDN_FALLBACK } from '@/constants/config';

/**
 * ChuyÃ¡Â»Æ’n chuÃ¡Â»â€”i tiÃ¡ÂºÂ¿ng ViÃ¡Â»â€¡t thÃƒÂ nh slug URL
 * @param {string} str - ChuÃ¡Â»â€”i cÃ¡ÂºÂ§n chuyÃ¡Â»Æ’n
 * @returns {string} slug
 */
export function generateSlug(str) {
  str = str.toLowerCase();
  str = str.replace(/(ÃƒÂ |ÃƒÂ¡|Ã¡ÂºÂ¡|Ã¡ÂºÂ£|ÃƒÂ£|ÃƒÂ¢|Ã¡ÂºÂ§|Ã¡ÂºÂ¥|Ã¡ÂºÂ­|Ã¡ÂºÂ©|Ã¡ÂºÂ«|Ã„Æ’|Ã¡ÂºÂ±|Ã¡ÂºÂ¯|Ã¡ÂºÂ·|Ã¡ÂºÂ³|Ã¡ÂºÂµ)/g, 'a');
  str = str.replace(/(ÃƒÂ¨|ÃƒÂ©|Ã¡ÂºÂ¹|Ã¡ÂºÂ»|Ã¡ÂºÂ½|ÃƒÂª|Ã¡Â»Â|Ã¡ÂºÂ¿|Ã¡Â»â€¡|Ã¡Â»Æ’|Ã¡Â»â€¦)/g, 'e');
  str = str.replace(/(ÃƒÂ¬|ÃƒÂ­|Ã¡Â»â€¹|Ã¡Â»â€°|Ã„Â©)/g, 'i');
  str = str.replace(/(ÃƒÂ²|ÃƒÂ³|Ã¡Â»Â|Ã¡Â»Â|ÃƒÂµ|ÃƒÂ´|Ã¡Â»â€œ|Ã¡Â»â€˜|Ã¡Â»â„¢|Ã¡Â»â€¢|Ã¡Â»â€”|Ã†Â¡|Ã¡Â»Â|Ã¡Â»â€º|Ã¡Â»Â£|Ã¡Â»Å¸|Ã¡Â»Â¡)/g, 'o');
  str = str.replace(/(ÃƒÂ¹|ÃƒÂº|Ã¡Â»Â¥|Ã¡Â»Â§|Ã…Â©|Ã†Â°|Ã¡Â»Â«|Ã¡Â»Â©|Ã¡Â»Â±|Ã¡Â»Â­|Ã¡Â»Â¯)/g, 'u');
  str = str.replace(/(Ã¡Â»Â³|ÃƒÂ½|Ã¡Â»Âµ|Ã¡Â»Â·|Ã¡Â»Â¹)/g, 'y');
  str = str.replace(/(Ã„â€˜)/g, 'd');
  str = str.replace(/([^a-z0-9-\s])/g, '');
  str = str.replace(/(\s+)/g, '-');
  str = str.replace(/^-+/g, '');
  str = str.replace(/-+$/g, '');
  return str;
}

/**
 * ChuyÃ¡Â»Æ’n path Ã¡ÂºÂ£nh phim thÃƒÂ nh URL tuyÃ¡Â»â€¡t Ã„â€˜Ã¡Â»â€˜i
 * @param {string} path - path gÃ¡Â»â€˜c (cÃƒÂ³ thÃ¡Â»Æ’ lÃƒÂ  URL Ã„â€˜Ã¡ÂºÂ§y Ã„â€˜Ã¡Â»Â§ hoÃ¡ÂºÂ·c relative)
 * @param {string} cdnUrl - CDN URL base
 * @returns {string} URL tuyÃ¡Â»â€¡t Ã„â€˜Ã¡Â»â€˜i
 */
export function getImageUrl(path, cdnUrl) {
  if (!path) return '';
  if (String(path).startsWith('http')) return path;
  return `${cdnUrl || CDN_FALLBACK}/uploads/movies/${path}`;
}

/**
 * LÃ¡ÂºÂ¥y rating tÃ¡Â»Â« movie object (Ã†Â°u tiÃƒÂªn TMDB > IMDB)
 * @param {object} movie - Movie object tÃ¡Â»Â« API
 * @returns {number|null} Rating hoÃ¡ÂºÂ·c null
 */
export function getMovieRating(movie) {
  const tmdb = Number(movie?.tmdb?.vote_average);
  if (Number.isFinite(tmdb) && tmdb > 0) return tmdb;

  const imdb = Number(movie?.imdb?.vote_average);
  if (Number.isFinite(imdb) && imdb > 0) return imdb;

  return null;
}

/**
 * LoÃ¡ÂºÂ¡i bÃ¡Â»Â HTML tags khÃ¡Â»Âi chuÃ¡Â»â€”i
 * @param {string} html - ChuÃ¡Â»â€”i chÃ¡Â»Â©a HTML
 * @returns {string} ChuÃ¡Â»â€”i Ã„â€˜ÃƒÂ£ loÃ¡ÂºÂ¡i bÃ¡Â»Â HTML
 */
export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '');
}

/**
 * Normalize chuÃ¡Â»â€”i Ã„â€˜Ã¡Â»Æ’ so sÃƒÂ¡nh (lowercase, trim)
 * @param {*} s - GiÃƒÂ¡ trÃ¡Â»â€¹ cÃ¡ÂºÂ§n normalize
 * @returns {string} ChuÃ¡Â»â€”i Ã„â€˜ÃƒÂ£ normalize
 */
export function normalize(s) {
  return (s || '').toString().trim().toLowerCase();
}



