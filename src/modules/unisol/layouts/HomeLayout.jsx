import Header from "../../../components/header/Header";
import HomeSidebar from "../../../components/sidebar/HomeSidebar";
import { useTheme } from "../../../hooks/theme/useTheme";

const HomeLayout = ({ children, setActiveTab }) => {
  const { theme } = useTheme();

  return (
    <div className="flex h-screen">
         {/* Sidebar */}
         <div className="flex-shrink-0">
           <HomeSidebar setActiveTab={setActiveTab} />
         </div>
   
         {/* Main Content Area */}
         <div className="flex flex-col w-full">
           <Header />
           <div
             style={{ backgroundColor: theme?.backgroundColor }}
             className="flex-1 overflow-y-auto px-4 py-4"
           >
             {children}
           </div>
         </div>
       </div>
  )
}

export default HomeLayout