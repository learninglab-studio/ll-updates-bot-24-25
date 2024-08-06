const at = require("../../utils/ll-airtable-tools")
const llog = require("learninglab-log")

module.exports = async (tables) => {
    llog.magenta('getting config')
    let config = {};
    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];

        llog.blue('working on table', table)
        let records = await at.findMany({
            baseId: process.env.AIRTABLE_UPDATES_BASE_ID,
            table: table.name,
            maxRecords: 1000,
            view: "MAIN"
        })
    
        
        const filteredRecords = records.map(record => {
            let filteredRecord = { id: record.id };
            table.fields.forEach(field => {
              if (record.fields[field] !== undefined) {
                filteredRecord[field] = record.fields[field];
              }
            });
            return filteredRecord;
          });
      
          config[table.name] = filteredRecords;

    }
    return config
}