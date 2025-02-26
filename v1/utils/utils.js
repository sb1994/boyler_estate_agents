const { v4: uuidv4 } = require("uuid");

const traceMiddleware = (req, res, next) => {
  // Generate a new unique trace token for each request
  const traceToken = uuidv4();

  req.traceToken = traceToken; // Attach to request object

  // Set trace token in response headers for debugging & tracing across services
  res.setHeader("X-Trace-Token", traceToken);

  next();
};

const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && Object.keys(value).length === 0)
  );
};

const verifyToken = (req, res, next) => {
  // const
};
module.exports = {
  isEmpty,
  verifyToken,
  traceMiddleware,
};
