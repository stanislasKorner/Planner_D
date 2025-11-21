import { Attraction, Park, Land } from './types';

export const USERS_LIST = [
  "Alexandre", "Apolline", "Benoît", "Camille", "Celeste", "Cécile",
  "Elisabeth", "Igor", "Izza", "Hamza", "Jean", "Leo", "Lucas",
  "Margot", "Marie", "Maxime", "Mina", "Nicolas", "Pernelle",
  "Raphaël", "Romain", "Ruben", "Sathasivam", "Tiphaine", "William"
];

export const QUIZ_DATA = [
  {
    id: 'attractionType',
    question: "Quel type d’attractions Disney t’attire le plus ?",
    options: [
      { id: 'classic', label: "Classiques & immersives", desc: "Pirates, Peter Pan, Ratatouille... la magie sans migraine" },
      { id: 'adventure', label: "Aventure modérée", desc: "Big Thunder Mountain, Star Tours... ça secoue, mais on ressort coiffé" },
      { id: 'thrill', label: "Sensations fortes", desc: "Space Mountain, Indiana Jones... l’ostéo te remercie déjà" },
      { id: 'story', label: "Expériences épiques", desc: "Quand tu veux vivre un film plutôt qu’une attraction" },
      { id: 'unknown', label: "Aucune idée", desc: "Surprends-moi, je signe les yeux fermés" }
    ]
  },
  {
    id: 'adrenalineLevel',
    question: "Ton niveau d’adrénaline recherché ?",
    options: [
      { id: 'chill', label: "Tranquille", desc: "Je profite du décor — team photos Insta avant tout" },
      { id: 'medium', label: "Un peu de mouvement", desc: "Le juste milieu, comme une tisane énergisante" },
      { id: 'fast', label: "Rapide & Intense", desc: "La vie c’est mieux à 70 km/h dans le noir" },
      { id: 'extreme', label: "Extrême", desc: "Si ça tourne, crie ou explose, je suis dedans" }
    ]
  },
  {
    id: 'avoidance',
    question: "Y a-t-il quelque chose que tu préfères éviter ?",
    options: [
      { id: 'heights', label: "Hauteurs", desc: "Rester au sol, c’est très bien aussi" },
      { id: 'loops', label: "Loopings / Inversions", desc: "Mon estomac dit non" },
      { id: 'dark', label: "Obscurité / Effrayant", desc: "Trop de suspense tue le suspense" },
      { id: 'none', label: "Rien, je suis partant", desc: "Même pour les files d’attente de 90 min" }
    ]
  }
];

export const WEATHER_FORECAST = [
  { hour: '09h', temp: '2°', condition: 'cloudy', icon: 'cloud' },
  { hour: '10h', temp: '3°', condition: 'cloudy', icon: 'cloud' },
  { hour: '11h', temp: '4°', condition: 'sunny', icon: 'sun' },
  { hour: '12h', temp: '6°', condition: 'sunny', icon: 'sun' },
  { hour: '13h', temp: '7°', condition: 'partly-cloudy', icon: 'cloud-sun' },
  { hour: '14h', temp: '7°', condition: 'partly-cloudy', icon: 'cloud-sun' },
  { hour: '15h', temp: '6°', condition: 'rainy', icon: 'cloud-rain' },
  { hour: '16h', temp: '5°', condition: 'rainy', icon: 'cloud-rain' },
  { hour: '17h', temp: '4°', condition: 'cloudy', icon: 'cloud' },
  { hour: '18h', temp: '3°', condition: 'clear', icon: 'moon' },
  { hour: '19h', temp: '2°', condition: 'clear', icon: 'moon' },
];

