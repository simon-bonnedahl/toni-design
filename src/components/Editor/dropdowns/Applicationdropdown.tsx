import {
  faChevronDown,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../../../../reducers/editorSlice";
import {
  getSignMetadata,
  setSignApplication,
} from "../../../../reducers/signSlice";

const Applicationdropdown: React.FC = () => {
  const [selectedApplication, setSelectedApplication] = useState(
    useSelector(getSignMetadata).application
  );

  //Hämta från sanity
  const applications = [
    {
      name: "None",
      key: 0,
      swe: "Ingen",
      desc: "Ingen applikation",
    },
    {
      name: "Tape",
      key: 1,
      swe: "Tejp",
      desc: "Dubbelhäftande tejp",
    },
  ];
  const dispatch = useDispatch();

  const handleProductChange = (a: string) => {
    setSelectedApplication(a);
    dispatch(setSignApplication({ application: a }));
  };

  return (
    <div className="dropdown">
      <label
        tabIndex={0}
        className="btn-outline btn-primary btn m-1 flex space-x-2"
      >
        <p className="text-content-primary">Fästmetod</p>
        <FontAwesomeIcon icon={faScrewdriverWrench} className="scale-110" />
      </label>
      <div
        tabIndex={0}
        className="card dropdown-content card-compact w-96 border border-black bg-base-200  p-2 shadow"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Välj en fästmetod</h3>
          <div className="flex flex-col space-y-4">
            {applications.map((application) => {
              let className =
                "flex justify-between hover:cursor-pointer h-24 relative";
              if (application.name === selectedApplication)
                className += " border border-primary rounded-md";

              return (
                <div
                  key={application.key}
                  className={className}
                  onClick={() => handleProductChange(application.name)}
                >
                  <div className="flex flex-col justify-center p-2">
                    <h1 className="text-neutral-content">{application.swe}</h1>
                    <p className="text-xs text-neutral-content">
                      {application.desc}
                    </p>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer"></label>
                  </div>
                  <div className="form-control">
                    <label className="label absolute bottom-0 right-0 cursor-pointer">
                      <span className="label-text text-neutral-content">
                        Vald
                      </span>
                      <input
                        readOnly
                        type="radio"
                        name="radio-application"
                        checked={application.name === selectedApplication}
                        className="radio ml-2 checked:border-base-100 checked:bg-primary"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicationdropdown;
