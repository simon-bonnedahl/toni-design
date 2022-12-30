import { faLightbulb, faSun, faSunPlantWilt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const ThemeSwitch: React.FC = () => {
    const [darkTheme, setDarkTheme] = useState(false)

    const toggleTheme = () => {
        setDarkTheme(!darkTheme)
    }

  return (
    <div className="hover:cursor-pointer" onClick={toggleTheme}>
        {darkTheme ?  <FontAwesomeIcon className="w-5 h-5" icon={faLightbulb} color="#fff" /> :
         <FontAwesomeIcon className="w-5 h-5" icon={faLightbulb} color="#000" />}
       
    </div>
  );
};

export default ThemeSwitch;