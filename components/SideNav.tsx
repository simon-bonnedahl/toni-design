import { useEffect, useState } from "react";
import client from "../sanity";

const SideNav: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    const query = `*[_type == 'category']`;

    client.fetch(query).then((data: any) => {
      setCategories(data);
    });
  }, []);

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
        {categories.map((category) => (
          <li key={category._id}>
            <a>{category.title}</a>
          </li>
        ))}

        <li tabIndex={0}>
          <span>Sub kategorier</span>
          <ul className="rounded-box p-2 bg-base-100">
            <li>
              <a>1</a>
            </li>
            <li>
              <a> 2</a>
            </li>
            <li>
              <a>3</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
