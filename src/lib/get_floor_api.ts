export interface Floor {
    floorName: string;
    description: string;
    style?: string;
    gen_version?: string;
    rooms: [
        { roomName: string; description: string; room_style?: string }
    ];
}

import { json } from '@sveltejs/kit';

const floors: Floor[] = [
    {
        floorName: 'lobby',
        description: 'The main entrance of the building.',
        style: 'modern',
        gen_version: '1.0',
        rooms: [
            { roomName: 'entrance', description: 'The main entrance hall.', room_style: 'spacious' }
        ]
    },
    {
        floorName: 'floor-1',
        description: 'First floor description.',
        style: 'minimalist',
        gen_version: '1.0',
        rooms: [
            { roomName: 'office-101', description: 'Office room 101.', room_style: 'contemporary' },
        ]
    },
    {
        floorName: 'floor-2',
        description: 'Second floor description.',
        style: 'industrial',
        gen_version: '1.0',
        rooms: [
            { roomName: 'office-201', description: 'Office room 201.', room_style: 'modern' }
        ]
    },
    {
        floorName: 'floor-3',
        description: 'Third floor description.',
        style: 'art-deco',
        gen_version: '1.0',
        rooms: [
            { roomName: 'office-301', description: 'Office room 301.', room_style: 'retro' }
        ]
    },
    {
        floorName: 'floor-4',
        description: 'Fourth floor description.',
        style: 'classic',
        gen_version: '1.0',
        rooms: [
            { roomName: 'office-401', description: 'Office room 401.', room_style: 'traditional' }
        ]
    },
    {
        floorName: 'floor-5',
        description: 'Fifth floor description.',
        style: 'contemporary',
        gen_version: '1.1',
        rooms: [
            { roomName: 'lounge', description: 'Relaxation lounge.', room_style: 'modern' }
        ]
    },
    {
        floorName: 'floor-6',
        description: 'Sixth floor description.',
        style: 'minimalist',
        gen_version: '1.1',
        rooms: [
            { roomName: 'office-601', description: 'Office room 601.', room_style: 'minimalist' }
        ]
    },
    {
        floorName: 'floor-7',
        description: 'Seventh floor description.',
        style: 'industrial',
        gen_version: '1.1',
        rooms: [
            { roomName: 'lab', description: 'Research lab.', room_style: 'industrial' }
        ]
    },
    {
        floorName: 'floor-8',
        description: 'Eighth floor description.',
        style: 'art-deco',
        gen_version: '1.1',
        rooms: [
            { roomName: 'gallery', description: 'Art gallery room.', room_style: 'vintage' }
        ]
    },
    {
        floorName: 'floor-9',
        description: 'Ninth floor description.',
        style: 'modern',
        gen_version: '1.1',
        rooms: [
            { roomName: 'boardroom', description: 'Executive boardroom.', room_style: 'sleek' }
        ]
    }
    // Add more floors as needed
];


export async function getFloorDetails(floorName: string): Promise<Response> {
    try {
        console.log('Fetching floor details for:', floorName);

        // Find the floor matching the provided floorName
        const floor = floors.find(f => f.floorName === floorName);
            
        // If floor is not found, return 404 with an error message
        if (!floor) {
            return new Response(
                JSON.stringify({ error: 'Floor not found' }),
                {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // If the floor is found, return it with a 200 status
        return json(floor);
    } catch (err) {
        console.error('Error fetching floor details:', err);
        return new Response(
            JSON.stringify({ error: 'An internal server error occurred.' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}


export const floorNames = floors
