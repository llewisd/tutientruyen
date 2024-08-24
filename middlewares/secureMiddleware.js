function escapeHTML(str) {
     return str
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#039;')
         .replace(/{/g, '&#123;')
         .replace(/}/g, '&#125;').trim();
 }
 
const stringEscape = (req, res, next) => {
     const body_data = req.body;
     const query_data = req.query;
     for (const key of Object.keys(body_data)) {
          body_data[key] = escapeHTML(body_data[key]);
     }
     for (const key of Object.keys(query_data)) {
          query_data[key] = escapeHTML(query_data[key]);
     }
     req.query = query_data;
     next();
}

module.exports = {stringEscape};