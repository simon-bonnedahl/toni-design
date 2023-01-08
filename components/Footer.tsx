const Footer: React.FC = () => {
  return (
    <footer className="footer flex justify-around mt-20 p-10 bg-neutral text-neutral-content">
      <div>
        <span className="footer-title">Tjänster</span>
        <a className="link link-hover">Dekorer</a>
        <a className="link link-hover">Profilkläder</a>
        <a className="link link-hover">Dekaler</a>
      </div>
      <div>
        <span className="footer-title">Om oss</span>
        <a className="link link-hover">Kontakt</a>
        <a className="link link-hover">Jobb</a>
      </div>
      <div>
        <span className="footer-title">Legal</span>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
        <a className="link link-hover">Cookie policy</a>
      </div>
    </footer>
  );
};

export default Footer;