export const ATTRACTIONS: Attraction[] = [
  // --- MAIN STREET U.S.A. ---
  { 
    id: 'dlp_1', 
    name: 'Disneyland Railroad', 
    park: Park.DISNEYLAND, 
    land: Land.MAIN_STREET, 
    avgWait: 20, 
    duration: 20, 
    x: 50, 
    y: 90,
    description: "Faites le tour du Parc Disneyland à bord d'un train à vapeur authentique pour une vue panoramique relaxante.",
    imageUrl: 'https://images.unsplash.com/photo-1562101884-392f53523816?auto=format&fit=crop&w=800&q=80', // Train Vapeur
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/disneyland-railroad/',
    youtubeUrl: 'https://www.youtube.com/watch?v=8K4y_Yq0y_4',
    reviewSummary: "Un incontournable pour se reposer et voir le parc sous un autre angle. Le charme du train à vapeur opère toujours."
  },
  { 
    id: 'dlp_main_2', 
    name: 'Main Street Vehicles', 
    park: Park.DISNEYLAND, 
    land: Land.MAIN_STREET, 
    avgWait: 10, 
    duration: 5, 
    x: 50, 
    y: 82,
    description: "Remontez le temps à bord d'une voiture ancienne, d'un omnibus ou d'un camion de pompiers du début du 20ème siècle.",
    imageUrl: 'https://images.unsplash.com/photo-1599652477790-b090487b866e?auto=format&fit=crop&w=800&q=80', // Voiture Vintage
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/main-street-vehicles/',
    youtubeUrl: 'https://www.youtube.com/watch?v=1_2_3_4_5', // Placeholder
    reviewSummary: "Sympa pour remonter Main Street sans marcher. Les conducteurs sont souvent drôles et l'ambiance rétro est top."
  },

  // --- FRONTIERLAND ---
  { 
    id: 'dlp_2', 
    name: 'Big Thunder Mountain', 
    park: Park.DISNEYLAND, 
    land: Land.FRONTIERLAND, 
    avgWait: 45, 
    duration: 4, 
    x: 20, 
    y: 60,
    description: "Le train de la mine le plus célèbre de l'Ouest ! Une montagne russe familiale palpitante au cœur d'une mine hantée.",
    imageUrl: 'https://images.unsplash.com/photo-1582034986464-662a079280a4?auto=format&fit=crop&w=800&q=80', // Mine / Canyon
    intensity: 'Sensations fortes',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/big-thunder-mountain/',
    youtubeUrl: 'https://www.youtube.com/watch?v=3_4_5_6_7',
    reviewSummary: "Le meilleur train de la mine ! Les sensations sont là sans être trop violentes, et le passage sous l'eau est culte."
  },
  { 
    id: 'dlp_3', 
    name: 'Phantom Manor', 
    park: Park.DISNEYLAND, 
    land: Land.FRONTIERLAND, 
    avgWait: 20, 
    duration: 10, 
    x: 15, 
    y: 75,
    description: "Pénétrez dans ce manoir délabré où 999 fantômes vous attendent pour une visite mystérieuse et envoûtante.",
    imageUrl: 'https://images.unsplash.com/photo-1509557965875-b88c8cc2d8b6?auto=format&fit=crop&w=800&q=80', // Manoir Hanté
    intensity: 'Modéré',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/phantom-manor/',
    youtubeUrl: 'https://www.youtube.com/watch?v=5_6_7_8_9',
    reviewSummary: "L'ambiance est incroyable dès la file d'attente. Les effets spéciaux sont magnifiques et l'histoire captivante."
  },
  { 
    id: 'dlp_frontier_3', 
    name: 'Thunder Mesa Riverboat Landing', 
    park: Park.DISNEYLAND, 
    land: Land.FRONTIERLAND, 
    avgWait: 15, 
    duration: 15, 
    x: 30, 
    y: 65,
    description: "Embarquez pour une croisière majestueuse sur les rivières du Far West à bord d'un vieux bateau à aubes.",
    imageUrl: 'https://images.unsplash.com/photo-1561400581-39d2a66c5211?auto=format&fit=crop&w=800&q=80', // Bateau aubes
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/thunder-mesa-riverboat-landing/',
    youtubeUrl: 'https://www.youtube.com/watch?v=7_8_9_0_1',
    reviewSummary: "Une balade très apaisante avec de superbes vues inédites sur Big Thunder Mountain. Idéal pour faire une pause."
  },

  // --- ADVENTURELAND ---
  { 
    id: 'dlp_4', 
    name: 'Pirates of the Caribbean', 
    park: Park.DISNEYLAND, 
    land: Land.ADVENTURELAND, 
    avgWait: 25, 
    duration: 10, 
    x: 15, 
    y: 45,
    description: "Embarquez pour une croisière au temps des pirates, rythmée par la célèbre chanson 'Yo Ho, Yo Ho'.",
    imageUrl: 'https://images.unsplash.com/photo-1605218427368-351816b93660?auto=format&fit=crop&w=800&q=80', // Bateau Pirate
    intensity: 'Modéré',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/pirates-of-the-caribbean/',
    youtubeUrl: 'https://www.youtube.com/watch?v=9_0_1_2_3',
    reviewSummary: "L'immersion est totale, on a vraiment l'impression d'y être. La petite chute surprend toujours agréablement !"
  },
  { 
    id: 'dlp_5', 
    name: 'Indiana Jones™ et le Temple du Péril', 
    park: Park.DISNEYLAND, 
    land: Land.ADVENTURELAND, 
    avgWait: 30, 
    duration: 2, 
    x: 10, 
    y: 35,
    description: "Une aventure trépidante en wagonnet à travers des ruines antiques, incluant un looping impressionnant.",
    imageUrl: 'https://images.unsplash.com/photo-1515444983818-a9631a25b55c?auto=format&fit=crop&w=800&q=80', // Ruines Temple
    intensity: 'Sensations fortes',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/indiana-jones-and-the-temple-of-peril/',
    youtubeUrl: 'https://www.youtube.com/watch?v=2_3_4_5_6',
    reviewSummary: "Ça secoue beaucoup, attention aux oreilles ! Le looping est sympa mais le tour est vraiment très court."
  },
  { 
    id: 'dlp_adv_3', 
    name: 'La Cabane des Robinson', 
    park: Park.DISNEYLAND, 
    land: Land.ADVENTURELAND, 
    avgWait: 0, 
    duration: 15, 
    x: 25, 
    y: 45,
    description: "Grimpez au sommet de cet arbre gigantesque pour explorer la maison naufragée de la famille Suisse Robinson.",
    imageUrl: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80', // Cabane Arbre
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/la-cabane-des-robinson/',
    youtubeUrl: 'https://www.youtube.com/watch?v=4_5_6_7_8',
    reviewSummary: "Beaucoup de marches à monter, mais la vue en haut est imprenable. Les détails de la reconstitution sont bluffants."
  },
  { 
    id: 'dlp_adv_4', 
    name: 'Le Passage Enchanté d\'Aladdin', 
    park: Park.DISNEYLAND, 
    land: Land.ADVENTURELAND, 
    avgWait: 0, 
    duration: 10, 
    x: 20, 
    y: 40,
    description: "Une promenade à pied à travers des scènes miniatures recréant l'histoire d'Aladdin.",
    imageUrl: 'https://images.unsplash.com/photo-1542665174-bb263e2be9f9?auto=format&fit=crop&w=800&q=80', // Oriental / Souk
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/le-passage-enchante-d-aladdin/',
    youtubeUrl: 'https://www.youtube.com/watch?v=6_7_8_9_0',
    reviewSummary: "Petit parcours à pied très mignon, fait en 5 minutes. Les scènes miniatures sont jolies mais ce n'est pas incontournable."
  },
  
  // --- FANTASYLAND ---
  { 
    id: 'dlp_castle', 
    name: 'La Tanière du Dragon', 
    park: Park.DISNEYLAND, 
    land: Land.FANTASYLAND, 
    avgWait: 0, 
    duration: 10, 
    x: 50, 
    y: 55,
    description: "Osez vous aventurer sous le Château pour réveiller un immense dragon audio-animatronic assoupi.",
    imageUrl: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&w=800&q=80', // Dragon / Sombre
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/la-taniere-du-dragon/',
    youtubeUrl: 'https://www.youtube.com/watch?v=8_9_0_1_2',
    reviewSummary: "Impressionnant de réalisme ! Il fait sombre et le dragon peut effrayer les tout-petits, mais c'est une pépite cachée."
  },
  { 
    id: 'dlp_6', 
    name: 'Peter Pan\'s Flight', 
    park: Park.DISNEYLAND, 
    land: Land.FANTASYLAND, 
    avgWait: 50, 
    duration: 3, 
    x: 40, 
    y: 35,
    description: "Envolez-vous au-dessus des toits de Londres à bord d'un galion pirate magique direction le Pays Imaginaire.",
    imageUrl: 'https://images.unsplash.com/photo-1534231157833-b477d74828c0?auto=format&fit=crop&w=800&q=80', // Nuit / Magie
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/peter-pans-flight/',
    youtubeUrl: 'https://www.youtube.com/watch?v=0_1_2_3_4',
    reviewSummary: "Absolument magique, la sensation de vol est unique. Dommage que ce soit si court pour autant d'attente."
  },
  { 
    id: 'dlp_7', 
    name: 'It\'s a small world', 
    park: Park.DISNEYLAND, 
    land: Land.FANTASYLAND, 
    avgWait: 20, 
    duration: 10, 
    x: 65, 
    y: 25,
    description: "La croisière la plus joyeuse du monde ! Un voyage musical autour du globe avec des poupées chantantes.",
    imageUrl: 'https://images.unsplash.com/photo-1626277603441-83a913247248?auto=format&fit=crop&w=800&q=80', // Coloré / Poupées
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/its-a-small-world/',
    youtubeUrl: 'https://www.youtube.com/watch?v=2_3_4_5_6',
    reviewSummary: "La musique reste dans la tête toute la journée ! C'est coloré, joyeux et assez long, parfait pour les enfants."
  },
  { 
    id: 'dlp_8', 
    name: 'Dumbo the Flying Elephant', 
    park: Park.DISNEYLAND, 
    land: Land.FANTASYLAND, 
    avgWait: 30, 
    duration: 2, 
    x: 55, 
    y: 30,
    description: "Prenez de la hauteur à dos d'éléphant dans ce manège aérien classique qui ravira petits et grands.",
    imageUrl: 'https://images.unsplash.com/photo-1604238610126-746f0215815c?auto=format&fit=crop&w=800&q=80', // Elephant
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/dumbo-the-flying-elephant/',
    youtubeUrl: 'https://www.youtube.com/watch?v=4_5_6_7_8',
    reviewSummary: "Un grand classique qui offre une jolie vue sur Fantasyland. L'attente est souvent longue pour la durée du tour."
  },
  { 
    id: 'dlp_fan_4', 
    name: 'Blanche-Neige et les Sept Nains', 
    park: Park.DISNEYLAND, 
    land: Land.FANTASYLAND, 
    avgWait: 25, 
    duration: 3, 
    x: 38, 
    y: 42,
    description: "Revivez l'histoire de Blanche-Neige dans un parcours scénique, mais attention à la méchante sorcière !",
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80', // Chalet
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/blanche-neige-et-les-sept-nains/',
    youtubeUrl: 'https://www.youtube.com/watch?v=6_7_8_9_0',
    reviewSummary: "Un peu effrayant pour les très jeunes enfants à cause de la sorcière, mais très fidèle au dessin animé."
  },
  { 
    id: 'dlp_fan_5', 
    name: 'Les Voyages de Pinocchio', 
    park: Park.DISNEYLAND, 
    land: Land.FANTASYLAND, 
    avgWait: 20, 
    duration: 3, 
    x: 42, 
    y: 42,
    description: "Accompagnez Pinocchio dans ses aventures mouvementées, de Stromboli à l'île aux plaisirs.",
    imageUrl: 'https://images.unsplash.com/photo-1535581652167-4d66e2b613eb?auto=format&fit=crop&w=800&q=80', // Village
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/les-voyages-de-pinocchio/',
    youtubeUrl: 'https://www.youtube.com/watch?v=8_9_0_1_2',
    reviewSummary: "Similaire à Blanche-Neige, c'est un parcours rapide. Les décors sont jolis et l'histoire bien racontée."
  },
  { 
    id: 'dlp_fan_6', 
    name: 'Le Carrousel de Lancelot', 
    park: Park.DISNEYLAND, 
    land: Land.FANTASYLAND, 
    avgWait: 15, 
    duration: 3, 
    x: 48, 
    y: 40,
    description: "Montez sur un magnifique cheval de bois dans ce carrousel royal classique au cœur de Fantasyland.",
    imageUrl: 'https://images.unsplash.com/photo-1551699720-4805907a971d?auto=format&fit=crop&w=800&q=80', // Carrousel
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/le-carrousel-de-lancelot/',
    youtubeUrl: 'https://www.youtube.com/watch?v=0_1_2_3_4',
    reviewSummary: "Magnifique surtout de nuit quand il est illuminé. Un moment de nostalgie pure pour petits et grands."
  },
  { 
    id: 'dlp_fan_7', 
    name: 'Mad Hatter\'s Tea Cups', 
    park: Park.DISNEYLAND, 
    land: Land.FANTASYLAND, 
    avgWait: 20, 
    duration: 2, 
    x: 60, 
    y: 40,
    description: "Tournoyez à toute vitesse dans des tasses de thé géantes lors de la fête de non-anniversaire du Chapelier Fou.",
    imageUrl: 'https://images.unsplash.com/photo-1550950502-b015e50d6485?auto=format&fit=crop&w=800&q=80', // Tasses
    intensity: 'Modéré',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/mad-hatters-tea-cups/',
    youtubeUrl: 'https://www.youtube.com/watch?v=2_3_4_5_6',
    reviewSummary: "Ça tourne très vite si on le veut ! Très drôle à faire en groupe pour voir qui résiste le mieux au tournis."
  },
  { 
    id: 'dlp_fan_8', 
    name: 'Alice\'s Curious Labyrinth', 
    park: Park.DISNEYLAND, 
    land: Land.FANTASYLAND, 
    avgWait: 10, 
    duration: 15, 
    x: 62, 
    y: 35,
    description: "Perdez-vous dans le labyrinthe de la Reine de Cœur et profitez d'une vue imprenable depuis son château.",
    imageUrl: 'https://images.unsplash.com/photo-1612441557370-c46a899400d2?auto=format&fit=crop&w=800&q=80', // Labyrinthe
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/alices-curious-labyrinth/',
    youtubeUrl: 'https://www.youtube.com/watch?v=4_5_6_7_8',
    reviewSummary: "Super pour laisser courir les enfants. La vue depuis le château de la Reine de Cœur vaut le détour."
  },
  { 
    id: 'dlp_fan_9', 
    name: 'Casey Jr. - le Petit Train du Cirque', 
    park: Park.DISNEYLAND, 
    land: Land.FANTASYLAND, 
    avgWait: 25, 
    duration: 3, 
    x: 65, 
    y: 30,
    description: "Un petit train rapide qui parcourt le Pays des Contes de Fées. Idéal pour les plus petits.",
    imageUrl: 'https://images.unsplash.com/photo-1596825310836-65823145824a?auto=format&fit=crop&w=800&q=80', // Train
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/casey-jr-le-petit-train-du-cirque/',
    youtubeUrl: 'https://www.youtube.com/watch?v=6_7_8_9_0',
    reviewSummary: "Plus rapide qu'il n'en a l'air ! La musique est entraînante et le tour est sympa, même pour les adultes."
  },
  { 
    id: 'dlp_fan_10', 
    name: 'Le Pays des Contes de Fées', 
    park: Park.DISNEYLAND, 
    land: Land.FANTASYLAND, 
    avgWait: 20, 
    duration: 10, 
    x: 68, 
    y: 32,
    description: "Une promenade en bateau paisible à travers des villages miniatures tirés des classiques Disney.",
    imageUrl: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=800&q=80', // Paysage miniature
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/le-pays-des-contes-de-fees/',
    youtubeUrl: 'https://www.youtube.com/watch?v=8_9_0_1_2',
    reviewSummary: "Promenade en bateau très calme, parfaite pour se détendre. Les miniatures sont adorables et bien entretenues."
  },
  
  // --- DISCOVERYLAND ---
  { 
    id: 'dlp_9', 
    name: 'Star Wars™ Hyperspace Mountain', 
    park: Park.DISNEYLAND, 
    land: Land.DISCOVERYLAND, 
    avgWait: 40, 
    duration: 2, 
    x: 85, 
    y: 50,
    description: "Rejoignez l'Alliance Rebelle pour une bataille épique dans l'espace à vitesse lumière.",
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80', // Espace
    intensity: 'Sensations fortes',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/star-wars-hyperspace-mountain/',
    youtubeUrl: 'https://www.youtube.com/watch?v=0_1_2_3_4',
    reviewSummary: "Très intense et rapide ! La musique Star Wars dans les oreilles rend l'expérience vraiment épique."
  },
  { 
    id: 'dlp_10', 
    name: 'Star Tours: L\'Aventure Continue', 
    park: Park.DISNEYLAND, 
    land: Land.DISCOVERYLAND, 
    avgWait: 15, 
    duration: 5, 
    x: 90, 
    y: 60,
    description: "Un simulateur de vol 3D imprévisible à travers la galaxie Star Wars. Chaque voyage est unique !",
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', // Espace / Galaxie
    intensity: 'Modéré',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/star-tours-l-aventure-continue/',
    youtubeUrl: 'https://www.youtube.com/watch?v=2_3_4_5_6',
    reviewSummary: "Génial car l'histoire change à chaque fois. On ne s'ennuie jamais, et C-3PO est hilarant."
  },
  { 
    id: 'dlp_11', 
    name: 'Buzz Lightyear Laser Blast', 
    park: Park.DISNEYLAND, 
    land: Land.DISCOVERYLAND, 
    avgWait: 35, 
    duration: 5, 
    x: 75, 
    y: 60,
    description: "Aidez Buzz l'Éclair à vaincre Zurg dans ce stand de tir laser interactif où vous marquez des points.",
    imageUrl: 'https://images.unsplash.com/photo-1626298825274-313448855532?auto=format&fit=crop&w=800&q=80', // Laser / Néon
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/buzz-lightyear-laser-blast/',
    youtubeUrl: 'https://www.youtube.com/watch?v=4_5_6_7_8',
    reviewSummary: "Super fun pour défier ses amis et sa famille. Le système de points rend l'attraction très addictive !"
  },
  { 
    id: 'dlp_disc_4', 
    name: 'Autopia', 
    park: Park.DISNEYLAND, 
    land: Land.DISCOVERYLAND, 
    avgWait: 25, 
    duration: 5, 
    x: 80, 
    y: 40,
    description: "Prenez le volant de votre propre voiture futuriste pour une balade sur une autoroute sinueuse.",
    imageUrl: 'https://images.unsplash.com/photo-1597762308859-c449375dbdc9?auto=format&fit=crop&w=800&q=80', // Voiture
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/autopia/',
    youtubeUrl: 'https://www.youtube.com/watch?v=6_7_8_9_0',
    reviewSummary: "Les enfants adorent conduire eux-mêmes. Le volant est un peu dur et ça sent l'essence, mais c'est un classique."
  },
  { 
    id: 'dlp_disc_5', 
    name: 'Orbitron', 
    park: Park.DISNEYLAND, 
    land: Land.DISCOVERYLAND, 
    avgWait: 25, 
    duration: 2, 
    x: 75, 
    y: 50,
    description: "Pilotez votre propre vaisseau spatial rétro-futuriste et contrôlez votre altitude au milieu des planètes.",
    imageUrl: 'https://images.unsplash.com/photo-1454789548728-85d2696cfbaf?auto=format&fit=crop&w=800&q=80', // Espace / Fusée
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/orbitron/',
    youtubeUrl: 'https://www.youtube.com/watch?v=8_9_0_1_2',
    reviewSummary: "Ça donne un peu le vertige ! La vue sur Discoveryland est top, surtout de nuit avec les néons."
  },
  { 
    id: 'dlp_disc_6', 
    name: 'Mickey et son Orchestre PhilharMagique', 
    park: Park.DISNEYLAND, 
    land: Land.DISCOVERYLAND, 
    avgWait: 15, 
    duration: 12, 
    x: 68, 
    y: 48,
    description: "Une expérience cinéma 4D où Donald Duck vous plonge dans les plus grandes chansons Disney.",
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80', // Musique / Concert
    intensity: 'Calme',
    officialUrl: 'https://www.disneylandparis.com/fr-fr/attractions/parc-disneyland/mickeys-philharmagic/',
    youtubeUrl: 'https://www.youtube.com/watch?v=0_1_2_3_4',
    reviewSummary: "Un film 4D très bien fait, on sent vraiment les odeurs et l'eau. Une excellente surprise souvent méconnue."
  },
];