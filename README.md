# Critical Care Papers

This project is a web application for summarizing and critically appraising research papers in the field of critical care. It is designed to help medical professionals quickly understand the key findings and limitations of important studies.

## Project Overview

The application displays a list of research papers. Users can click on a paper to view a detailed summary, including:

*   A concise summary of the study
*   The PICO (Patient, Intervention, Comparison, Outcome) framework
*   Detailed results, including interactive charts
*   A critical appraisal of the study's strengths and weaknesses

## How to Add a New Paper

To add a new paper to the application, follow these steps:

1.  **Place the PDF file** of the research paper into the `raw_pdfs/` directory.
2.  **Run the processing script** (Note: This step is currently performed by a Gemini agent). The script will:
    *   Perform OCR on the PDF to extract the text.
    *   Generate a structured JSON file containing the summary, PICO, results, and critical appraisal.
    *   Save the new JSON file to the `src/data/papers/` directory.
    *   Move the original PDF from `raw_pdfs/` to `processed_pdfs/`.
3.  **Verify the new paper** is displayed correctly in the application.

## Project Structure

*   `public/`: Contains the main HTML file and other static assets.
*   `src/`: Contains the React application source code.
    *   `components/`: React components used to build the application.
    *   `data/papers/`: Contains the JSON data for each research paper.
*   `raw_pdfs/`: Directory for placing new PDF files to be processed.
*   `processed_pdfs/`: Directory where processed PDFs are moved.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.