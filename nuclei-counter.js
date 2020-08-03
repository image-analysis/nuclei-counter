//Made by Daniel Waiger 31.07.2020 - On Fiji 1.53c with Bio-formats 6.6.0

/* The input for this script should be a floating 32-bit .tiff file from ilastik
 *  in this specific case it's DAPI images.
 *  The outputs are a binary image with ROIs, a .zip file with the nuclear ROIs, and a .csv file with the number of ROIs.
 */

//1. Open a floating 32-bit .tiff file from ilastik before running this script:
showMessage("Choose input image", "Load a floating 32-bit file exported from ilastik / binary segmented image");
run("Open...");

//2. Getting the name and title of the image
orgName = getTitle();


//3. Selecting the output folder to save ROIs later
output_path = getDirectory("Choose output folder");
fileList = getFileList(output_path);


//4. Selecting the image window and start processing binary images made by ilastik
selectWindow(orgName);
run("Duplicate...", "title=" + orgName + "copy");

//5. Making nuclei value > Background value.
showMessage("Background check", "Value of your particle of interest should be higher than background value. If not, delete '//' before //run on the script editor");
run("Invert");


//7. Making an 8-bit from 32-bit (made by ilastik)
run("8-bit");

//8. Making whole nuclei
run("Fill Holes");
run("Dilate");

//9. Counting nuclei - Number of pixels depend on resolution and magnification - therefore adapt the size parameter accordingly!
run("Set Measurements...", "area perimeter display redirect=None decimal=3");
showMessage("Adjust particle size accroding to the acquisition settings");
num = getNumber("Minimum size of target particle", 1000)
run("Analyze Particles...", "size=" + num + " display exclude clear include summarize add in_situ");

//10. Saving ROIs to a .zip file
roiManager("save", output_path + orgName + ".zip")


//11. Show process complete
showMessage("ROI Extraction", orgName + " ROIs .zip file saved!");
roiManager("reset");

//12. Saving Results to a .csv
selectWindow("Results");
saveAs("Results", output_path + orgName + ".csv");

//13. Closing open windows
run("Close All");
