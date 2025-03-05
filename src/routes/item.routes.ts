import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import {
  listItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/item.controller';

interface FailActionDetail {
  context: {
    key: string;
  };
  message: string;
}

interface FailActionError {
  details: FailActionDetail[];
}

export const itemRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/items',
    handler: listItems,
  },
  {
    method: 'GET',
    path: '/items/{id}',
    handler: getItem,
  },
  {
    method: 'POST',
    path: '/items',
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().required().messages({
            'any.required': 'Field "name" is required',
          }),
          price: Joi.number().min(0).required().messages({
            'any.required': 'Field "price" is required',
            'number.min': 'Field "price" cannot be negative',
          }),
        }),
        failAction: (_, h, err) => {
          const errors = (err as unknown as FailActionError)?.details.map(
            (detail: FailActionDetail) => ({
              field: detail.context.key,
              message: detail.message,
            }),
          );
          return h.response({ errors }).code(400).takeover();
        },
      },
    },
    handler: createItem,
  },
  {
    method: 'PUT',
    path: '/items/{id}',
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().optional(),
          price: Joi.number().min(0).optional().messages({
            'number.min': 'Field "price" cannot be negative',
          }),
        })
          .min(1)
          .unknown(false),
        failAction: (_, h, err) => {
          const errors = (err as unknown as FailActionError)?.details.map(
            (detail: FailActionDetail) => ({
              field: detail.context.key,
              message: detail.message,
            }),
          );
          return h.response({ errors }).code(400).takeover();
        },
      },
    },
    handler: updateItem,
  },
  {
    method: 'DELETE',
    path: '/items/{id}',
    handler: deleteItem,
  },
];
