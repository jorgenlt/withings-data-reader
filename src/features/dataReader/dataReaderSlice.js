import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Papa from 'papaparse'
import format from 'date-fns/format'
import { filterByDate } from '../../common/utils/queryFilters'

const initialState = {
  value: 0,
  error: null,
  status: 'idle',
  spo2Auto: [],
  filteredSpo2Auto: []
}

// Upload thunk
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

export const dataReader = createSlice({
  name: 'dataReader',
  initialState,
  reducers: {
    filterSp02: (state, action) => {
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
          const start = row[0] ? format(new Date(row[0]), 'MMM dd yyyy, HH:mm') : '';
          const duration = row[1] ? parseInt(row[1].replace(/[[\]]/g, '')) : '';
          const value = row[2] ? parseInt(row[2].replace(/[[\]]/g, '')) : '';

          return {
            start,
            duration,
            value
          }
        });

        // Sort by date
        const sortedData = data.sort((a, b) => new Date(a.start) - new Date(b.start))
        console.log(sortedData);
        // Updating spo2Auto in state
        state.spo2Auto = sortedData;
      })
      .addCase(uploadFileThunk.rejected, state => {
        state.status = 'failed';
      })
  }
})

// Action creators are generated for each case reducer function
export const { filterSp02 } = dataReader.actions

export default dataReader.reducer