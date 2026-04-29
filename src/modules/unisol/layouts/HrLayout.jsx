import Header from "../../../components/header/Header";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useTheme } from "../../../hooks/theme/useTheme";

const HrLayout = ({ children, setActiveTab }) => {
  const { theme } = useTheme();
  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className="flex-shrink-0 relative overflow-visible h-full">
        <Sidebar setActiveTab={setActiveTab} />
      </div>
      <div className="flex flex-col w-full">
        <Header />
        <div
          style={{ backgroundColor: theme?.backgroundColor }}
          className="px-4 py-4 w-full overflow-y-scroll flex-1"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default HrLayout;