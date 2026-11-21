// themeUtils.js
import { themes } from "../../components/Theme/themes";
import { useRecoilState } from "recoil";
import { themeState } from "../../state/themeState";

const companyThemeMap = {
  UniSol: "UniSol",
  "Unisol Services LLP": "UniSol",
  SurgiSol: "SurgiSol",
  "Surgisol Healthcare Pvt Ltd": "SurgiSol",
  "Enviro solution": "EnviroSolution",
  "Ignite Sphere": "IgniteSphere",
  Home: "Home",
};

export const useTheme = () => {
  const [theme, setTheme] = useRecoilState(themeState);

  const switchTheme = (company) => {
    const themeKey = companyThemeMap[company];
    setTheme(themes[themeKey] || themes.UniSol);
  };

  return { theme, switchTheme };
};
