import React from 'react'
import { useTheme } from '../../../hooks/theme/useTheme'
import { X } from 'lucide-react';
import Button from '../../Button';

const ShowAppraisalDetails = ({ appraisalState, onClick }) => {
  const { theme } = useTheme();
  console.log(appraisalState);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm p-10">
      <div className="bg-white flex flex-col shadow-lg w-[70vw] max-h-[80vh] overflow-y-auto rounded-2xl">
        {/* Header */}
        <div
          className="flex flex-row px-8 py-6 items-center justify-between gap-6 w-full"
          style={{ backgroundColor: theme.secondaryColor }}
        >
          <div className="text-2xl font-semibold">{appraisalState.title}</div>
          <button className="text-black-500 hover:opacity-70" onClick={onClick}>
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col px-8 py-6">
          <h2 className="text-lg font-semibold mb-3">Description:</h2>
          <p className="text-base leading-relaxed whitespace-pre-line">{appraisalState.description || "N/A"}</p>
        </div>
        <hr />

        <div className="flex flex-col px-8 py-6">
          <h2 className="text-lg font-semibold mb-3">Detailed Description:</h2>
          <p className="text-base leading-relaxed whitespace-pre-line">{appraisalState.detailedDescription || "N/A"}</p>
        </div>
        <hr />

        {/* <div className='flex item-center justify-end m-5'>
          <Button variant={1} onClick={onClick}>Close</Button>
        </div> */}
      </div>
    </div>
  )
}

export default ShowAppraisalDetails;