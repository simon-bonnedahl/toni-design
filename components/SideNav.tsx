const SideNav: React.FC = () => {
  return (
    <div className="drawer drawer-mobile border border-primary w-80">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden"
        >
          Open drawer
        </label>
      </div>
      <ul className="menu bg-base-100 rounded-box p-2">
        <li>
          <a>Item 1</a>
        </li>

        <li tabIndex={0}>
          <span>Parent</span>
          <ul className="rounded-box p-2 bg-base-100">
            <li>
              <a>Submenu 1</a>
            </li>
            <li>
              <a>Submenu 2</a>
            </li>
            <li>
              <a>Submenu 3</a>
            </li>
          </ul>
        </li>
        <li>
          <a>Item 3</a>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
