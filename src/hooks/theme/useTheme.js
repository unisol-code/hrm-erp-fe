// themeUtils.js
import { themes } from "../../components/Theme/themes";
import { useRecoilState } from "recoil";
import { themeState } from "../../state/themeState";

const companyThemeMap = {
  UniSol: "UniSol",
  SurgiSol: "SurgiSol",
  "Enviro solution": "EnviroSolution",
  "Ignite Sphere": "IgniteSphere",
  Home: "Home",
};

export const useTheme = () => {
  const [theme, setTheme] = useRecoilState(themeState);

  const switchTheme = (company) => {
    console.log("company", company);
    const themeKey = companyThemeMap[company];
    setTheme(themes[themeKey]);
  };

  return { theme, switchTheme };
};
