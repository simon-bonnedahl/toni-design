import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { getSignMetadata, setSignApplication } from "../../reducers/signSlice";
import { setSelectedOption } from "../../reducers/toolbarSlice";

const ApplicationModal: React.FC = () => {
  const [selectedApplication, setSelectedApplication] = useState(
    useSelector(getSignMetadata).application
  );
  const applications = [
    //Plocka från sanity?
    {
      name: "None",
      key: 0,
    },
    {
      name: "Tape",
      key: 1,
    },
    {
      name: "Bolt",
      key: 2,
    },
  ];
  const dispatch = useDispatch();

  const handleApplicationChange = (a: string) => {
    setSelectedApplication(a);
    dispatch(setSignApplication({ application: a }));
  };

  const handleClose = () => {
    dispatch(setSelectedOption({ selectedOption: null }));
  };

  return (
    <div className="absolute top-40 z-50 left-40 w-96 h-64 bg-white shadow-lg flex rounded-lg">
      <div
        className="absolute -top-3 -left-3 bg-red-500 rounded-full z-50 hover:scale-110 ease-in-out duration-300"
        onClick={() => handleClose()}
      >
        <FontAwesomeIcon className="w-8 h-8 p-1" icon={faClose} color="#fff" />
      </div>
      <div className="flex flex-col w-full p-5 space-y-2">
        {applications.map((application) => {
          if (application.name === selectedApplication) {
            return (
              <div
                key={application.key}
                className="w-full bg-blue-400 hover:cursor-pointer"
              >
                {application.name}
              </div>
            );
          } else {
            return (
              <div
                key={application.key}
                onClick={() => handleApplicationChange(application.name)}
                className="w-full bg-white hover:cursor-pointer"
              >
                {application.name}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default ApplicationModal;
