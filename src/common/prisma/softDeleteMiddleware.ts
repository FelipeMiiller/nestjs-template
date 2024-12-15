const Models = ['User'];
export const softDeleteMiddleware = (prisma) => {
  prisma.$use(async (params, next) => {
    if (Models.includes(params.model)) {
      if (
        params.action === 'findUnique' ||
        params.action === 'findFirst' ||
        params.action === 'findFirstOrThrow' ||
        params.action === 'findUniqueOrThrow' ||
        params.action === 'findMany'
      ) {
        if (!params.args) {
          params.args = {};
        }

        if (!params.args.where) {
          params.args.where = { Deleted: false };
        } else {
          params.args.where.Deleted = params.args.where.Deleted ?? false;
        }
      }
    }

    if (Models.includes(params.model)) {
      if (params.action === 'update' || params.action === 'updateMany') {
        if (!params.args) {
          params.args = { where: {}, data: {} };
        }

        if (!params.args.where) {
          params.args.where = { Deleted: false };
        } else {
          params.args.where.Deleted = false;
        }
      }
    }

    if (Models.includes(params.model)) {
      if (params.action === 'delete') {
        params.action = 'update';
        if (!params.args) {
          params.args = {
            where: {},
            data: { Deleted: true, DeletedAt: new Date() },
          };
        } else {
          params.args.data = { Deleted: true, DeletedAt: new Date() };
        }
      }

      if (params.action === 'deleteMany') {
        params.action = 'updateMany';
        if (!params.args) {
          params.args = {
            where: {},
            data: { Deleted: true, DeletedAt: new Date() },
          };
        } else {
          params.args.data = { Deleted: true, DeletedAt: new Date() };
        }
      }
    }

    return next(params);
  });
};
