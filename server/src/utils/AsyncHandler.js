const asyncHandler = (fn) => { return (req, res, next) => {
    Promise.resolve(fn(res, res, next)).catch((err) => next(err))}
}
export { asyncHandler }