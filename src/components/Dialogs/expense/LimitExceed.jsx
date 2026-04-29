import React, { useEffect, useState } from "react";

const LimitExceed = ({ onClose}) => {
  // const [explanation, setExplanation] = useState({
  //   limitExceedExplanation: "",
  // });

  const onSubmit = (explanationText) => {
    console.log("Request sent with explanation:", explanationText);
  };

  // useEffect(() => {
  //   handleExplanation(explanation.limitExceedExplanation);
  // }, [explanation.limitExceedExplanation]);

  return (
    <div className="fixed bg-black bg-opacity-30 inset-0 flex items-center justify-center z-50">
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="w-[678px] h-[547px] bg-white rounded-md shadow-lg">
          <div className="p-4">
            <div className="flex flex-col justify-center items-center px-12 space-y-4">
              <h2 className="text-[23px] font-medium text-[#01008A]">
                Your limit has been exceeded
              </h2>
              <p className="px-16">
                If your daily travel expense exceeds, please provide the
                following details to request approval:
              </p>
            </div>
            <form className="pt-10">
              <div className="space-y-8">
                <div className="flex justify-between px-8">
                  <label className="text-black">
                    Explanation for Exceeding Limit
                  </label>
                  <textarea
                    placeholder="Enter explanation"
                    className="border border-gray-400 h-[80px] w-[261px] px-2 rounded-md"
                    name="limitExceedExplanation"
                    value={explanation.limitExceedExplanation}
                    onChange={(e) =>
                      setExplanation({
                        ...explanation,
                        limitExceedExplanation: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="w-full h-[180px] flex justify-center py-[74px] gap-8">
                <button
                  type="submit"
                  className="bg-[#A9C8F1] px-4 rounded-md border-2 text-[#004096] border-[#004096]"
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit(explanation.limitExceedExplanation);
                  }}
                >
                  Send Request to Admin
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#A9C8F1] bg-opacity-45 px-4 rounded-md border-2 text-[#004096] border-[#004096]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LimitExceed;
