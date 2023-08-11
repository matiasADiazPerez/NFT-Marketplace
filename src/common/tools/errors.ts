import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidId extends Error {
  constructor() {
    super('Invalid Id');
  }
}

export class DeletedEntity extends Error {
  constructor(entity: string) {
    super(`The ${entity} is deleted`);
  }
}

export class EntityNotFound extends Error {
  constructor(entity: string, id: number) {
    super(`Could not find the ${entity} with id ${id}`);
  }
}

export const HandleErr = (
  err: InvalidId | DeletedEntity | HttpException | Error,
) => {
  if (err instanceof InvalidId || err instanceof DeletedEntity) {
    throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
  }

  if (err instanceof EntityNotFound) {
    throw new HttpException(err.message, HttpStatus.NOT_FOUND);
  }

  if (err instanceof HttpException) {
    throw err;
  }
  throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
};
