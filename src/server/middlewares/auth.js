module.exports = () => (ctx, next) => {
  if (!process.env.API_KEY) {
    return next();
  }

  if (ctx.request.header['x-api-key'] === process.env.API_KEY) {
    return next();
  }

  return ctx.throw(401);
};
