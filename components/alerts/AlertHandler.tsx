import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAlerts,
  setError,
  setInfo,
  setSuccess,
  setWarning,
} from "../../reducers/alertSlice";
import ErrorAlert from "./ErrorAlert";
import InfoAlert from "./InfoAlert";
import SuccessAlert from "./SuccessAlert";
import WarningAlert from "./WarningAlert";

const AlertHandler = () => {
  const alerts = useSelector(selectAlerts);
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      if (alerts.success) {
        dispatch(setSuccess(""));
      }
      if (alerts.error) {
        dispatch(setError(""));
      }
      if (alerts.warning) {
        dispatch(setWarning(""));
      }
      if (alerts.info) {
        dispatch(setInfo(""));
      }
    }, 5000);
  }, [alerts]);

  return (
    <div className="fixed bottom-24 space-y-2 left-0 w-96">
      {alerts.success && <SuccessAlert text={alerts.success} />}
      {alerts.error && <ErrorAlert text={alerts.error} />}
      {alerts.warning && <WarningAlert text={alerts.warning} />}
      {alerts.info && <InfoAlert text={alerts.info} />}
    </div>
  );
};

export default AlertHandler;
