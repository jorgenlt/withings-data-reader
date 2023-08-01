import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Papa from 'papaparse'
import format from 'date-fns/format'
import { filterByDate } from '../../common/utils/queryFilters'

const initialState = {
  value: 0,
  error: null,
  status: 'idle',
  spo2Auto: [],
  filteredSpo2Auto: [],
  files: {}
}

// Upload thunks
export const uploadFileThunk = createAsyncThunk(
  'data/uploadFileThunk',
  async file => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        skipEmptyLines: true,
        complete: results => {
          resolve(results.data);
        },
        error: err => {
          reject(err);
        }
      });
    }).catch(err => {
      console.error(err);
      return Promise.reject(err);
    });
  }
  );
  
  export const uploadFilesThunk = createAsyncThunk(
    'data/uploadFilesThunk',
    async files => {
      const parsedFiles = [];
      for (const file in files) {
        // Check if it is a valid file
        if (files[file].type === "text/csv") {
          
          await new Promise((resolve, reject) => {
            Papa.parse(files[file], {
              skipEmptyLines: true,
              complete: results => {
                parsedFiles.push(
                  {
                    filename: files[file].name, 
                    data: results
                  }
                );
                resolve(results.data);
              },
              error: err => {
                reject(err);
              }
            });
          })
          .catch(err => {
            console.error(err);
            return Promise.reject(err);
          });
        }
      }
      return parsedFiles;
    }
    );
    
    
    
    
    
    export const dataReader = createSlice({
      name: 'dataReader',
      initialState,
      reducers: {
        filterSpo2: (state, action) => {
          state.filteredSpo2Auto = filterByDate(state.spo2Auto, action.payload)
        }
      },
      extraReducers: builder => {
        builder
        .addCase(uploadFileThunk.pending, state => {
          state.status = 'loading';
        })
        .addCase(uploadFileThunk.fulfilled, (state, action) => {
          state.status = 'succeeded';
          
          // remove headers
          action.payload.shift();
          
          // Creating an array of objects
          const data = action.payload.map(row => {
            const start = row[0] ? format(new Date(row[0]), 'MMMM dd yyyy, h:mm aaa') : '';
            const time = row[0] ? format(new Date(row[0]), 'h:mm aaa') : '';
            const value = row[2] ? parseInt(row[2].replace(/[[\]]/g, '')) : '';
            
            return {
              start,
              time,
              value
            }
          });
          
          // Sort by date
          const sortedData = data.sort((a, b) => new Date(a.start) - new Date(b.start))
          
          // Updating spo2Auto in state
          state.spo2Auto = sortedData;
          state.filteredSpo2Auto = filterByDate(sortedData, new Date(sortedData[sortedData.length - 1].start))
        })
        .addCase(uploadFileThunk.rejected, state => {
          state.status = 'failed';
        })
        
        
        // upload multiple files
        .addCase(uploadFilesThunk.pending, state => {
          state.status = 'loading';
        })
        .addCase(uploadFilesThunk.fulfilled, (state, action) => {
          const files = action.payload;

          files.forEach(file => {
            state.files[file.filename] = file.data.data;
          });
          
        })
        .addCase(uploadFilesThunk.rejected, state => {
          state.status = 'failed';
        });
      }
    })
    
    // Action creators are generated for each case reducer function
    export const { filterSpo2 } = dataReader.actions
    
    export default dataReader.reducer