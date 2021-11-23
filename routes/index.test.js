const { fetchData, charCounter, episodeLocations } = require('./index');

jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox());
const fetchMock = require('node-fetch');

beforeEach(() => {
    fetchMock.restore();
});

describe('Test Fetch Data', () => {
    it('Should return one value', async () => {

        const locationInfo = [
            {
                name: 'Earth (C-137)',
            },
        ];

        const info = {
            info: {
                count: 1,
            },
        };

        fetchMock.get('https://rickandmortyapi.com/api/location/', info);
        fetchMock.get('https://rickandmortyapi.com/api/location/1', locationInfo);

        const result = await fetchData('location');
        expect(result).toEqual(locationInfo);
        expect(result.length).toBe(1);
    });
});

describe('Test Char Counter', () => {
    it('Should return 5 characters from location name', async () => {

        const locationInfo = [
            {
                name: 'Earth (C-137)lllll',
            },
        ];

        const info = {
            info: {
                count: 1,
            },
        };

        const mockResponse = {
            char: 'l',
            count: 5,
            resource: 'location'
        };

        fetchMock.get('https://rickandmortyapi.com/api/location/', info);
        fetchMock.get('https://rickandmortyapi.com/api/location/1', locationInfo);

        const result = await charCounter('location', 'l');
        expect(result).toEqual(mockResponse);
    });
});

describe('Test Episode Locations', () => {
    it('something', async () => {

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

        const mockResponse = [{
            name: 'Pilot',
            episode: 'S01E01',
            count: 3,
            locations: [
                'Earth (C-137)',
                'unknown',
                'Earth (Replacement Dimension)'
            ]
        }];

        fetchMock.get('https://rickandmortyapi.com/api/character/', info);
        fetchMock.get('https://rickandmortyapi.com/api/episode/', info);

        fetchMock.get('https://rickandmortyapi.com/api/character/1,2,3', characterInfo);
        fetchMock.get('https://rickandmortyapi.com/api/episode/1,2,3', episodeInfo);

        const result = await episodeLocations();
        expect(result).toEqual(mockResponse);
    });
});