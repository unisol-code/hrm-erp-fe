import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddIcon from "@mui/icons-material/Add";
const experiences = [
  {
    id: 1,
    companyName: "Z International",
    designation: " UI/UX Designer",
    experience: 4,
    location: "Banglore",
    typeOfJob: "Permanent",
  },
  {
    id: 2,
    companyName: "Wisdom Creative",
    designation: " Graphic Designer",
    experience: 1,
    location: "Kochi",
    typeOfJob: "Permanent",
  },
];

const ViewPreviousExperience = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [addFormData, setAddFormData] = useState(experiences);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddInputField = () => {
    setAddFormData([
      ...addFormData,
      {
        id: "",
        companyName: "",
        designation: "",
        experience: "",
        location: "",
        typeOfJob: "",
      },
    ]);
  };

  const handleInputChange = (e, index) => {
    console.log(e.target.name);
    console.log(e.target.value);
    const list = [...addFormData];
    list[index][e.target.name];
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  };

  return (
    <div>
      <VisibilityIcon className="cursor-pointer" onClick={handleClickOpen} />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"md"}>
        <form onSubmit={handleFormSubmit}>
          <TableContainer fullWidth>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className="bg-[#CDEDF9]">
                <TableRow>
                  <TableCell align="left">Company Name</TableCell>
                  <TableCell align="center">Designation</TableCell>
                  <TableCell align="center">Experience</TableCell>
                  <TableCell align="center">Location</TableCell>
                  <TableCell align="center">Type Of Job</TableCell>
                  <TableCell
                    sx={{
                      width: 50,
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                    }}
                    align="center"
                  >
                    <BorderColorIcon
                      className="cursor-pointer"
                      onClick={() => setIsEditing(true)}
                    />
                    <CloseIcon
                      className="cursor-pointer"
                      onClick={handleClose}
                    ></CloseIcon>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addFormData.map((experience, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left" component="th" scope="row">
                      {isEditing ? (
                        <input
                          name="companyName"
                          value={experience.companyName}
                          placeholder="company"
                          className="border-2 border-gray-400 rounded-lg w-[100px] mx-2 px-4 h-[35px]"
                          onChange={(e) => handleInputChange(e, index)}
                        ></input>
                      ) : (
                        experience.companyName
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {isEditing ? (
                        <select
                          className="max-w-[150px] border-2 border-gray-400 rounded-lg h-[35px] px-2"
                          name="designation"
                          id=""
                          value={experience.designation}
                          onChange={(e) => handleInputChange(e, index)}
                        >
                          <option value="Graphic Designer">
                            Graphic Designer
                          </option>
                          <option value="Graphic Designer">
                            UI/UX Designer
                          </option>
                          <option value="Graphic Designer">
                            Frontend Developer
                          </option>
                        </select>
                      ) : (
                        experience.designation
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {isEditing ? (
                        <input
                          name="currentStatus"
                          value={experience.experience}
                          placeholder="in years"
                          className="border-2 border-gray-400 rounded-lg w-[100px] mx-2 px-4 h-[35px]"
                          type="number"
                          onChange={(e) => handleInputChange(e, index)}
                        ></input>
                      ) : (
                        experience.experience
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {isEditing ? (
                        <select
                          className="max-w-[150px] border-2 border-gray-400 rounded-lg h-[35px] px-2"
                          name="location"
                          id=""
                          value={experience.location}
                          onChange={(e) => handleInputChange(e, index)}
                        >
                          <option value="Graphic Designer">Banglore</option>
                          <option value="Graphic Designer">Mumbai</option>
                          <option value="Graphic Designer">Pune</option>
                        </select>
                      ) : (
                        experience.location
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {isEditing ? (
                        <select
                          className="max-w-[150px] border-2 border-gray-400 rounded-lg h-[35px] px-2"
                          name="typeOfJob"
                          id=""
                          value={experience.typeOfJob}
                          onChange={(e) => handleInputChange(e, index)}
                        >
                          <option value="Graphic Designer">Remote</option>
                          <option value="Graphic Designer">Permanent</option>
                        </select>
                      ) : (
                        experience.typeOfJob
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {isEditing && (
            <div className="w-full flex py-8 justify-center gap-8">
              <button
                onClick={handleAddInputField}
                className="bg-[#BDC3C9] bg-opacity-30 hover:bg-[#BDC3C9] border-2 border-gray-400 px-6 py-2 rounded-lg text-gray-500"
              >
                <AddIcon color="primary" /> Add More Rows
              </button>
              <button
                type="submit"
                className="py-2 px-6 rounded-lg bg-[#709EB1] text-white"
              >
                Save
              </button>
            </div>
          )}
        </form>
      </Dialog>
    </div>
  );
};

export default ViewPreviousExperience;
