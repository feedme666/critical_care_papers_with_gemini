const papersContext = require.context('./', false, /\.json$/);

const papers = papersContext.keys().map(papersContext);
console.log('Index.js - Loaded papers:', papers);
export default papers;