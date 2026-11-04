import Header from "../../../components/header/Header";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useTheme } from "../../../hooks/theme/useTheme";

const HrLayout = ({ children, setActiveTab }) => {
  const { theme } = useTheme();
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-shrink-0 relative overflow-visible">
        <Sidebar setActiveTab={setActiveTab} />
      </div>
      <div className="flex flex-col w-full min-w-0 min-h-0">
        <Header />
        <div
          style={{ backgroundColor: theme?.backgroundColor }}
          className="flex-1 overflow-auto px-4 py-4 min-w-0"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default HrLayout;