import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Papa from "papaparse";
import { camelCaseFileName } from "../../common/utils/camelCaseFileName";
import { demoFiles } from "../../assets/demoFiles";

const initialState = {
  value: 0,
  error: null,
  status: "idle",
  filterDate: null,
  navIsOpen: true,
  files: {},
  demoFiles: demoFiles,
};

// Upload thunk. Accepts files object from file input.
export const uploadFilesThunk = createAsyncThunk(
  "data/uploadFilesThunk",
  async (files) => {
    // Array to store parsed files
    const parsedFiles = [];

    // Loop through files
    for (const file in files) {
      // Check file is valid
      if (files[file].type === "text/csv") {
        // Parse CSV with PapaParse
        await new Promise((resolve, reject) => {
          Papa.parse(files[file], {
            skipEmptyLines: true,
            complete: (results) => {
              parsedFiles.push({
                filename: camelCaseFileName(files[file].name),
                data: results,
              });
              resolve(results.data);
            },
            error: (err) => {
              reject(err);
            },
          });
        }).catch((err) => {
          console.error(err);
          return Promise.reject(err);
        });
      }
    }
    return parsedFiles;
  }
);

// Slice
export const dataReader = createSlice({
  name: "dataReader",
  initialState,
  reducers: {
    deleteStoredData: (state) => {
      state.files = {};
      state.error = null;
      state.status = "idle";
    },
    updateFilterDate: (state, action) => {
      state.filterDate = action.payload;
    },
    toggleNavIsOpen: (state) => {
      state.navIsOpen = !state.navIsOpen;
    },
    updateSpo2: (state, action) => {
      state.spo2 = action.payload;
    },
    updateHr: (state, action) => {
      state.hr = action.payload;
    },
    updateSleepState: (state, action) => {
      state.sleepState = action.payload;
    },
    updateSleep: (state, action) => {
      state.sleep = action.payload;
    },
    updateWeight: (state, action) => {
      state.weight = action.payload;
    },
    setDemoFiles: (state) => {
      state.files = state.demoFiles;
    },
  },
  extraReducers: (builder) => {
    builder
      // uploadFilesThunk handling
      .addCase(uploadFilesThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadFilesThunk.fulfilled, (state, action) => {
        state.status = "succeded";

        const files = action.payload;

        // Add each file to state
        files.forEach((file) => {
          state.files[file.filename] = file.data.data;
        });
      })
      .addCase(uploadFilesThunk.rejected, (state) => {
        state.status = "failed";
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  deleteStoredData,
  updateFilterDate,
  toggleNavIsOpen,
  updateSpo2,
  updateHr,
  updateSleepState,
  updateSleep,
  setDemoFiles,
  updateWeight,
} = dataReader.actions;

export default dataReader.reducer;
