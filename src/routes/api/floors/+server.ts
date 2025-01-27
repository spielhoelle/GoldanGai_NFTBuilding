import { error, json } from '@sveltejs/kit';

const floors = [
  { floorName: 'lobby', description: 'The main entrance of the building.' },
  { floorName: 'floor-1', description: 'First floor description.' },
  { floorName: 'floor-2', description: 'Second floor description.' },
  { floorName: 'floor-3', description: 'Third floor description.' },
  { floorName: 'floor-4', description: 'Fourth floor description.' },
  { floorName: 'floor-5', description: 'Fifth floor description.' },
  { floorName: 'floor-6', description: 'Sixth floor description.' },
  { floorName: 'floor-7', description: 'Seventh floor description.' },
  { floorName: 'floor-8', description: 'Eighth floor description.' },
  { floorName: 'floor-9', description: 'Ninth floor description.' },

  // Add more floors as needed
];


export async function GET({ url }) {
  const floorName = url.searchParams.get('floorName') || 'lobby';

  const floor = floors.find(f => f.floorName === floorName);

  if (!floor) {
    return new Response(JSON.stringify({ error: 'Floor not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return json(floor);
}

// export async function GET_ALL() {
//     return json(floors);
// }
