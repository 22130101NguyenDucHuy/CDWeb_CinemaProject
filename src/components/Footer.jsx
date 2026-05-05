import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-site">
      <div className="footer-container">
        <div className="footer-col footer-col-brand">
          <Link href="/" className="footer-logo">FLIX</Link>
          <p className="footer-desc">
            FLIX lÃ  ná»n táº£ng xem phim trá»±c tuyáº¿n miá»…n phÃ­ vá»›i cháº¥t lÆ°á»£ng video mÆ°á»£t mÃ . Cáº­p nháº­t liÃªn tá»¥c cÃ¡c bá»™ phim má»›i nháº¥t, Ä‘a dáº¡ng thá»ƒ loáº¡i tá»« phim hÃ nh Ä‘á»™ng, tÃ¬nh cáº£m Ä‘áº¿n phim khoa há»c viá»…n tÆ°á»Ÿng.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" title="Facebook">FB</a>
            <a href="#" className="social-link" title="Twitter">X</a>
            <a href="#" className="social-link" title="Instagram">IG</a>
          </div>
        </div>

        <div className="footer-col">
          <h3 className="footer-title">KhÃ¡m PhÃ¡</h3>
          <ul className="footer-links">
            <li><Link href="/danh-sach/phim-moi">Phim Má»›i</Link></li>
            <li><Link href="/danh-sach/phim-bo">Phim Bá»™</Link></li>
            <li><Link href="/danh-sach/phim-le">Phim Láº»</Link></li>
            <li><Link href="/danh-sach/phim-chieu-rap">Phim Chiáº¿u Ráº¡p</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="footer-title">Thá»ƒ Loáº¡i</h3>
          <ul className="footer-links">
            <li><Link href="/the-loai/hanh-dong">HÃ nh Äá»™ng</Link></li>
            <li><Link href="/the-loai/tinh-cam">TÃ¬nh Cáº£m</Link></li>
            <li><Link href="/the-loai/hoat-hinh">Hoáº¡t HÃ¬nh</Link></li>
            <li><Link href="/the-loai/kinh-di">Kinh Dá»‹</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3 className="footer-title">Há»— Trá»£</h3>
          <ul className="footer-links">
            <li><Link href="#">CÃ¢u Há»i ThÆ°á»ng Gáº·p</Link></li>
            <li><Link href="#">Äiá»u Khoáº£n Sá»­ Dá»¥ng</Link></li>
            <li><Link href="#">ChÃ­nh SÃ¡ch Báº£o Máº­t</Link></li>
            <li><Link href="#">LiÃªn Há»‡: hotro@flix.vn</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FLIX. Tham kháº£o giao diá»‡n phong cÃ¡ch Netflix. PhÃ¡t triá»ƒn vá»›i Next.js vÃ  OPhim API.</p>
        <p className="footer-disclaimer">Website chá»‰ sÆ°u táº§m phim, khÃ´ng lÆ°u trá»¯ dá»¯ liá»‡u video trÃªn há»‡ thá»‘ng.</p>
      </div>
    </footer>
  );
}

