import React from "react";
import { SidebarNav } from "../components/SidebarNav";

const MultiScanning: React.FC = () => {
  return (
    <div
      className="bg-black border-2 border-black
       
        grid  grid-cols-[20%_80%]
        grid-rows-[20vh_auto]h-full"
    >
      {/* div2 */}
      <div className="text-white col-span-3  p-4 text-center">
        MultiScanning
      </div>

      {/* div3 */}
      <div className="border-r-2 p-4">
        <SidebarNav />
      </div>

      {/* div4 */}
      <div className="col-span-2 p-4">div 4</div>
    </div>
  );
};

export default MultiScanning;
