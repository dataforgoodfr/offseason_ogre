import Player = require('../../../db/models/Player');
import { buildCrudServices } from '../../utils/crudBuilders';
import { IPlayer } from '../types/entity';
import * as customServices from './';

const crudServices = buildCrudServices<IPlayer, Player>(Player);

const services = { ...crudServices, ...customServices };

export { services };
