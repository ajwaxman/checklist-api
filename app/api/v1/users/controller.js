import { prisma } from '../../../database.js';
import { parsePaginationParams, parseSortParams } from '../../../utils.js';
import { fields, encryptPassword, verifyPassword } from './model.js';

export const id = async (req, res, next) => {
  const { params = {} } = req;
  const { id = '' } = params;

  try {
    const data = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (data === null) {
      next({
        message: `user not found`,
        status: 404,
      });
    } else {
      res.locals.data = data;
      next();
    }
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { body = {} } = req;
  const { email, password } = body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return next({
        status: 404,
        message: 'Invalid email or password',
      });
    }

    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return next({
        status: 404,
        message: 'Invalid email or password',
      });
    }

    res.json({
      data: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  const { body = {} } = req;

  try {
    const password = await encryptPassword(body.password);
    const data = await prisma.user.create({
      data: {
        ...body,
        password,
      },
      select: {
        name: true,
        email: true,
      },
    });

    res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const all = async (req, res, next) => {
  const { query = {} } = req;
  const { limit, offset } = parsePaginationParams(query);
  const { orderBy, direction } = parseSortParams(fields, ...query);

  try {
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          [orderBy]: direction,
        },
      }),
      prisma.user.count(),
    ]);

    res.json({
      data,
      meta: {
        limit,
        offset,
        total,
        orderBy,
        direction,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const read = async (req, res, next) => {
  const { locals = {} } = res;

  const { data = {} } = locals;

  res.json({ data });
};

export const update = async (req, res, next) => {
  const { body = {}, params = {} } = req;
  const { id = '' } = params;

  try {
    const data = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  const { params = {} } = req;
  const { id = '' } = params;

  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
