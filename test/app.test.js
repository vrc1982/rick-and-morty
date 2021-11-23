const request = require("supertest");
const app = require('../app');

jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());
const fetchMock = require('node-fetch');


describe('App test', () => {
    it('Should get a 200 status code', async () => {

        const info = {
            info: {
                count: 3,
            },
        };

        const characterInfo = [
            {
                name: 'Rick Sanchez',
                url: 'https://rickandmortyapi.com/api/character/1',
                origin: {
                    name: 'Earth (C-137)',
                }
            },
            {
                name: 'Morty Smith',
                url: 'https://rickandmortyapi.com/api/character/2',
                origin: {
                    name: 'unknown',
                }
            },
            {
                name: 'Summer Smith',
                url: 'https://rickandmortyapi.com/api/character/3',
                origin: {
                    name: 'Earth (Replacement Dimension)',
                }
            }
        ];

        const locationInfo = [
            {
                name: 'Earth (C-137)',
            },
            {
                name: 'unknown',
            },
            {
                name: 'Earth (Replacement Dimension)'
            }
        ];

        const episodeInfo = [
            {
                name: 'Pilot',
                episode: 'S01E01',
                characters: [
                    'https://rickandmortyapi.com/api/character/1',
                    'https://rickandmortyapi.com/api/character/2',
                    'https://rickandmortyapi.com/api/character/3',
                ],
            }
        ];

        fetchMock.get('https://rickandmortyapi.com/api/character/', info);
        fetchMock.get('https://rickandmortyapi.com/api/location/', info);
        fetchMock.get('https://rickandmortyapi.com/api/episode/', info);

        fetchMock.get('https://rickandmortyapi.com/api/character/1,2,3', characterInfo);
        fetchMock.get('https://rickandmortyapi.com/api/location/1,2,3', locationInfo);
        fetchMock.get('https://rickandmortyapi.com/api/episode/1,2,3', episodeInfo);

        const response = await request(app).get("/")
        expect(response.statusCode).toBe(200);
    });
});