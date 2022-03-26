import type { Model } from 'sequelize';
import Player = require('../../../db/models/Player');
import { CrudServices } from '../../types/layers';
import { IPlayer } from '../types/entity';
import * as customServices from './';

const crudServices = buildCrudServices<IPlayer, Player>(Player);

const services = { ...crudServices, ...customServices };

export { services };

// Typing is really badly done, but I don't want to spend more type unstanding sequelize typing
// https://stackoverflow.com/questions/55166230/sequelize-typescript-typeof-model
type Constructor<M> = new (...args: any[]) => M;
type ModelType<M extends Model<M>> = Constructor<M> & typeof Model;

function buildCrudServices<T, M extends Model<M>>(model: ModelType<M>): CrudServices<T> {

    const getDocument = async (id: number): Promise<T> => {
        const document = model.findByPk(id) as unknown as T | null;
        if (document === null) {
            throw new Error("Not found!");
        };
        return document;
    }

    return {
        getDocument
    }
}