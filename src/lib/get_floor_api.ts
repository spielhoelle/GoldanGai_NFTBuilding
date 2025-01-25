export interface Floor {
    floorName: string;
    description: string;
    style?: string;
    gen_version?: string;
    versions: string;
    rooms: {
        roomName: string;
        description: string;
        room_prompt?: string;
        IG_link?: string; 
    }[]; // Use an array type instead of a tuple
}

import { json } from '@sveltejs/kit';

const floors: Floor[] = [
    {
        floorName: 'lobby',
        description: 'The main entrance of the building.',
        style: 'cool gallery in traditional style',
        versions: '6e7e34b8d739ab9d4d9a468ef773b5cd85a5c36b11f885379061ba2c70219d41',
        gen_version: '1.0',
        rooms: [
            { roomName: 'entrance', description: 'The main entrance hall.', room_prompt: 'spacious room',IG_link:"https://www.artgoldengai.com/#iframe-section" }
        ]
    },
    {
        floorName: 'floor-3',
        description: 'Third floor is the land of meme',
        style: 'chadmeme ',
        versions:"9f4377c65bab44b1e9e5be417b4fe152518a06b3ef08743205cc68716a174091",
        gen_version: '1.0',
        rooms: [
            { roomName: '301 Retardio', description: 'Retardio Cousins.', room_prompt: 'The image is a digital illustration of a cartoon character with long, colorful hair. The character is wearing a blue t-shirt with the number 18 on it. The hair is dyed in a rainbow of colors, including red, orange, yellow, green, blue, and purple. The eyes are large and black, and they have a sad expression on their face.', IG_link:"https://magiceden.io/marketplace/retardio_cousins"},
            { roomName: '308 Pepe', description: 'Pepe world.', room_prompt: 'Pepe the frog being super cute', IG_link:"https://colorcolor.wtf/" },
            { roomName: '311  MEME WORLD ORDER (MWO)', description: 'e Meme World Order (MWO) unites top meme teams and communities to redefine meme culture through creativity, collaboration, and inclusivity. Debuting at Tokyo Tower with Superchief Gallery and NFT Japan, MWO bridges memes and mass adoption, championing a movement that empowers and inspires. .',room_prompt:"Doge the dog being super cute", IG_link: 'https://www.instagram.com/ownthedoge' },
        ]
    },
   
    {
        floorName: 'floor-7',
        description: 'Seventh floor Burnout room.',
        style: 'n the style of MJV3, burnout',
        versions:"f8bba190713142471df7ef2adba00fe9c84f5d63b5c48702082f2718e7f4d8b2",
        gen_version: '1.1',
        rooms: [
            { roomName: '706 Tod Seelie', description: 'Photographer, artist, frequent pedaler, sometimes in LA and others in NYC', room_promt: 'The image is a photograph of a dirt road with power lines running along the sides. The road is surrounded by trees and bushes on both sides, and the sky is a warm orange color. The sun is setting in the background, casting a golden glow over the scene. The image is taken from a low angle, looking down the road towards the horizon. The overall mood of the image is peaceful and serene.',IG_link:"https://x.com/todseelie" },
            { roomName: '705 Kohei (Drift King)',description:'レッカーサービス 陸送 新車中古車販売 車検 修理 なんでも対応します',room_prompt:"The image shows a purple car driving on a road at night. The car is in motion, with the front of the car slightly blurred and the headlights on. The road is surrounded by trees and bushes, and there is a trail of smoke behind the car, indicating that it is moving at a high speed. The sky is dark and the overall mood of the image is dramatic and powerful.",IG_link:"https://www.instagram.com/bnr32_369/"},
            { roomName: '703 Etheric Matter',description:"",room_prompt:"The image is a black and white aerial view of a rocky surface. The surface appears to be rough and uneven, with deep grooves and crevices. The rocks are jagged and jagged, with some areas appearing darker and others lighter. In the center of the image, there is a large rock formation with a small hole in the center. The rock formation is surrounded by a thin layer of snow and ice. The image is taken from a top-down perspective, looking down on the surface.",IG_link:"https://www.instagram.com/andrea.bores/"},
        ]
    },
    {
        floorName: 'floor-8',
        description: 'Eighth floor Japanese village',
        style: 'art-in the style of TOK',
        versions:"f6db42ebb5ab496aeec5bf7a7ef2f6ea8e25785c80a952494fc915ccbe9e3d8b",
        gen_version: '1.1',
        rooms: [
            { roomName: '806 Shintaro kagi', description:"", room_prompt:"a illustration of a girl streaming with her head getting slip in two with a train and eye flowing out from it, portate image girl wearing sailor uniform",IG_link:"https://www.instagram.com/shintarokago1969/"},
            { roomName: '805 Elena Knox', description:" Artest ", room_prompt:"The image shows a woman sitting on a chair with her back to the camera. She is wearing a beige-colored dress with a high neckline and long sleeves. The dress appears to be made of a soft fabric and has small holes on the back. The woman's hair is long and straight, and she is standing with her hands on her hips. The chair is black and has a footrest. In the background, there is a white desk with a red tablecloth on it. The overall mood of the image is somber and contemplative.",IG_link:"https://www.instagram.com/elenaknoxx/"}
        ]
    },
    {
        floorName: 'floor-9',
        description: 'Ninth floor Cyberpunk.',
        style: 'style of 80s cyberpunk,',
        versions: "5d0cefd0746b833042b384c3a310bc4d1f9d1304ec59ba93e75097d40b967180",
        gen_version: '1.1',
        rooms: [
            { roomName: '906 Alligator Jesus', description: 'DavidTamargo  AlligatorJesus room full of teeth rack art .', room_prompt: 'A bold and striking visual of golden teeth, polished to perfection, glimmering under a moody and dramatic black background. The teeth exude opulence and raw power, with sharp edges and reflective surfaces creating a sense of luxury mixed with rebellion. The dark backdrop enhances the luminous gold, evoking a high-contrast, edgy aesthetic. This piece symbolizes wealth, dominance, and individuality, blending urban street culture with a luxurious, avant-garde vibe.',IG_link:"https://x.com/DavidTamargo" },
            { roomName: '905 naka renya', description:"", room_prompt:"The image is a digital illustration of a green dragon. The dragon is standing on its hind legs with its wings spread wide and its mouth open, as if it is roaring. It has a long, slender body with sharp claws and sharp teeth. Its wings are spread out behind it, giving it a fierce and powerful appearance.",IG_link:"https://www.instagram.com/naka_renya/"},
            { roomName: '905 VMO', description:"Ultimate Extreme Supreme Art Project", room_prompt:"five people posing for a photo in a dark room. They are all wearing black t-shirts with white face paint and black hair. The person in the center is wearing a black mask with spikes on it. The other three people are standing behind him, also wearing black masks. All of them are looking at the camera with serious expressions.",IG_link:"https://www.instagram.com/__vmo__"},
            { roomName: '901 Nostalgia' , description:"Not found", room_prompt:"Not found",IG_link:""}
        ]
    },
    {
        floorName: 'floor-10',
        description: 'Ninth floor DEKOTORA',
        style: 'A vibrant, highly detailed Dekotora-style truck adorned with an explosion of neon lights, chrome finishes',
        gen_version: '1.1',
        versions: "d0d48e298dcb51118c3f903817c833bba063936637a33ac52a8ffd6a94859af7",
        rooms: [
            { roomName: '1005 Shojon Tomo', description: 'Japanese contemporary artist /Painting / Interactive / Costume', room_prompt: ' a person with a bold red bob haircut standing in an eclectic' , IG_link:"https://www.instagram.com/shojonotomo/" },
            { roomName: '1002 POL KURCZ', description: 'Executive boardroom.', room_prompt:"A surreal and dramatic scene of a futuristic acrobat balancing upside down on the open jaws of a massive, hyper-realistic shark emerging from sparkling water. The acrobat wears a neon orange, semi-transparent outfit with matching thigh-high stockings and avant-garde accessories. Her bold makeup and intricate hairstyle give her a cyberpunk-meets-circus aesthetic. The background is a soft pastel sunset, with golden hues reflecting off the water, enhancing the ethereal and dreamlike atmosphere of the moment. The juxtaposition of danger and elegance creates a captivating, otherworldly spectacle.", IG_link:"https://www.instagram.com/polkurucz/" },
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
