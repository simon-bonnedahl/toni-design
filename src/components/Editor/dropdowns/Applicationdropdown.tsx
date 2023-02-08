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
import { Applications, Sign } from "../../../types/sign.d";
type Props = {
  sign: Sign;
  setApplication: (application: Applications) => void;
};
const Applicationdropdown: React.FC<Props> = ({ sign, setApplication }) => {
  const [selectedApplication, setSelectedApplication] = useState(
    useSelector(getSignMetadata).application
  );

  //Hämta från sanity
  const applications = [
    {
      application: Applications.NONE,
      text: "Ingen",
      desc: "Ingen applikation",
    },
    {
      application: Applications.TAPE,
      text: "Tejp",
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
        <FontAwesomeIcon icon={faScrewdriverWrench} className="scale-150" />
      </label>
      <div
        tabIndex={0}
        className="card-compact card dropdown-content w-96 border border-black bg-base-200  p-2 shadow"
      >
        <div className="card-body">
          <h3 className="card-title text-neutral-content">Välj en fästmetod</h3>
          <div className="flex flex-col space-y-4">
            {applications.map((application, key) => {
              let className =
                "flex justify-between hover:cursor-pointer h-24 relative";
              if (application.application === sign.application)
                className += " border border-primary rounded-md";

              return (
                <div
                  key={key}
                  className={className}
                  onClick={() => setApplication(application.application)}
                >
                  <div className="flex flex-col justify-center p-2">
                    <h1 className="text-neutral-content">{application.text}</h1>
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
                        checked={application.application === sign.application}
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
