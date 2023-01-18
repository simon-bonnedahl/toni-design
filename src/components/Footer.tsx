const Footer: React.FC = () => {
  return (
    <footer className="footer mt-20 flex justify-around bg-neutral p-10 text-neutral-content">
      <div>
        <span className="footer-title">Tjänster</span>
        <a className="link-hover link">Dekorer</a>
        <a className="link-hover link">Profilkläder</a>
        <a className="link-hover link">Dekaler</a>
      </div>
      <div>
        <span className="footer-title">Om oss</span>
        <a className="link-hover link">Kontakt</a>
        <a className="link-hover link">Jobb</a>
      </div>
      <div>
        <span className="footer-title">Legal</span>
        <a className="link-hover link">Terms of use</a>
        <a className="link-hover link">Privacy policy</a>
        <a className="link-hover link">Cookie policy</a>
      </div>
    </footer>
  );
};

export default Footer;
