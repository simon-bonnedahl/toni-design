import {
  faChevronDown,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommand } from "../../reducers/editorSlice";
import { getSignMetadata, setSignApplication } from "../../reducers/signSlice";

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
        className="btn btn-primary m-1 flex space-x-2 btn-outline"
      >
        <p className="text-content-primary">Fästmetod</p>
        <FontAwesomeIcon icon={faScrewdriverWrench} className="scale-110" />
      </label>
      <div
        tabIndex={0}
        className="dropdown-content card w-96 card-compact bg-base-200 border border-black  p-2 shadow"
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
                  <div className="p-2 flex flex-col justify-center">
                    <h1 className="text-neutral-content">{application.swe}</h1>
                    <p className="text-neutral-content text-xs">
                      {application.desc}
                    </p>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer"></label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer absolute bottom-0 right-0">
                      <span className="label-text text-neutral-content">
                        Vald
                      </span>
                      <input
                        readOnly
                        type="radio"
                        name="radio-application"
                        checked={application.name === selectedApplication}
                        className="radio checked:bg-primary checked:border-base-100 ml-2"
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
