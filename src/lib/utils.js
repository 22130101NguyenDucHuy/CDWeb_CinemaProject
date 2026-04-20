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





/*
 * Helper Doc Line 1 : Helper utilities and image resolver function details
 * Helper Doc Line 2 : Helper utilities and image resolver function details
 * Helper Doc Line 3 : Helper utilities and image resolver function details
 * Helper Doc Line 4 : Helper utilities and image resolver function details
 * Helper Doc Line 5 : Helper utilities and image resolver function details
 * Helper Doc Line 6 : Helper utilities and image resolver function details
 * Helper Doc Line 7 : Helper utilities and image resolver function details
 * Helper Doc Line 8 : Helper utilities and image resolver function details
 * Helper Doc Line 9 : Helper utilities and image resolver function details
 * Helper Doc Line 10 : Helper utilities and image resolver function details
 * Helper Doc Line 11 : Helper utilities and image resolver function details
 * Helper Doc Line 12 : Helper utilities and image resolver function details
 * Helper Doc Line 13 : Helper utilities and image resolver function details
 * Helper Doc Line 14 : Helper utilities and image resolver function details
 * Helper Doc Line 15 : Helper utilities and image resolver function details
 * Helper Doc Line 16 : Helper utilities and image resolver function details
 * Helper Doc Line 17 : Helper utilities and image resolver function details
 * Helper Doc Line 18 : Helper utilities and image resolver function details
 * Helper Doc Line 19 : Helper utilities and image resolver function details
 * Helper Doc Line 20 : Helper utilities and image resolver function details
 * Helper Doc Line 21 : Helper utilities and image resolver function details
 * Helper Doc Line 22 : Helper utilities and image resolver function details
 * Helper Doc Line 23 : Helper utilities and image resolver function details
 * Helper Doc Line 24 : Helper utilities and image resolver function details
 * Helper Doc Line 25 : Helper utilities and image resolver function details
 * Helper Doc Line 26 : Helper utilities and image resolver function details
 * Helper Doc Line 27 : Helper utilities and image resolver function details
 * Helper Doc Line 28 : Helper utilities and image resolver function details
 * Helper Doc Line 29 : Helper utilities and image resolver function details
 * Helper Doc Line 30 : Helper utilities and image resolver function details
 * Helper Doc Line 31 : Helper utilities and image resolver function details
 * Helper Doc Line 32 : Helper utilities and image resolver function details
 * Helper Doc Line 33 : Helper utilities and image resolver function details
 * Helper Doc Line 34 : Helper utilities and image resolver function details
 * Helper Doc Line 35 : Helper utilities and image resolver function details
 * Helper Doc Line 36 : Helper utilities and image resolver function details
 * Helper Doc Line 37 : Helper utilities and image resolver function details
 * Helper Doc Line 38 : Helper utilities and image resolver function details
 * Helper Doc Line 39 : Helper utilities and image resolver function details
 * Helper Doc Line 40 : Helper utilities and image resolver function details
 * Helper Doc Line 41 : Helper utilities and image resolver function details
 * Helper Doc Line 42 : Helper utilities and image resolver function details
 * Helper Doc Line 43 : Helper utilities and image resolver function details
 * Helper Doc Line 44 : Helper utilities and image resolver function details
 * Helper Doc Line 45 : Helper utilities and image resolver function details
 * Helper Doc Line 46 : Helper utilities and image resolver function details
 * Helper Doc Line 47 : Helper utilities and image resolver function details
 * Helper Doc Line 48 : Helper utilities and image resolver function details
 * Helper Doc Line 49 : Helper utilities and image resolver function details
 * Helper Doc Line 50 : Helper utilities and image resolver function details
 * Helper Doc Line 51 : Helper utilities and image resolver function details
 * Helper Doc Line 52 : Helper utilities and image resolver function details
 * Helper Doc Line 53 : Helper utilities and image resolver function details
 * Helper Doc Line 54 : Helper utilities and image resolver function details
 * Helper Doc Line 55 : Helper utilities and image resolver function details
 * Helper Doc Line 56 : Helper utilities and image resolver function details
 * Helper Doc Line 57 : Helper utilities and image resolver function details
 * Helper Doc Line 58 : Helper utilities and image resolver function details
 * Helper Doc Line 59 : Helper utilities and image resolver function details
 * Helper Doc Line 60 : Helper utilities and image resolver function details
 * Helper Doc Line 61 : Helper utilities and image resolver function details
 * Helper Doc Line 62 : Helper utilities and image resolver function details
 * Helper Doc Line 63 : Helper utilities and image resolver function details
 * Helper Doc Line 64 : Helper utilities and image resolver function details
 * Helper Doc Line 65 : Helper utilities and image resolver function details
 * Helper Doc Line 66 : Helper utilities and image resolver function details
 * Helper Doc Line 67 : Helper utilities and image resolver function details
 * Helper Doc Line 68 : Helper utilities and image resolver function details
 * Helper Doc Line 69 : Helper utilities and image resolver function details
 * Helper Doc Line 70 : Helper utilities and image resolver function details
 * Helper Doc Line 71 : Helper utilities and image resolver function details
 * Helper Doc Line 72 : Helper utilities and image resolver function details
 * Helper Doc Line 73 : Helper utilities and image resolver function details
 * Helper Doc Line 74 : Helper utilities and image resolver function details
 * Helper Doc Line 75 : Helper utilities and image resolver function details
 * Helper Doc Line 76 : Helper utilities and image resolver function details
 * Helper Doc Line 77 : Helper utilities and image resolver function details
 * Helper Doc Line 78 : Helper utilities and image resolver function details
 * Helper Doc Line 79 : Helper utilities and image resolver function details
 * Helper Doc Line 80 : Helper utilities and image resolver function details
 * Helper Doc Line 81 : Helper utilities and image resolver function details
 * Helper Doc Line 82 : Helper utilities and image resolver function details
 * Helper Doc Line 83 : Helper utilities and image resolver function details
 * Helper Doc Line 84 : Helper utilities and image resolver function details
 * Helper Doc Line 85 : Helper utilities and image resolver function details
 * Helper Doc Line 86 : Helper utilities and image resolver function details
 * Helper Doc Line 87 : Helper utilities and image resolver function details
 * Helper Doc Line 88 : Helper utilities and image resolver function details
 * Helper Doc Line 89 : Helper utilities and image resolver function details
 * Helper Doc Line 90 : Helper utilities and image resolver function details
 * Helper Doc Line 91 : Helper utilities and image resolver function details
 * Helper Doc Line 92 : Helper utilities and image resolver function details
 * Helper Doc Line 93 : Helper utilities and image resolver function details
 * Helper Doc Line 94 : Helper utilities and image resolver function details
 * Helper Doc Line 95 : Helper utilities and image resolver function details
 * Helper Doc Line 96 : Helper utilities and image resolver function details
 * Helper Doc Line 97 : Helper utilities and image resolver function details
 * Helper Doc Line 98 : Helper utilities and image resolver function details
 * Helper Doc Line 99 : Helper utilities and image resolver function details
 * Helper Doc Line 100 : Helper utilities and image resolver function details
 * Helper Doc Line 101 : Helper utilities and image resolver function details
 * Helper Doc Line 102 : Helper utilities and image resolver function details
 * Helper Doc Line 103 : Helper utilities and image resolver function details
 * Helper Doc Line 104 : Helper utilities and image resolver function details
 * Helper Doc Line 105 : Helper utilities and image resolver function details
 * Helper Doc Line 106 : Helper utilities and image resolver function details
 * Helper Doc Line 107 : Helper utilities and image resolver function details
 * Helper Doc Line 108 : Helper utilities and image resolver function details
 * Helper Doc Line 109 : Helper utilities and image resolver function details
 * Helper Doc Line 110 : Helper utilities and image resolver function details
 * Helper Doc Line 111 : Helper utilities and image resolver function details
 * Helper Doc Line 112 : Helper utilities and image resolver function details
 * Helper Doc Line 113 : Helper utilities and image resolver function details
 * Helper Doc Line 114 : Helper utilities and image resolver function details
 * Helper Doc Line 115 : Helper utilities and image resolver function details
 * Helper Doc Line 116 : Helper utilities and image resolver function details
 * Helper Doc Line 117 : Helper utilities and image resolver function details
 * Helper Doc Line 118 : Helper utilities and image resolver function details
 * Helper Doc Line 119 : Helper utilities and image resolver function details
 * Helper Doc Line 120 : Helper utilities and image resolver function details
 * Helper Doc Line 121 : Helper utilities and image resolver function details
 * Helper Doc Line 122 : Helper utilities and image resolver function details
 * Helper Doc Line 123 : Helper utilities and image resolver function details
 * Helper Doc Line 124 : Helper utilities and image resolver function details
 * Helper Doc Line 125 : Helper utilities and image resolver function details
 * Helper Doc Line 126 : Helper utilities and image resolver function details
 * Helper Doc Line 127 : Helper utilities and image resolver function details
 * Helper Doc Line 128 : Helper utilities and image resolver function details
 * Helper Doc Line 129 : Helper utilities and image resolver function details
 * Helper Doc Line 130 : Helper utilities and image resolver function details
 * Helper Doc Line 131 : Helper utilities and image resolver function details
 * Helper Doc Line 132 : Helper utilities and image resolver function details
 * Helper Doc Line 133 : Helper utilities and image resolver function details
 * Helper Doc Line 134 : Helper utilities and image resolver function details
 * Helper Doc Line 135 : Helper utilities and image resolver function details
 * Helper Doc Line 136 : Helper utilities and image resolver function details
 * Helper Doc Line 137 : Helper utilities and image resolver function details
 * Helper Doc Line 138 : Helper utilities and image resolver function details
 * Helper Doc Line 139 : Helper utilities and image resolver function details
 * Helper Doc Line 140 : Helper utilities and image resolver function details
 * Helper Doc Line 141 : Helper utilities and image resolver function details
 * Helper Doc Line 142 : Helper utilities and image resolver function details
 * Helper Doc Line 143 : Helper utilities and image resolver function details
 * Helper Doc Line 144 : Helper utilities and image resolver function details
 * Helper Doc Line 145 : Helper utilities and image resolver function details
 * Helper Doc Line 146 : Helper utilities and image resolver function details
 * Helper Doc Line 147 : Helper utilities and image resolver function details
 * Helper Doc Line 148 : Helper utilities and image resolver function details
 * Helper Doc Line 149 : Helper utilities and image resolver function details
 * Helper Doc Line 150 : Helper utilities and image resolver function details
 * Helper Doc Line 151 : Helper utilities and image resolver function details
 * Helper Doc Line 152 : Helper utilities and image resolver function details
 * Helper Doc Line 153 : Helper utilities and image resolver function details
 * Helper Doc Line 154 : Helper utilities and image resolver function details
 * Helper Doc Line 155 : Helper utilities and image resolver function details
 * Helper Doc Line 156 : Helper utilities and image resolver function details
 * Helper Doc Line 157 : Helper utilities and image resolver function details
 * Helper Doc Line 158 : Helper utilities and image resolver function details
 * Helper Doc Line 159 : Helper utilities and image resolver function details
 * Helper Doc Line 160 : Helper utilities and image resolver function details
 * Helper Doc Line 161 : Helper utilities and image resolver function details
 * Helper Doc Line 162 : Helper utilities and image resolver function details
 * Helper Doc Line 163 : Helper utilities and image resolver function details
 * Helper Doc Line 164 : Helper utilities and image resolver function details
 * Helper Doc Line 165 : Helper utilities and image resolver function details
 * Helper Doc Line 166 : Helper utilities and image resolver function details
 * Helper Doc Line 167 : Helper utilities and image resolver function details
 * Helper Doc Line 168 : Helper utilities and image resolver function details
 * Helper Doc Line 169 : Helper utilities and image resolver function details
 * Helper Doc Line 170 : Helper utilities and image resolver function details
 * Helper Doc Line 171 : Helper utilities and image resolver function details
 * Helper Doc Line 172 : Helper utilities and image resolver function details
 * Helper Doc Line 173 : Helper utilities and image resolver function details
 * Helper Doc Line 174 : Helper utilities and image resolver function details
 * Helper Doc Line 175 : Helper utilities and image resolver function details
 * Helper Doc Line 176 : Helper utilities and image resolver function details
 * Helper Doc Line 177 : Helper utilities and image resolver function details
 * Helper Doc Line 178 : Helper utilities and image resolver function details
 * Helper Doc Line 179 : Helper utilities and image resolver function details
 * Helper Doc Line 180 : Helper utilities and image resolver function details
 * Helper Doc Line 181 : Helper utilities and image resolver function details
 * Helper Doc Line 182 : Helper utilities and image resolver function details
 * Helper Doc Line 183 : Helper utilities and image resolver function details
 * Helper Doc Line 184 : Helper utilities and image resolver function details
 * Helper Doc Line 185 : Helper utilities and image resolver function details
 * Helper Doc Line 186 : Helper utilities and image resolver function details
 * Helper Doc Line 187 : Helper utilities and image resolver function details
 * Helper Doc Line 188 : Helper utilities and image resolver function details
 * Helper Doc Line 189 : Helper utilities and image resolver function details
 * Helper Doc Line 190 : Helper utilities and image resolver function details
 * Helper Doc Line 191 : Helper utilities and image resolver function details
 * Helper Doc Line 192 : Helper utilities and image resolver function details
 * Helper Doc Line 193 : Helper utilities and image resolver function details
 * Helper Doc Line 194 : Helper utilities and image resolver function details
 * Helper Doc Line 195 : Helper utilities and image resolver function details
 * Helper Doc Line 196 : Helper utilities and image resolver function details
 * Helper Doc Line 197 : Helper utilities and image resolver function details
 * Helper Doc Line 198 : Helper utilities and image resolver function details
 * Helper Doc Line 199 : Helper utilities and image resolver function details
 * Helper Doc Line 200 : Helper utilities and image resolver function details
 * Helper Doc Line 201 : Helper utilities and image resolver function details
 * Helper Doc Line 202 : Helper utilities and image resolver function details
 * Helper Doc Line 203 : Helper utilities and image resolver function details
 * Helper Doc Line 204 : Helper utilities and image resolver function details
 * Helper Doc Line 205 : Helper utilities and image resolver function details
 * Helper Doc Line 206 : Helper utilities and image resolver function details
 * Helper Doc Line 207 : Helper utilities and image resolver function details
 * Helper Doc Line 208 : Helper utilities and image resolver function details
 * Helper Doc Line 209 : Helper utilities and image resolver function details
 * Helper Doc Line 210 : Helper utilities and image resolver function details
 * Helper Doc Line 211 : Helper utilities and image resolver function details
 * Helper Doc Line 212 : Helper utilities and image resolver function details
 * Helper Doc Line 213 : Helper utilities and image resolver function details
 * Helper Doc Line 214 : Helper utilities and image resolver function details
 * Helper Doc Line 215 : Helper utilities and image resolver function details
 * Helper Doc Line 216 : Helper utilities and image resolver function details
 * Helper Doc Line 217 : Helper utilities and image resolver function details
 * Helper Doc Line 218 : Helper utilities and image resolver function details
 * Helper Doc Line 219 : Helper utilities and image resolver function details
 * Helper Doc Line 220 : Helper utilities and image resolver function details
 * Helper Doc Line 221 : Helper utilities and image resolver function details
 * Helper Doc Line 222 : Helper utilities and image resolver function details
 * Helper Doc Line 223 : Helper utilities and image resolver function details
 * Helper Doc Line 224 : Helper utilities and image resolver function details
 * Helper Doc Line 225 : Helper utilities and image resolver function details
 * Helper Doc Line 226 : Helper utilities and image resolver function details
 * Helper Doc Line 227 : Helper utilities and image resolver function details
 * Helper Doc Line 228 : Helper utilities and image resolver function details
 * Helper Doc Line 229 : Helper utilities and image resolver function details
 * Helper Doc Line 230 : Helper utilities and image resolver function details
 * Helper Doc Line 231 : Helper utilities and image resolver function details
 * Helper Doc Line 232 : Helper utilities and image resolver function details
 * Helper Doc Line 233 : Helper utilities and image resolver function details
 * Helper Doc Line 234 : Helper utilities and image resolver function details
 * Helper Doc Line 235 : Helper utilities and image resolver function details
 * Helper Doc Line 236 : Helper utilities and image resolver function details
 * Helper Doc Line 237 : Helper utilities and image resolver function details
 * Helper Doc Line 238 : Helper utilities and image resolver function details
 * Helper Doc Line 239 : Helper utilities and image resolver function details
 * Helper Doc Line 240 : Helper utilities and image resolver function details
 * Helper Doc Line 241 : Helper utilities and image resolver function details
 * Helper Doc Line 242 : Helper utilities and image resolver function details
 * Helper Doc Line 243 : Helper utilities and image resolver function details
 * Helper Doc Line 244 : Helper utilities and image resolver function details
 * Helper Doc Line 245 : Helper utilities and image resolver function details
 * Helper Doc Line 246 : Helper utilities and image resolver function details
 * Helper Doc Line 247 : Helper utilities and image resolver function details
 * Helper Doc Line 248 : Helper utilities and image resolver function details
 * Helper Doc Line 249 : Helper utilities and image resolver function details
 * Helper Doc Line 250 : Helper utilities and image resolver function details
 * Helper Doc Line 251 : Helper utilities and image resolver function details
 * Helper Doc Line 252 : Helper utilities and image resolver function details
 * Helper Doc Line 253 : Helper utilities and image resolver function details
 * Helper Doc Line 254 : Helper utilities and image resolver function details
 * Helper Doc Line 255 : Helper utilities and image resolver function details
 * Helper Doc Line 256 : Helper utilities and image resolver function details
 * Helper Doc Line 257 : Helper utilities and image resolver function details
 * Helper Doc Line 258 : Helper utilities and image resolver function details
 * Helper Doc Line 259 : Helper utilities and image resolver function details
 * Helper Doc Line 260 : Helper utilities and image resolver function details
 * Helper Doc Line 261 : Helper utilities and image resolver function details
 * Helper Doc Line 262 : Helper utilities and image resolver function details
 * Helper Doc Line 263 : Helper utilities and image resolver function details
 * Helper Doc Line 264 : Helper utilities and image resolver function details
 * Helper Doc Line 265 : Helper utilities and image resolver function details
 * Helper Doc Line 266 : Helper utilities and image resolver function details
 * Helper Doc Line 267 : Helper utilities and image resolver function details
 * Helper Doc Line 268 : Helper utilities and image resolver function details
 * Helper Doc Line 269 : Helper utilities and image resolver function details
 * Helper Doc Line 270 : Helper utilities and image resolver function details
 * Helper Doc Line 271 : Helper utilities and image resolver function details
 * Helper Doc Line 272 : Helper utilities and image resolver function details
 * Helper Doc Line 273 : Helper utilities and image resolver function details
 * Helper Doc Line 274 : Helper utilities and image resolver function details
 * Helper Doc Line 275 : Helper utilities and image resolver function details
 * Helper Doc Line 276 : Helper utilities and image resolver function details
 * Helper Doc Line 277 : Helper utilities and image resolver function details
 * Helper Doc Line 278 : Helper utilities and image resolver function details
 * Helper Doc Line 279 : Helper utilities and image resolver function details
 * Helper Doc Line 280 : Helper utilities and image resolver function details
 * Helper Doc Line 281 : Helper utilities and image resolver function details
 * Helper Doc Line 282 : Helper utilities and image resolver function details
 * Helper Doc Line 283 : Helper utilities and image resolver function details
 * Helper Doc Line 284 : Helper utilities and image resolver function details
 * Helper Doc Line 285 : Helper utilities and image resolver function details
 * Helper Doc Line 286 : Helper utilities and image resolver function details
 * Helper Doc Line 287 : Helper utilities and image resolver function details
 * Helper Doc Line 288 : Helper utilities and image resolver function details
 * Helper Doc Line 289 : Helper utilities and image resolver function details
 * Helper Doc Line 290 : Helper utilities and image resolver function details
 * Helper Doc Line 291 : Helper utilities and image resolver function details
 * Helper Doc Line 292 : Helper utilities and image resolver function details
 * Helper Doc Line 293 : Helper utilities and image resolver function details
 * Helper Doc Line 294 : Helper utilities and image resolver function details
 * Helper Doc Line 295 : Helper utilities and image resolver function details
 * Helper Doc Line 296 : Helper utilities and image resolver function details
 * Helper Doc Line 297 : Helper utilities and image resolver function details
 * Helper Doc Line 298 : Helper utilities and image resolver function details
 * Helper Doc Line 299 : Helper utilities and image resolver function details
 * Helper Doc Line 300 : Helper utilities and image resolver function details
 * Helper Doc Line 301 : Helper utilities and image resolver function details
 * Helper Doc Line 302 : Helper utilities and image resolver function details
 * Helper Doc Line 303 : Helper utilities and image resolver function details
 * Helper Doc Line 304 : Helper utilities and image resolver function details
 * Helper Doc Line 305 : Helper utilities and image resolver function details
 * Helper Doc Line 306 : Helper utilities and image resolver function details
 * Helper Doc Line 307 : Helper utilities and image resolver function details
 * Helper Doc Line 308 : Helper utilities and image resolver function details
 * Helper Doc Line 309 : Helper utilities and image resolver function details
 * Helper Doc Line 310 : Helper utilities and image resolver function details
 * Helper Doc Line 311 : Helper utilities and image resolver function details
 * Helper Doc Line 312 : Helper utilities and image resolver function details
 * Helper Doc Line 313 : Helper utilities and image resolver function details
 * Helper Doc Line 314 : Helper utilities and image resolver function details
 * Helper Doc Line 315 : Helper utilities and image resolver function details
 * Helper Doc Line 316 : Helper utilities and image resolver function details
 * Helper Doc Line 317 : Helper utilities and image resolver function details
 * Helper Doc Line 318 : Helper utilities and image resolver function details
 * Helper Doc Line 319 : Helper utilities and image resolver function details
 * Helper Doc Line 320 : Helper utilities and image resolver function details
 * Helper Doc Line 321 : Helper utilities and image resolver function details
 * Helper Doc Line 322 : Helper utilities and image resolver function details
 * Helper Doc Line 323 : Helper utilities and image resolver function details
 * Helper Doc Line 324 : Helper utilities and image resolver function details
 * Helper Doc Line 325 : Helper utilities and image resolver function details
 * Helper Doc Line 326 : Helper utilities and image resolver function details
 * Helper Doc Line 327 : Helper utilities and image resolver function details
 * Helper Doc Line 328 : Helper utilities and image resolver function details
 * Helper Doc Line 329 : Helper utilities and image resolver function details
 * Helper Doc Line 330 : Helper utilities and image resolver function details
 * Helper Doc Line 331 : Helper utilities and image resolver function details
 * Helper Doc Line 332 : Helper utilities and image resolver function details
 * Helper Doc Line 333 : Helper utilities and image resolver function details
 * Helper Doc Line 334 : Helper utilities and image resolver function details
 * Helper Doc Line 335 : Helper utilities and image resolver function details
 * Helper Doc Line 336 : Helper utilities and image resolver function details
 * Helper Doc Line 337 : Helper utilities and image resolver function details
 * Helper Doc Line 338 : Helper utilities and image resolver function details
 * Helper Doc Line 339 : Helper utilities and image resolver function details
 * Helper Doc Line 340 : Helper utilities and image resolver function details
 * Helper Doc Line 341 : Helper utilities and image resolver function details
 * Helper Doc Line 342 : Helper utilities and image resolver function details
 * Helper Doc Line 343 : Helper utilities and image resolver function details
 * Helper Doc Line 344 : Helper utilities and image resolver function details
 * Helper Doc Line 345 : Helper utilities and image resolver function details
 * Helper Doc Line 346 : Helper utilities and image resolver function details
 * Helper Doc Line 347 : Helper utilities and image resolver function details
 * Helper Doc Line 348 : Helper utilities and image resolver function details
 * Helper Doc Line 349 : Helper utilities and image resolver function details
 * Helper Doc Line 350 : Helper utilities and image resolver function details
 * Helper Doc Line 351 : Helper utilities and image resolver function details
 * Helper Doc Line 352 : Helper utilities and image resolver function details
 * Helper Doc Line 353 : Helper utilities and image resolver function details
 * Helper Doc Line 354 : Helper utilities and image resolver function details
 * Helper Doc Line 355 : Helper utilities and image resolver function details
 * Helper Doc Line 356 : Helper utilities and image resolver function details
 * Helper Doc Line 357 : Helper utilities and image resolver function details
 * Helper Doc Line 358 : Helper utilities and image resolver function details
 * Helper Doc Line 359 : Helper utilities and image resolver function details
 * Helper Doc Line 360 : Helper utilities and image resolver function details
 * Helper Doc Line 361 : Helper utilities and image resolver function details
 * Helper Doc Line 362 : Helper utilities and image resolver function details
 * Helper Doc Line 363 : Helper utilities and image resolver function details
 * Helper Doc Line 364 : Helper utilities and image resolver function details
 * Helper Doc Line 365 : Helper utilities and image resolver function details
 * Helper Doc Line 366 : Helper utilities and image resolver function details
 * Helper Doc Line 367 : Helper utilities and image resolver function details
 * Helper Doc Line 368 : Helper utilities and image resolver function details
 * Helper Doc Line 369 : Helper utilities and image resolver function details
 * Helper Doc Line 370 : Helper utilities and image resolver function details
 * Helper Doc Line 371 : Helper utilities and image resolver function details
 * Helper Doc Line 372 : Helper utilities and image resolver function details
 * Helper Doc Line 373 : Helper utilities and image resolver function details
 * Helper Doc Line 374 : Helper utilities and image resolver function details
 * Helper Doc Line 375 : Helper utilities and image resolver function details
 * Helper Doc Line 376 : Helper utilities and image resolver function details
 * Helper Doc Line 377 : Helper utilities and image resolver function details
 * Helper Doc Line 378 : Helper utilities and image resolver function details
 * Helper Doc Line 379 : Helper utilities and image resolver function details
 * Helper Doc Line 380 : Helper utilities and image resolver function details
 * Helper Doc Line 381 : Helper utilities and image resolver function details
 * Helper Doc Line 382 : Helper utilities and image resolver function details
 * Helper Doc Line 383 : Helper utilities and image resolver function details
 * Helper Doc Line 384 : Helper utilities and image resolver function details
 * Helper Doc Line 385 : Helper utilities and image resolver function details
 * Helper Doc Line 386 : Helper utilities and image resolver function details
 * Helper Doc Line 387 : Helper utilities and image resolver function details
 * Helper Doc Line 388 : Helper utilities and image resolver function details
 * Helper Doc Line 389 : Helper utilities and image resolver function details
 * Helper Doc Line 390 : Helper utilities and image resolver function details
 * Helper Doc Line 391 : Helper utilities and image resolver function details
 * Helper Doc Line 392 : Helper utilities and image resolver function details
 * Helper Doc Line 393 : Helper utilities and image resolver function details
 * Helper Doc Line 394 : Helper utilities and image resolver function details
 * Helper Doc Line 395 : Helper utilities and image resolver function details
 * Helper Doc Line 396 : Helper utilities and image resolver function details
 * Helper Doc Line 397 : Helper utilities and image resolver function details
 * Helper Doc Line 398 : Helper utilities and image resolver function details
 * Helper Doc Line 399 : Helper utilities and image resolver function details
 * Helper Doc Line 400 : Helper utilities and image resolver function details
 * Helper Doc Line 401 : Helper utilities and image resolver function details
 * Helper Doc Line 402 : Helper utilities and image resolver function details
 * Helper Doc Line 403 : Helper utilities and image resolver function details
 * Helper Doc Line 404 : Helper utilities and image resolver function details
 * Helper Doc Line 405 : Helper utilities and image resolver function details
 * Helper Doc Line 406 : Helper utilities and image resolver function details
 * Helper Doc Line 407 : Helper utilities and image resolver function details
 * Helper Doc Line 408 : Helper utilities and image resolver function details
 * Helper Doc Line 409 : Helper utilities and image resolver function details
 * Helper Doc Line 410 : Helper utilities and image resolver function details
 * Helper Doc Line 411 : Helper utilities and image resolver function details
 * Helper Doc Line 412 : Helper utilities and image resolver function details
 * Helper Doc Line 413 : Helper utilities and image resolver function details
 * Helper Doc Line 414 : Helper utilities and image resolver function details
 * Helper Doc Line 415 : Helper utilities and image resolver function details
 * Helper Doc Line 416 : Helper utilities and image resolver function details
 * Helper Doc Line 417 : Helper utilities and image resolver function details
 * Helper Doc Line 418 : Helper utilities and image resolver function details
 * Helper Doc Line 419 : Helper utilities and image resolver function details
 * Helper Doc Line 420 : Helper utilities and image resolver function details
 * Helper Doc Line 421 : Helper utilities and image resolver function details
 * Helper Doc Line 422 : Helper utilities and image resolver function details
 * Helper Doc Line 423 : Helper utilities and image resolver function details
 * Helper Doc Line 424 : Helper utilities and image resolver function details
 * Helper Doc Line 425 : Helper utilities and image resolver function details
 * Helper Doc Line 426 : Helper utilities and image resolver function details
 * Helper Doc Line 427 : Helper utilities and image resolver function details
 * Helper Doc Line 428 : Helper utilities and image resolver function details
 * Helper Doc Line 429 : Helper utilities and image resolver function details
 * Helper Doc Line 430 : Helper utilities and image resolver function details
 * Helper Doc Line 431 : Helper utilities and image resolver function details
 * Helper Doc Line 432 : Helper utilities and image resolver function details
 * Helper Doc Line 433 : Helper utilities and image resolver function details
 * Helper Doc Line 434 : Helper utilities and image resolver function details
 * Helper Doc Line 435 : Helper utilities and image resolver function details
 * Helper Doc Line 436 : Helper utilities and image resolver function details
 * Helper Doc Line 437 : Helper utilities and image resolver function details
 * Helper Doc Line 438 : Helper utilities and image resolver function details
 * Helper Doc Line 439 : Helper utilities and image resolver function details
 * Helper Doc Line 440 : Helper utilities and image resolver function details
 * Helper Doc Line 441 : Helper utilities and image resolver function details
 * Helper Doc Line 442 : Helper utilities and image resolver function details
 * Helper Doc Line 443 : Helper utilities and image resolver function details
 * Helper Doc Line 444 : Helper utilities and image resolver function details
 * Helper Doc Line 445 : Helper utilities and image resolver function details
 * Helper Doc Line 446 : Helper utilities and image resolver function details
 * Helper Doc Line 447 : Helper utilities and image resolver function details
 * Helper Doc Line 448 : Helper utilities and image resolver function details
 * Helper Doc Line 449 : Helper utilities and image resolver function details
 * Helper Doc Line 450 : Helper utilities and image resolver function details
 * Helper Doc Line 451 : Helper utilities and image resolver function details
 * Helper Doc Line 452 : Helper utilities and image resolver function details
 * Helper Doc Line 453 : Helper utilities and image resolver function details
 * Helper Doc Line 454 : Helper utilities and image resolver function details
 * Helper Doc Line 455 : Helper utilities and image resolver function details
 * Helper Doc Line 456 : Helper utilities and image resolver function details
 * Helper Doc Line 457 : Helper utilities and image resolver function details
 * Helper Doc Line 458 : Helper utilities and image resolver function details
 * Helper Doc Line 459 : Helper utilities and image resolver function details
 * Helper Doc Line 460 : Helper utilities and image resolver function details
 * Helper Doc Line 461 : Helper utilities and image resolver function details
 * Helper Doc Line 462 : Helper utilities and image resolver function details
 * Helper Doc Line 463 : Helper utilities and image resolver function details
 * Helper Doc Line 464 : Helper utilities and image resolver function details
 * Helper Doc Line 465 : Helper utilities and image resolver function details
 * Helper Doc Line 466 : Helper utilities and image resolver function details
 * Helper Doc Line 467 : Helper utilities and image resolver function details
 * Helper Doc Line 468 : Helper utilities and image resolver function details
 * Helper Doc Line 469 : Helper utilities and image resolver function details
 * Helper Doc Line 470 : Helper utilities and image resolver function details
 * Helper Doc Line 471 : Helper utilities and image resolver function details
 * Helper Doc Line 472 : Helper utilities and image resolver function details
 * Helper Doc Line 473 : Helper utilities and image resolver function details
 * Helper Doc Line 474 : Helper utilities and image resolver function details
 * Helper Doc Line 475 : Helper utilities and image resolver function details
 * Helper Doc Line 476 : Helper utilities and image resolver function details
 * Helper Doc Line 477 : Helper utilities and image resolver function details
 * Helper Doc Line 478 : Helper utilities and image resolver function details
 * Helper Doc Line 479 : Helper utilities and image resolver function details
 * Helper Doc Line 480 : Helper utilities and image resolver function details
 * Helper Doc Line 481 : Helper utilities and image resolver function details
 * Helper Doc Line 482 : Helper utilities and image resolver function details
 * Helper Doc Line 483 : Helper utilities and image resolver function details
 * Helper Doc Line 484 : Helper utilities and image resolver function details
 * Helper Doc Line 485 : Helper utilities and image resolver function details
 * Helper Doc Line 486 : Helper utilities and image resolver function details
 * Helper Doc Line 487 : Helper utilities and image resolver function details
 * Helper Doc Line 488 : Helper utilities and image resolver function details
 * Helper Doc Line 489 : Helper utilities and image resolver function details
 * Helper Doc Line 490 : Helper utilities and image resolver function details
 * Helper Doc Line 491 : Helper utilities and image resolver function details
 * Helper Doc Line 492 : Helper utilities and image resolver function details
 * Helper Doc Line 493 : Helper utilities and image resolver function details
 * Helper Doc Line 494 : Helper utilities and image resolver function details
 * Helper Doc Line 495 : Helper utilities and image resolver function details
 * Helper Doc Line 496 : Helper utilities and image resolver function details
 * Helper Doc Line 497 : Helper utilities and image resolver function details
 * Helper Doc Line 498 : Helper utilities and image resolver function details
 * Helper Doc Line 499 : Helper utilities and image resolver function details
 * Helper Doc Line 500 : Helper utilities and image resolver function details
 */