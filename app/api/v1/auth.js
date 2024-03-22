import jwt from 'jsonwebtoken';

import { configuration } from '../../config.js';

const { token } = configuration;
const { secret, expires } = token;

export const signToken = (payload, expiresIn = expires) =>
  jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn,
  });

export const auth = (req, res, next) => {
  let token = req.headers.authorization || '';
  if (token.startsWith('Bearer ')) {
    token = token.substring(7);
  }

  if (!token) {
    return next({
      status: 401,
      message: 'Unauthorized',
    });
  }

  jwt.verify(token, secret, (error, decoded) => {
    if (error) {
      return next({
        status: 401,
        message: 'Unauthorized',
      });
    } else {
      res.locals.decoded = decoded;
      next();
    }
  });
};

export const me = (req, res, next) => {
  const { params = {} } = req;
  const { id } = params;

  const { locals = {} } = res;
  const { decoded = {} } = locals;
  const { id: userId } = decoded;

  if (userId !== id) {
    return next({
      status: 403,
      message: 'Forbidden',
    });
  } else {
    next();
  }
};

export const owner = (req, res, next) => {
  const { locals = {} } = res;
  const { decoded = {} } = locals;
  const { id: userId } = decoded;

  const { data = {} } = locals;
  const { userId: ownerId } = data;

  if (userId !== ownerId) {
    return next({
      status: 403,
      message: 'Forbidden',
    });
  } else {
    next();
  }
};
