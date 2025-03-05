import { Request, ResponseToolkit } from '@hapi/hapi';
import logger from '../logger';
import prisma from '../prisma';
import { Prisma } from '@prisma/client';

export const listItems = async (_request: Request, h: ResponseToolkit) => {
  try {
    return await prisma.item.findMany();
  } catch (error) {
    logger.error(error);
    return h.response({ error: 'Error listing items' }).code(500);
  }
};

export const getItem = async (request: Request, h: ResponseToolkit) => {
  try {
    const itemId = Number(request.params.id);
    const item = await prisma.item.findUnique({
      where: {
        id: itemId as unknown as Prisma.ItemWhereUniqueInput['id'],
      },
    });
    if (!item) return h.response({ error: 'Item not found' }).code(404);
    return item;
  } catch (error) {
    logger.error(error);
    return h.response({ error: 'Error getting item' }).code(500);
  }
};

export const createItem = async (request: Request, h: ResponseToolkit) => {
  try {
    const data = request.payload as { name: string; price: number };
    const item = await prisma.item.create({ data });
    return h.response(item).code(201);
  } catch (error) {
    logger.error(error);
    return h.response({ error: 'Error creating item' }).code(500);
  }
};

export const updateItem = async (request: Request, h: ResponseToolkit) => {
  try {
    const itemId = Number(request.params.id);
    const updateData = request.payload as object;
    const updatedItem = await prisma.item.update({
      where: { id: itemId as unknown as Prisma.ItemWhereUniqueInput['id'] },
      data: updateData,
    });
    return updatedItem;
  } catch (error) {
    logger.error(error);
    return h.response({ error: 'Error updating item' }).code(500);
  }
};

export const deleteItem = async (request: Request, h: ResponseToolkit) => {
  try {
    const itemId = Number(request.params.id);
    await prisma.item.delete({
      where: { id: itemId as unknown as Prisma.ItemWhereUniqueInput['id'] },
    });
    return h.response().code(204);
  } catch (error) {
    logger.error(error);
    return h.response({ error: 'Error deleting item' }).code(500);
  }
};
