import models from './models.json';
import requests from './requests.json';

import { Schema } from '../models/Schema';
import mapStore from "../store/MapDatastore";
import { validateObjects } from '../routes/Router';
import { Obj } from '../models/types';

describe('validation tests', async () => {

    beforeEach(async () => {
        for await (const model of models) {
            await mapStore.insert(model as Schema);
        }
    })

    test('requests should be validated against the appropriate models', async () => {

        expect(await validateObjects(requests as Obj[], mapStore)).toMatchSnapshot()

    })

})
