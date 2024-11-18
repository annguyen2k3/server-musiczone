module.exports = (objectPagination, req, countRecords) => {
    if (req.page) {
        objectPagination.currentPage = parseInt(req.page);
    }

    if (req.limit) {
        objectPagination.limitItems = parseInt(req.limit);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    objectPagination.totalPage = Math.ceil(countRecords / objectPagination.limitItems)

    return objectPagination;
}