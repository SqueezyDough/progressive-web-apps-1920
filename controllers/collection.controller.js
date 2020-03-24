const fs = require('fs');

exports.getCollection = function(path) {
	return JSON.parse(fs.readFileSync(path))
}

exports.saveCollection = function(path, data) {
    if (fs.existsSync(path)) {
        const json = JSON.stringify(data);
        fs.writeFileSync('./collection/books.json', json);
    }

    return data
}