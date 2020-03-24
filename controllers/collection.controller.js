const fs = require('fs');

exports.getCollection = function(path) {
	return JSON.parse(fs.readFileSync(path))
}

exports.saveCollection = function(path, data) {
    const json = JSON.stringify(data);
    fs.writeFileSync(path, json);

    return data
}