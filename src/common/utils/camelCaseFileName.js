export const camelCaseFileName = filename => {
  const camelCase = filename
    .replace(/_/g, ' ') // replace underscores with spaces
    .replace(/-/g, ' ') // replace dashes with spaces
    .replace(/\(/g, ' ') // remove paranteses
    .replace(/\)/g, ' ')
    .replace('.csv', '') // remove file extension csv
    .replace('.txt', '') // remove file extension txt
    .replace(/(^|\s)\S/g, L => L.toUpperCase())
    .replace(/\s/g, ''); // remove spaces
  
  return camelCase.charAt(0).toLowerCase() + camelCase.substr(1)  // make first letter lowercase
}
