exports.renderView = function(res, viewName, data) {
    data.title = `${process.env.NAME} - ${viewName}`
    res.render(viewName, data)
}
