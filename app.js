// ==========================================================================
// 3D NEWS GLOBE TRACKER CORE APPLICATION LOGIC
// ==========================================================================

// Global Application State
const state = {
    events: [],
    filteredEvents: [],
    selectedEventId: null,
    searchQuery: '',
    selectedCategory: 'all',
    isSimulating: false,
    audioEnabled: true,
    isRotating: true,
    globeStyle: 'night',
    simulationIntervalId: null,
    newsSource: 'local', // 'local' or 'gnews'
    gnewsApiKey: ''
};

// Initial Rich Curated News Database
const initialNewsDatabase = [
    {
        id: "evt-1",
        title: "Tohoku Coast Shaken by Magnitude 6.7 Undersea Earthquake",
        summary: "A powerful magnitude 6.7 earthquake struck off the eastern coast of Honshu, Japan. The epicenter was located at a depth of 32 kilometers. Strong tremors were felt across Sendai and Tokyo. Seismic centers confirm there is no immediate tsunami hazard, though local high-speed rail lines were temporarily halted for inspection.",
        category: "disaster",
        location: "Tohoku Region, Japan",
        lat: 38.297,
        lng: 142.373,
        time: "1 hour ago",
        timestamp: Date.now() - 3600000,
        sources: [
            { name: "Global Seismology Institute", link: "https://example.com/seismo-tahoku", reliability: "Verified", highReliability: true },
            { name: "Tokyo Broadcasting Syndicate", link: "https://example.com/tbs-news-earthquake", reliability: "Official Source", highReliability: true }
        ],
        sourceLink: "https://example.com/earthquake-japan-coverage"
    },
    {
        id: "evt-2",
        title: "Emergency Cybersecurity Summit Convened in Geneva",
        summary: "Diplomats and leading tech security chiefs have gathered in Geneva for an unscheduled bilateral security summit following a series of coordinated attacks on municipal infrastructure across Western Europe. Key objectives include establishing international frameworks for defensive cyber-warfare operations.",
        category: "conflict",
        location: "Geneva, Switzerland",
        lat: 46.204,
        lng: 6.143,
        time: "3 hours ago",
        timestamp: Date.now() - 10800000,
        sources: [
            { name: "Reuters Intel", link: "https://example.com/reuters-geneva", reliability: "High", highReliability: true },
            { name: "Swiss Federal Security Bureau", link: "https://example.com/sfsb-report", reliability: "Official Press Release", highReliability: true }
        ],
        sourceLink: "https://example.com/geneva-cyber-summit"
    },
    {
        id: "evt-3",
        title: "Silicon Valley Lab Reveals 120-Qubit Fault-Tolerant Quantum Chip",
        summary: "In a groundbreaking breakthrough for physical computing, researchers in Palo Alto have unveiled a semiconductor chip running 120 logical qubits with a 99.9% gate fidelity rate. This milestone significantly narrows the timeframe required to achieve practical quantum supremacy for industrial cryptography and molecular simulation.",
        category: "tech",
        location: "Palo Alto, California",
        lat: 37.4419,
        lng: -122.1430,
        time: "5 hours ago",
        timestamp: Date.now() - 18000000,
        sources: [
            { name: "Advanced Nature Physics Journal", link: "https://example.com/nature-quantum", reliability: "Peer Reviewed", highReliability: true },
            { name: "TechCrunch Science", link: "https://example.com/tc-quantum-chip", reliability: "Media Report", highReliability: false }
        ],
        sourceLink: "https://example.com/quantum-palo-alto"
    },
    {
        id: "evt-4",
        title: "Category 4 Cyclone 'Eldred' Rapidly Approaches Queensland Coast",
        summary: "Meteorological stations have upgraded Storm Eldred to a Category 4 Tropical Cyclone as it gains thermodynamic momentum over the warm waters of the Coral Sea. Coastal communities from Townsville to Cairns have been placed under high-level emergency preparation orders. Flooding and storm surges are expected.",
        category: "disaster",
        location: "Queensland, Australia",
        lat: -19.259,
        lng: 146.817,
        time: "8 hours ago",
        timestamp: Date.now() - 28800000,
        sources: [
            { name: "Bureau of Meteorology (BOM)", link: "https://example.com/bom-cyclone", reliability: "Government Authority", highReliability: true },
            { name: "Sky News Australia Weather", link: "https://example.com/sky-weather-qld", reliability: "Media Broadcast", highReliability: false }
        ],
        sourceLink: "https://example.com/cyclone-eldred-australia"
    },
    {
        id: "evt-5",
        title: "Next-Gen Artemis Orbital Launcher Erected at Cape Canaveral",
        summary: "NASA and commercial aerospace integrators have successfully completed the rollout of the heavy-lift orbital rocket to Launch Complex 39B in Cape Canaveral. The rocket is scheduled for an uncrewed trajectory simulation around the Moon, carrying experimental sensor payloads to study cosmic radiation impacts.",
        category: "tech",
        location: "Cape Canaveral, Florida",
        lat: 28.392,
        lng: -80.608,
        time: "12 hours ago",
        timestamp: Date.now() - 43200000,
        sources: [
            { name: "NASA Spaceflight Operations", link: "https://example.com/nasa-sls-artemis", reliability: "Official Agency", highReliability: true },
            { name: "Spaceflight Now Feed", link: "https://example.com/sfn-rollout", reliability: "Niche Journalism", highReliability: true }
        ],
        sourceLink: "https://example.com/artemis-rollout-canaveral"
    },
    {
        id: "evt-6",
        title: "East Africa Drought Initiative Launches Emergency Supply Nodes",
        summary: "The United Nations and regional coalitions have activated five major logistical supply nodes in Nairobi to combat severe arid conditions affecting agricultural zones. Over 400 metric tons of emergency water supplies and fortified cereal grains are scheduled for immediate regional deployment.",
        category: "politics",
        location: "Nairobi, Kenya",
        lat: -1.292,
        lng: 36.821,
        time: "18 hours ago",
        timestamp: Date.now() - 64800000,
        sources: [
            { name: "World Food Programme Bulletin", link: "https://example.com/wfp-kenya", reliability: "Verified Org", highReliability: true },
            { name: "Nairobi Tribune", link: "https://example.com/nairobi-tribune-aid", reliability: "Local Press", highReliability: false }
        ],
        sourceLink: "https://example.com/drought-initiative-kenya"
    },
    {
        id: "evt-7",
        title: "Hamburg Activates Germany's Largest Marine Thermal Energy Grid",
        summary: "In a step forward for municipal decarbonization, city engineers in Hamburg have powered on a utility-scale marine heat pump grid. Operating from the Elbe River, the system will capture geothermal and water-based thermal gradients to generate clean central heating for over 22,000 residential apartments.",
        category: "politics",
        location: "Hamburg, Germany",
        lat: 53.551,
        lng: 9.993,
        time: "1 day ago",
        timestamp: Date.now() - 86400000,
        sources: [
            { name: "Federal Ministry for Climate Action", link: "https://example.com/bmwk-germany", reliability: "Official Ministry", highReliability: true },
            { name: "DW Green Tech", link: "https://example.com/dw-hamburg-thermal", reliability: "Public Broadcast", highReliability: true }
        ],
        sourceLink: "https://example.com/hamburg-thermal-energy"
    },
    {
        id: "evt-8",
        title: "Undersea Data Cable Rupture Causes Major Southeast Asia Internet Slowdown",
        summary: "A subsea fiber-optic telecommunications cable connecting Singapore to Hong Kong has suffered a deep-water shear, forcing data traffic to reroute via slower terrestrial systems. Repairs are estimated to take 8 to 14 days depending on deep-sea currents, affecting data speeds for corporate hubs across the region.",
        category: "breaking",
        location: "Singapore Strait",
        lat: 1.352,
        lng: 103.820,
        time: "1 day ago",
        timestamp: Date.now() - 95000000,
        sources: [
            { name: "Submarine Cable Networks Portal", link: "https://example.com/subsea-cable-shear", reliability: "Industry Tracker", highReliability: true },
            { name: "Singapore Telecomm Authority", link: "https://example.com/ida-singapore-statement", reliability: "Official Bureau", highReliability: true }
        ],
        sourceLink: "https://example.com/singapore-subsea-outage"
    }
];

// Structured International Flights Database
const flightsDatabase = [
    {
        id: "flt-1",
        flightNumber: "AI-101",
        airline: "Air India",
        aircraft: "Boeing 777-300ER",
        origin: "New Delhi (DEL)",
        originCity: "New Delhi",
        startLat: 28.6139,
        startLng: 77.2090,
        destination: "London Heathrow (LHR)",
        destinationCity: "London",
        endLat: 51.5074,
        endLng: -0.1278,
        category: "flights",
        status: "En Route",
        speed: "895 km/h",
        altitudeFt: "34,000 ft",
        distance: "6,710 km",
        progress: 0.45,
        time: "Active flight",
        timestamp: Date.now(),
        sources: [{ name: "Live FlightRadar Grid", link: "#", reliability: "Satellite Tracked", highReliability: true }],
        sourceLink: "#",
        summary: "Flight AI-101 is currently cruising over Eastern Europe on its way from New Delhi to London. Telemetry reports stable airspeed, normal altitude controls, and on-time ETA."
    },
    {
        id: "flt-2",
        flightNumber: "JL-002",
        airline: "Japan Airlines",
        aircraft: "Boeing 787-9 Dreamliner",
        origin: "Tokyo Haneda (HND)",
        originCity: "Tokyo",
        startLat: 35.6762,
        startLng: 139.6503,
        destination: "Los Angeles (LAX)",
        destinationCity: "Los Angeles",
        endLat: 34.0522,
        endLng: -118.2437,
        category: "flights",
        status: "En Route",
        speed: "920 km/h",
        altitudeFt: "38,000 ft",
        distance: "8,815 km",
        progress: 0.60,
        time: "Active flight",
        timestamp: Date.now(),
        sources: [{ name: "JAL Ops Desk", link: "#", reliability: "Verified", highReliability: true }],
        sourceLink: "#",
        summary: "JAL transpacific flight JL-002 is heading east over the Pacific Ocean. Standard weather routing is active; no turbulence reported. Cruising at Mach 0.84."
    },
    {
        id: "flt-3",
        flightNumber: "BA-178",
        airline: "British Airways",
        aircraft: "Airbus A350-1000",
        origin: "London Heathrow (LHR)",
        originCity: "London",
        startLat: 51.5074,
        startLng: -0.1278,
        destination: "New York JFK",
        destinationCity: "New York",
        endLat: 40.7128,
        endLng: -74.0060,
        category: "flights",
        status: "En Route",
        speed: "870 km/h",
        altitudeFt: "36,000 ft",
        distance: "5,570 km",
        progress: 0.32,
        time: "Active flight",
        timestamp: Date.now(),
        sources: [{ name: "ATC Transponder Transmissions", link: "#", reliability: "Direct Telemetry", highReliability: true }],
        sourceLink: "#",
        summary: "Transatlantic passenger flight BA-178 is traversing the Shanwick Oceanic Control area. Cruising altitude set to FL360. Arrival in New York is estimated on schedule."
    },
    {
        id: "flt-4",
        flightNumber: "SQ-231",
        airline: "Singapore Airlines",
        aircraft: "Airbus A380-800",
        origin: "Singapore Changi (SIN)",
        originCity: "Singapore",
        startLat: 1.3521,
        startLng: 103.8198,
        destination: "Sydney Kingsford Smith (SYD)",
        destinationCity: "Sydney",
        endLat: -33.8688,
        endLng: 151.2093,
        category: "flights",
        status: "En Route",
        speed: "910 km/h",
        altitudeFt: "39,000 ft",
        distance: "6,300 km",
        progress: 0.72,
        time: "Active flight",
        timestamp: Date.now(),
        sources: [{ name: "Changi Flight Ops Network", link: "#", reliability: "Official Dispatch", highReliability: true }],
        sourceLink: "#",
        summary: "A380 Superjumbo operating flight SQ-231 is currently crossing the Australian Northern Territory coast. Cruising at 39,000 ft. Passenger services normal."
    },
    {
        id: "flt-5",
        flightNumber: "AF-508",
        airline: "Air France",
        aircraft: "Boeing 777-200ER",
        origin: "Paris Charles de Gaulle (CDG)",
        originCity: "Paris",
        startLat: 48.8566,
        startLng: 2.3522,
        destination: "Cairo International (CAI)",
        destinationCity: "Cairo",
        endLat: 30.0444,
        endLng: 31.2357,
        category: "flights",
        status: "En Route",
        speed: "880 km/h",
        altitudeFt: "35,000 ft",
        distance: "3,215 km",
        progress: 0.85,
        time: "Active flight",
        timestamp: Date.now(),
        sources: [{ name: "EuroControl Traffic Grid", link: "#", reliability: "Verified Radar", highReliability: true }],
        sourceLink: "#",
        summary: "Air France flight AF-508 is descending over the Mediterranean Sea, preparing for entry into Cairo terminal control area. Stable descent trajectory active."
    },
    {
        id: "flt-6",
        flightNumber: "SA-322",
        airline: "South African Airways",
        aircraft: "Airbus A330-300",
        origin: "Cape Town (CPT)",
        originCity: "Cape Town",
        startLat: -33.9249,
        startLng: 18.4241,
        destination: "Nairobi Jomo Kenyatta (NBO)",
        destinationCity: "Nairobi",
        endLat: -1.2921,
        endLng: 36.8219,
        category: "flights",
        status: "En Route",
        speed: "860 km/h",
        altitudeFt: "37,000 ft",
        distance: "4,100 km",
        progress: 0.15,
        time: "Active flight",
        timestamp: Date.now(),
        sources: [{ name: "Nairobi Control Tower Feed", link: "#", reliability: "Secondary Radar Data", highReliability: false }],
        sourceLink: "#",
        summary: "Flight SA-322 is climbing to its initial cruise altitude of 37,000 ft, heading north-northeast over southern Africa. Estimated flight duration remains 5h 15m."
    }
];

// Structured Orbiting Satellites Database
const satellitesDatabase = [
    {
        id: "sat-iss",
        name: "ISS (Space Station)",
        category: "satellites",
        inclination: 51.64,
        inclinationRad: 51.64 * Math.PI / 180,
        altitude: 0.35,
        speed: "27,560 km/h",
        orbitalPeriod: "92.9 min",
        launchYear: "1998",
        crewSize: 7,
        status: "Fully Operational",
        progress: 0.1,
        speedFactor: 0.007,
        summary: "The International Space Station (ISS) is a modular space station in low Earth orbit. It is a collaborative project between NASA, Roscosmos, JAXA, ESA, and CSA. It serves as a microgravity and space environment research laboratory.",
        sources: [{ name: "NASA Space Operations Control", link: "#", reliability: "Official Telemetry", highReliability: true }],
        sourceLink: "#"
    },
    {
        id: "sat-hubble",
        name: "Hubble Space Telescope",
        category: "satellites",
        inclination: 28.47,
        inclinationRad: 28.47 * Math.PI / 180,
        altitude: 0.45,
        speed: "27,300 km/h",
        orbitalPeriod: "95.4 min",
        launchYear: "1990",
        crewSize: 0,
        status: "Active (Operational)",
        progress: 1.2,
        speedFactor: 0.0055,
        summary: "The Hubble Space Telescope (HST) is a space telescope that was launched into low Earth orbit in 1990 and remains in operation. Hubble's orbit is slightly lower inclination than the ISS, and it serves as one of the most vital scientific instruments in astronomical history.",
        sources: [{ name: "Space Telescope Science Institute", link: "#", reliability: "Official Telemetry", highReliability: true }],
        sourceLink: "#"
    },
    {
        id: "sat-starlink",
        name: "Starlink-3024 (SpaceX)",
        category: "satellites",
        inclination: 53.05,
        inclinationRad: 53.05 * Math.PI / 180,
        altitude: 0.28,
        speed: "27,600 km/h",
        orbitalPeriod: "91.2 min",
        launchYear: "2024",
        crewSize: 0,
        status: "Operational",
        progress: 3.4,
        speedFactor: 0.009,
        summary: "Starlink is a satellite internet constellation operated by SpaceX, providing satellite Internet access coverage to over 75 countries. This unit (Starlink-3024) is operating in the shell orbiting at 53 degrees inclination.",
        sources: [{ name: "SpaceX Starlink Operations", link: "#", reliability: "Telemetry Feed", highReliability: true }],
        sourceLink: "#"
    },
    {
        id: "sat-gps",
        name: "GPS Block IIIA (Navstar)",
        category: "satellites",
        inclination: 55.0,
        inclinationRad: 55.0 * Math.PI / 180,
        altitude: 0.65,
        speed: "14,000 km/h",
        orbitalPeriod: "718 min (12 hours)",
        launchYear: "2018",
        crewSize: 0,
        status: "Operational (High Power)",
        progress: 4.8,
        speedFactor: 0.0025,
        summary: "Navstar GPS is a satellite-based radionavigation system owned by the United States government and operated by the United States Space Force. This GPS Block IIIA satellite orbits in medium Earth orbit (MEO) to provide global positioning services.",
        sources: [{ name: "US Space Force Space Delta 8", link: "#", reliability: "Military Telemetry", highReliability: true }],
        sourceLink: "#"
    }
];

let pregeneratedSatelliteOrbits = [];

function pregenerateOrbits() {
    pregeneratedSatelliteOrbits = satellitesDatabase.map(sat => {
        const points = [];
        for (let i = 0; i <= 100; i++) {
            const theta = (i / 100) * 2 * Math.PI;
            const x = Math.cos(theta);
            const y = Math.sin(theta) * Math.cos(sat.inclinationRad);
            const z = Math.sin(theta) * Math.sin(sat.inclinationRad);
            const lat = Math.asin(z) * 180 / Math.PI;
            const lng = Math.atan2(y, x) * 180 / Math.PI;
            points.push([lat, lng, sat.altitude]);
        }
        return {
            id: sat.id,
            name: sat.name,
            inclination: sat.inclination,
            altitudeFt: `${Math.round(sat.altitude * 6371)} km`,
            points: points
        };
    });
}

// Generate orbits list on boot
pregenerateOrbits();

// Simulated Event Pools for the Live Simulator
const simulationPool = [
    {
        title: "Severe Typhoon Henderson Hits Northern Taiwan Coast",
        summary: "Typhoon Henderson has made landfall on Taiwan's northern shore. Extremely intense winds of 170 km/h and massive rainfall have closed major highways. Landslide alerts are active in mountainous districts, and emergency response crews are operating critical shelters.",
        category: "disaster",
        location: "Keelung, Taiwan",
        lat: 25.128,
        lng: 121.739,
        sources: [
            { name: "Central Weather Bureau Taiwan", link: "https://example.com/cwb-taiwan", reliability: "National Office", highReliability: true },
            { name: "Asia Disaster Response Network", link: "https://example.com/adrn-typhoon", reliability: "NGO Coalition", highReliability: true }
        ],
        sourceLink: "https://example.com/typhoon-taiwan"
    },
    {
        title: "Maritime Security Patrol Stand-off Reported in South China Sea",
        summary: "Friction escalated in disputed waters after coast guard ships from neighboring countries performed close maneuvers near active oil exploration vessels. Diplomatic channels are meeting to de-escalate tensions. Analysts describe the encounter as the highest tension incident in the region this quarter.",
        category: "conflict",
        location: "Spratly Islands",
        lat: 9.875,
        lng: 114.281,
        sources: [
            { name: "Maritime Security Intelligence", link: "https://example.com/msi-south-china", reliability: "Defense Monitor", highReliability: true }
        ],
        sourceLink: "https://example.com/scs-border-incident"
    },
    {
        title: "Munich Research Facility Achieves Critical Quantum Computing Coherence",
        summary: "Physicists at the Munich Center for Quantum Science have maintained qubit coherence for a record-breaking 300 seconds using supercooled vacuum traps. This breakthrough dramatically outperforms current industry benchmarks and moves quantum memory nodes from theory to structural reality.",
        category: "tech",
        location: "Munich, Germany",
        lat: 48.135,
        lng: 11.582,
        sources: [
            { name: "European Physical Society", link: "https://example.com/eps-munich-quantum", reliability: "Scientific Society", highReliability: true }
        ],
        sourceLink: "https://example.com/munich-quantum-milestone"
    },
    {
        title: "Historic Bilateral Trade Accord Finalized in Brasilia Forum",
        summary: "Trade delegations from South American nations have ratified the Brasilia Accord, removing tariff barriers for electric vehicles and agricultural equipment. This treaty is projected to stimulate cross-border commerce by 24% over the next fiscal cycle and establish a green technology corridor.",
        category: "politics",
        location: "Brasilia, Brazil",
        lat: -15.794,
        lng: -47.882,
        sources: [
            { name: "Mercosur Trade Registry", link: "https://example.com/mercosur-trade", reliability: "Treaty Org", highReliability: true },
            { name: "O Globo Econômico", link: "https://example.com/globo-trade-brasilia", reliability: "Media Report", highReliability: false }
        ],
        sourceLink: "https://example.com/brasilia-trade-accord"
    },
    {
        title: "Surveillance Drone Intercepted Near Maritime Border in Alaska",
        summary: "Air Defense commands confirmed that interceptor aircraft successfully escorted an unidentified, high-altitude surveillance drone away from airspace near Alaska's maritime border. Defense spokespersons stated the drone was operating in international airspace but failed to respond to radio requests.",
        category: "breaking",
        location: "Anchorage Outer Sector, Alaska",
        lat: 61.218,
        lng: -149.900,
        sources: [
            { name: "NORAD Regional Command", link: "https://example.com/norad-alaska", reliability: "Military Bureau", highReliability: true },
            { name: "Defense News Wire", link: "https://example.com/dnw-drone-intercept", reliability: "Defense Press", highReliability: true }
        ],
        sourceLink: "https://example.com/alaska-drone-intercept"
    },
    {
        title: "Sudden High-Intensity Flash Flood Inundates Venice Canals",
        summary: "A combination of abnormal high tides ('Acqua Alta') and sudden storm rainfall has overwhelmed the Venice flood barriers. Over 70% of the historic city pedestrian zones are underwater. Flood sirens sounded in the early hours, and local authorities are distributing temporary pedestrian gangways.",
        category: "disaster",
        location: "Venice, Italy",
        lat: 45.434,
        lng: 12.338,
        sources: [
            { name: "Venice Municipal Council Flooding Bureau", link: "https://example.com/venice-flood-comune", reliability: "City Authority", highReliability: true },
            { name: "Corriere della Sera", link: "https://example.com/corriere-venezia-acqua-alta", reliability: "National Press", highReliability: true }
        ],
        sourceLink: "https://example.com/venice-flooding-news"
    },
    {
        title: "Coordinated Cyber Attack Hits Digital Municipal Grid in Tallinn",
        summary: "State data structures in Estonia experienced a highly sophisticated Distributed Denial of Service (DDoS) cyber attack. The intrusion temporarily disrupted digital identity portals and online banking services. Cyber defense units successfully isolated the attack vectors, minimizing data leaks.",
        category: "conflict",
        location: "Tallinn, Estonia",
        lat: 59.437,
        lng: 24.753,
        sources: [
            { name: "Estonian Information System Authority", link: "https://example.com/ria-ee", reliability: "Government Cybersecurity Agency", highReliability: true },
            { name: "NATO Cyber Defense Center", link: "https://example.com/ccdcoe-tallinn", reliability: "International Command", highReliability: true }
        ],
        sourceLink: "https://example.com/tallinn-cyber-attack"
    },
    {
        title: "Autonomous Medical Cargo Drone Network Activated in Kigali",
        summary: "Kigali has rolled out a fully autonomous cargo drone logistics fleet to deliver critical medications, blood bags, and child vaccines to rural hospitals. The electric drones navigate remote mountainous routes in under 20 minutes, which previously required up to 4 hours by road transport.",
        category: "tech",
        location: "Kigali, Rwanda",
        lat: -1.944,
        lng: 30.061,
        sources: [
            { name: "Rwanda Ministry of Health Press", link: "https://example.com/moh-rwanda-drones", reliability: "Official Ministry", highReliability: true }
        ],
        sourceLink: "https://example.com/kigali-medical-drones"
    }
];

// Earth Globe style assets (Map textures)
const globeStyleMaps = {
    night: {
        globeImageUrl: 'https://unpkg.com/three-globe/example/img/earth-night.jpg',
        bumpImageUrl: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
        backgroundColor: '#07080d'
    },
    day: {
        globeImageUrl: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
        bumpImageUrl: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
        backgroundColor: '#05070a'
    },
    dark: {
        globeImageUrl: 'https://unpkg.com/three-globe/example/img/earth-dark.jpg',
        bumpImageUrl: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
        backgroundColor: '#030406'
    }
};

// Geolocation coordinate database for GNews API country codes
const countryGeoCoordinates = {
    'in': { name: "India", lat: 20.5937, lng: 78.9629 },
    'us': { name: "United States", lat: 37.0902, lng: -95.7129 },
    'gb': { name: "United Kingdom", lat: 55.3781, lng: -3.4360 },
    'ca': { name: "Canada", lat: 56.1304, lng: -106.3468 },
    'au': { name: "Australia", lat: -25.2744, lng: 133.7751 },
    'jp': { name: "Japan", lat: 36.2048, lng: 138.2529 },
    'de': { name: "Germany", lat: 51.1657, lng: 10.4515 },
    'fr': { name: "France", lat: 46.2276, lng: 2.2137 },
    'cn': { name: "China", lat: 35.8617, lng: 104.1954 },
    'ru': { name: "Russia", lat: 61.5240, lng: 105.3188 },
    'br': { name: "Brazil", lat: -14.2350, lng: -51.9253 },
    'za': { name: "South Africa", lat: -30.5595, lng: 22.9375 },
    'eg': { name: "Egypt", lat: 26.8206, lng: 30.8025 },
    'it': { name: "Italy", lat: 41.8719, lng: 12.5674 },
    'sg': { name: "Singapore", lat: 1.3521, lng: 103.8198 },
    'ch': { name: "Switzerland", lat: 46.8182, lng: 8.2275 },
    'es': { name: "Spain", lat: 40.4637, lng: -3.7492 },
    'mx': { name: "Mexico", lat: 23.6345, lng: -102.5528 },
    'il': { name: "Israel", lat: 31.0461, lng: 34.8516 },
    'lb': { name: "Lebanon", lat: 33.8547, lng: 35.8623 },
    'ir': { name: "Iran", lat: 32.4279, lng: 53.6880 }
};

// City Geolocation Lookup dictionary for GNews text matching
const cityGeoCoordinates = [
    { name: "Tokyo", lat: 35.6762, lng: 139.6503, country: "Japan" },
    { name: "New York", lat: 40.7128, lng: -74.0060, country: "United States" },
    { name: "London", lat: 51.5074, lng: -0.1278, country: "United Kingdom" },
    { name: "Paris", lat: 48.8566, lng: 2.3522, country: "France" },
    { name: "Berlin", lat: 52.5200, lng: 13.4050, country: "Germany" },
    { name: "Sydney", lat: -33.8688, lng: 151.2093, country: "Australia" },
    { name: "Mumbai", lat: 19.0760, lng: 72.8777, country: "India" },
    { name: "New Delhi", lat: 28.6139, lng: 77.2090, country: "India" },
    { name: "Beijing", lat: 39.9042, lng: 116.4074, country: "China" },
    { name: "Moscow", lat: 55.7558, lng: 37.6173, country: "Russia" },
    { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729, country: "Brazil" },
    { name: "Cape Town", lat: -33.9249, lng: 18.4241, country: "South Africa" },
    { name: "Cairo", lat: 30.0444, lng: 31.2357, country: "Egypt" },
    { name: "Rome", lat: 41.9028, lng: 12.4964, country: "Italy" },
    { name: "Singapore", lat: 1.3521, lng: 103.8198, country: "Singapore" },
    { name: "Geneva", lat: 46.2044, lng: 6.1432, country: "Switzerland" },
    { name: "Madrid", lat: 40.4168, lng: -3.7038, country: "Spain" },
    { name: "Mexico City", lat: 19.4326, lng: -99.1332, country: "Mexico" },
    { name: "Seoul", lat: 37.5665, lng: 126.9780, country: "South Korea" },
    { name: "Toronto", lat: 43.6532, lng: -79.3832, country: "Canada" },
    { name: "Los Angeles", lat: 34.0522, lng: -118.2437, country: "United States" },
    { name: "Washington", lat: 38.9072, lng: -77.0369, country: "United States" },
    { name: "Taipei", lat: 25.0330, lng: 121.5654, country: "Taiwan" }
];

// Global Globe variable
let globeInstance = null;
let flightProgressTimer = null;

// ==========================================================================
// WEB AUDIO SYNTHESIZER CONTROLLER (No external audio file dependencies!)
// ==========================================================================
const AudioController = {
    // Generate a sleek UI beep sound
    playBeep(frequency = 750, duration = 0.12, type = 'sine') {
        if (!state.audioEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, ctx.currentTime);
            
            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + duration);
        } catch (error) {
            console.warn("Audio Context playback blocked or unavailable.", error);
        }
    },

    // Play deep pulse warning sound (Simulated Live News alert)
    playSonarAlert() {
        if (!state.audioEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;
            
            // Primary Low Pulse
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(220, now);
            osc1.frequency.exponentialRampToValueAtTime(80, now + 0.8);
            gain1.gain.setValueAtTime(0.15, now);
            gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
            
            // High Ping Layer
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(980, now);
            gain2.gain.setValueAtTime(0.05, now);
            gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

            osc1.start(now);
            osc1.stop(now + 0.8);
            osc2.start(now);
            osc2.stop(now + 0.5);
        } catch (error) {
            console.warn("Audio Context playback failed.", error);
        }
    }
};

// Helper to get altitude based on responsive viewport width
function getResponsiveAltitude(defaultAlt = 2.4) {
    const isMobile = window.innerWidth <= 992;
    if (isMobile) {
        // Zoom out further on mobile screens to prevent vertical cropping
        if (defaultAlt === 1.4) return 2.1;
        if (defaultAlt === 2.4) return 3.0;
        if (defaultAlt === 2.5) return 3.2;
        return defaultAlt * 1.35;
    }
    return defaultAlt;
}

// Category Color mapping helper
function getCategoryColor(category) {
    switch (category) {
        case 'breaking': return '#ff3b30'; // red
        case 'disaster': return '#ffb300'; // amber
        case 'conflict': return '#0a84ff'; // blue
        case 'tech': return '#bf5af2';     // purple
        case 'politics': return '#34c759'; // green
        default: return '#00f0ff';         // cyber cyan
    }
}

// Format duration since event
function formatTimeElapsed(timestamp) {
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`;
}

// ==========================================================================
// RENDER & FILTER FUNCTIONS
// ==========================================================================

// Calculate stats dashboard totals
function updateHeaderStats() {
    const activeAlerts = state.events.length;
    const disastersCount = state.events.filter(e => e.category === 'disaster').length;
    const conflictsCount = state.events.filter(e => e.category === 'conflict').length;
    
    document.getElementById('stat-active-count').innerText = activeAlerts;
    document.getElementById('stat-disaster-count').innerText = disastersCount;
    document.getElementById('stat-conflict-count').innerText = conflictsCount;
}

// Filter the news list according to search term and category tabs
function filterNewsData() {
    if (state.selectedCategory === 'flights') {
        state.filteredEvents = flightsDatabase.filter(flt => {
            const searchLower = state.searchQuery.toLowerCase();
            return flt.flightNumber.toLowerCase().includes(searchLower) ||
                   flt.origin.toLowerCase().includes(searchLower) ||
                   flt.destination.toLowerCase().includes(searchLower) ||
                   flt.airline.toLowerCase().includes(searchLower);
        });
    } else if (state.selectedCategory === 'satellites') {
        state.filteredEvents = satellitesDatabase.filter(sat => {
            const searchLower = state.searchQuery.toLowerCase();
            return sat.name.toLowerCase().includes(searchLower) ||
                   sat.status.toLowerCase().includes(searchLower);
        });
    } else {
        state.filteredEvents = state.events.filter(evt => {
            const matchesCategory = state.selectedCategory === 'all' || evt.category === state.selectedCategory;
            const searchLower = state.searchQuery.toLowerCase();
            const matchesSearch = evt.title.toLowerCase().includes(searchLower) ||
                                  evt.summary.toLowerCase().includes(searchLower) ||
                                  evt.location.toLowerCase().includes(searchLower);
            return matchesCategory && matchesSearch;
        });
    }

    renderNewsList();
    updateGlobePoints();
}

// Render filtered news events to left panel
function renderNewsList() {
    const listContainer = document.getElementById('news-list');
    const emptyState = document.getElementById('empty-state');
    
    listContainer.innerHTML = '';
    
    if (state.filteredEvents.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');

    state.filteredEvents.forEach(evt => {
        const card = document.createElement('article');
        card.className = `news-card ${evt.id === state.selectedEventId ? 'active' : ''}`;
        card.setAttribute('data-id', evt.id);
        
        const elapsed = evt.category === 'flights' ? 'ACTIVE' : (evt.category === 'satellites' ? 'ORBITING' : formatTimeElapsed(evt.timestamp));
        const locationHTML = evt.category === 'flights' ? `<i data-lucide="plane"></i> ${evt.originCity} ➔ ${evt.destinationCity}` : (evt.category === 'satellites' ? `<i data-lucide="satellite"></i> Alt: ${Math.round(evt.altitude * 6371)} km` : `<i data-lucide="map-pin"></i> ${evt.location}`);
        const sourceHTML = evt.category === 'flights' ? `<i data-lucide="gauge"></i> Cruising at ${evt.altitudeFt}` : (evt.category === 'satellites' ? `<i data-lucide="gauge"></i> Speed: ${evt.speed}` : `<i data-lucide="shield-check"></i> ${evt.sources[0]?.name || 'Media Source'}`);
        const titleHTML = evt.category === 'flights' ? `${evt.airline} Flight ${evt.flightNumber}` : (evt.category === 'satellites' ? evt.name : evt.title);

        card.innerHTML = `
            <div class="card-header">
                <span class="badge badge-${evt.category}">${evt.category}</span>
                <div class="card-meta">
                    <span class="card-time">${elapsed}</span>
                </div>
            </div>
            <h3>${titleHTML}</h3>
            <div class="card-footer">
                <span class="card-location">
                    ${locationHTML}
                </span>
                <span class="card-source">
                    ${sourceHTML}
                </span>
            </div>
        `;
        
        // Setup card selection click handler
        card.addEventListener('click', () => {
            selectEvent(evt);
        });

        listContainer.appendChild(card);
    });

    // Reinitialize newly added SVG icons via Lucide
    lucide.createIcons();
}

// Update globe visualizations points and rings
function updateGlobePoints() {
    if (!globeInstance) return;

    const rings = [];

    if (state.selectedCategory === 'satellites') {
        // Clear surface news points & flight arcs in satellite radar mode
        globeInstance.pointsData([]);
        globeInstance.arcsData([]);
        globeInstance.ringsData([]);
    } else if (state.selectedCategory === 'flights') {
        // In flight radar mode, show airports (starts/ends) as points and flight arcs
        const airportPoints = [];
        flightsDatabase.forEach(flt => {
            const startPt = {
                id: `${flt.id}-start`,
                title: `Origin: ${flt.origin}`,
                location: flt.origin,
                category: 'flights',
                lat: flt.startLat,
                lng: flt.startLng
            };
            const endPt = {
                id: `${flt.id}-end`,
                title: `Destination: ${flt.destination}`,
                location: flt.destination,
                category: 'flights',
                lat: flt.endLat,
                lng: flt.endLng
            };
            airportPoints.push(startPt);
            airportPoints.push(endPt);
            
            // Add rings to all airport locations
            rings.push(startPt);
            rings.push(endPt);
        });
        globeInstance.pointsData(airportPoints);
        globeInstance.arcsData(state.filteredEvents);
    } else if (state.selectedCategory === 'all') {
        // In default 'all' mode, show both news points and flight arcs
        globeInstance.pointsData(state.filteredEvents);
        globeInstance.arcsData(flightsDatabase);
        
        // Add rings to all active news events
        state.filteredEvents.forEach(e => {
            rings.push(e);
        });
    } else {
        // Otherwise only show filtered news points and hide flight arcs
        globeInstance.pointsData(state.filteredEvents);
        globeInstance.arcsData([]);
        
        // Add rings to all filtered news events
        state.filteredEvents.forEach(e => {
            rings.push(e);
        });
    }
    
    // Add extra rings to selected flight points to make them stand out
    if (state.selectedEventId && state.selectedCategory === 'flights') {
        const selectedFlight = flightsDatabase.find(f => f.id === state.selectedEventId);
        if (selectedFlight) {
            rings.push({ lat: selectedFlight.startLat, lng: selectedFlight.startLng, category: 'flights' });
            rings.push({ lat: selectedFlight.endLat, lng: selectedFlight.endLng, category: 'flights' });
        }
    }

    // Toggle paths rendering based on satellite tracking mode
    globeInstance.pathsData(state.selectedCategory === 'satellites' ? pregeneratedSatelliteOrbits : []);
    
    globeInstance.ringsData(rings);
}

// Select a news event, focus camera, and slide details panel in
function selectEvent(event) {
    if (state.selectedEventId === event.id) {
        // Toggle zoom camera back to centered position if clicked again
        resetCameraView();
        return;
    }
    
    state.selectedEventId = event.id;
    
    // Play quick alert feedback sound
    AudioController.playBeep(700, 0.15);

    // Update active highlight classes on feed
    document.querySelectorAll('.news-card').forEach(card => {
        if (card.getAttribute('data-id') === event.id) {
            card.classList.add('active');
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            card.classList.remove('active');
        }
    });

        // Fly camera smoothly to coordinates on globe
        if (globeInstance) {
            let targetLat = event.lat;
            let targetLng = event.lng;
            let targetAlt = 1.4;
            
            // If it is a flight, focus on its midpoint
            if (event.category === 'flights') {
                targetLat = (event.startLat + event.endLat) / 2;
                let dLng = event.endLng - event.startLng;
                if (Math.abs(dLng) > 180) {
                    targetLng = (event.startLng + event.endLng + (dLng > 0 ? -360 : 360)) / 2;
                } else {
                    targetLng = (event.startLng + event.endLng) / 2;
                }
                targetAlt = 2.0;
            } else if (event.category === 'satellites') {
                // Focus on satellite current coords
                const liveSat = satellitesDatabase.find(s => s.id === event.id);
                if (liveSat) {
                    const theta = liveSat.progress;
                    const x = Math.cos(theta);
                    const y = Math.sin(theta) * Math.cos(liveSat.inclinationRad);
                    const z = Math.sin(theta) * Math.sin(liveSat.inclinationRad);
                    targetLat = Math.asin(z) * 180 / Math.PI;
                    targetLng = Math.atan2(y, x) * 180 / Math.PI;
                }
                targetAlt = 2.0;
            }
 
            globeInstance.pointOfView({
                lat: targetLat,
                lng: targetLng,
                altitude: getResponsiveAltitude(targetAlt)
            }, 1200);
        }
 
        // Populate and open details panel
        populateDetailsPanel(event);
        updateGlobePoints();
    }

// Fill details aside panel with event details data
function populateDetailsPanel(evt) {
    const panel = document.getElementById('detail-panel');
    const badge = document.getElementById('detail-badge');
    const banner = document.getElementById('detail-category-banner');
    const detailLat = document.getElementById('detail-lat');
    const detailLng = document.getElementById('detail-lng');
    const detailSummary = document.getElementById('detail-summary');
    const sourcesContainer = document.getElementById('detail-sources-list');
    const linkBtn = document.getElementById('detail-source-link');
    
    // Class overrides for banner gradient colors
    banner.className = `banner-gradient-${evt.category}`;
    
    // Details Fields
    badge.innerText = evt.category;
    badge.className = `badge badge-${evt.category}`;
    
    if (evt.category === 'flights') {
        document.getElementById('detail-location').innerText = `En Route (Cruising)`;
        document.getElementById('detail-time').innerText = "LIVE SIGNAL";
        document.getElementById('detail-title').innerText = `${evt.airline} Flight ${evt.flightNumber}`;
        detailLat.innerText = `${evt.originCity}`;
        detailLng.innerText = `${evt.destinationCity}`;
        
        detailSummary.innerHTML = `
            <p>${evt.summary}</p>
            <div class="geotag-box" style="margin-top:14px; background: rgba(0, 240, 255, 0.05); border-color: rgba(0, 240, 255, 0.15);">
                <div class="geo-label">FLIGHT TELEMETRY DATA</div>
                <div class="geo-values" style="display:flex; flex-direction:column; gap:5px; font-family:monospace; font-size:11px; margin-top:6px; user-select:text;">
                    <div>AIRCRAFT: <span class="text-accent">${evt.aircraft}</span></div>
                    <div>AIRSPEED: <span class="text-accent">${evt.speed}</span></div>
                    <div>CRUISE ALT: <span class="text-accent">${evt.altitudeFt}</span></div>
                    <div>TOTAL ROUTE: <span class="text-accent">${evt.distance}</span></div>
                    <div>STATUS: <span class="text-accent" style="color:var(--success); font-weight:bold;">${evt.status}</span></div>
                </div>
            </div>
        `;
        
        sourcesContainer.innerHTML = `
            <div class="source-item">
                <div class="source-info">
                    <span class="source-dot"></span>
                    <span>Transponder Telemetry GPS</span>
                </div>
                <span class="source-reliability">ACTIVE FEED</span>
            </div>
        `;
        
        linkBtn.href = "#";
        linkBtn.querySelector('span').innerText = "Open Route Map (Mock)";
    } else if (evt.category === 'satellites') {
        document.getElementById('detail-location').innerText = `Orbiting Outer Space`;
        document.getElementById('detail-time').innerText = "LIVE SPACE TELEMETRY";
        document.getElementById('detail-title').innerText = evt.name;
        detailLat.innerText = `${Math.abs(evt.lat || 0).toFixed(4)}° ${(evt.lat || 0) >= 0 ? 'N' : 'S'}`;
        detailLng.innerText = `${Math.abs(evt.lng || 0).toFixed(4)}° ${(evt.lng || 0) >= 0 ? 'E' : 'W'}`;
        
        detailSummary.innerHTML = `
            <p>${evt.summary}</p>
            <div class="geotag-box" style="margin-top:14px; background: rgba(191, 90, 242, 0.05); border-color: rgba(191, 90, 242, 0.15);">
                <div class="geo-label">SPACE TELEMETRY DATA</div>
                <div class="geo-values" style="display:flex; flex-direction:column; gap:5px; font-family:monospace; font-size:11px; margin-top:6px; user-select:text;">
                    <div>LAUNCH YEAR: <span style="color:#bf5af2;">${evt.launchYear}</span></div>
                    <div>ORBIT SPEED: <span style="color:#bf5af2;">${evt.speed}</span></div>
                    <div>ORBIT PERIOD: <span style="color:#bf5af2;">${evt.orbitalPeriod}</span></div>
                    <div>CREW SIZE: <span style="color:#bf5af2;">${evt.crewSize} astronauts</span></div>
                    <div>INCLINATION: <span style="color:#bf5af2;">${evt.inclination}°</span></div>
                    <div>STATUS: <span style="color:var(--success); font-weight:bold;">${evt.status}</span></div>
                </div>
            </div>
        `;
        
        sourcesContainer.innerHTML = `
            <div class="source-item">
                <div class="source-info">
                    <span class="source-dot" style="background-color:#bf5af2;"></span>
                    <span>${evt.sources[0]?.name || 'Space Control Center'}</span>
                </div>
                <span class="source-reliability">ACTIVE FEED</span>
            </div>
        `;
        
        linkBtn.href = "#";
        linkBtn.querySelector('span').innerText = "Open Space Radar (Mock)";
    } else {
        document.getElementById('detail-location').innerText = evt.location;
        document.getElementById('detail-time').innerText = formatTimeElapsed(evt.timestamp);
        document.getElementById('detail-title').innerText = evt.title;
        detailLat.innerText = `${evt.lat.toFixed(4)}° ${evt.lat >= 0 ? 'N' : 'S'}`;
        detailLng.innerText = `${evt.lng.toFixed(4)}° ${evt.lng >= 0 ? 'E' : 'W'}`;
        
        // Restore standard text summary
        detailSummary.innerText = evt.summary;
        
        // Render verified sources lists
        sourcesContainer.innerHTML = '';
        evt.sources.forEach(src => {
            const item = document.createElement('div');
            item.className = 'source-item';
            item.innerHTML = `
                <div class="source-info">
                    <span class="source-dot ${src.highReliability ? '' : 'med'}"></span>
                    <span>${src.name}</span>
                </div>
                <span class="source-reliability ${src.highReliability ? '' : 'med'}">
                    ${src.reliability}
                </span>
            `;
            sourcesContainer.appendChild(item);
        });

        // External link configuration
        linkBtn.href = evt.sourceLink;
        linkBtn.querySelector('span').innerText = "View Original Coverage";
    }

    // Slide open details panel
    panel.classList.remove('closed');
    
    // Re-create icons in detail panel
    lucide.createIcons();
}

// Slide detail panel out of view
function closeDetailPanel() {
    state.selectedEventId = null;
    document.getElementById('detail-panel').classList.add('closed');
    document.querySelectorAll('.news-card').forEach(card => card.classList.remove('active'));
    updateGlobePoints();
    AudioController.playBeep(450, 0.1);
}

// Reset camera angle and distance to global view
function resetCameraView() {
    if (globeInstance) {
        globeInstance.pointOfView({
            lat: 10.0,
            lng: 25.0,
            altitude: getResponsiveAltitude(2.5)
        }, 1200);
    }
    state.selectedEventId = null;
    document.getElementById('detail-panel').classList.add('closed');
    document.querySelectorAll('.news-card').forEach(card => card.classList.remove('active'));
    updateGlobePoints();
    AudioController.playBeep(500, 0.12);
}

// Copy coordinates tool
function copyCoordinatesToClipboard() {
    if (!state.selectedEventId) return;
    const selected = state.events.find(e => e.id === state.selectedEventId);
    if (!selected) return;

    const coordsText = `Lat: ${selected.lat.toFixed(5)}, Lng: ${selected.lng.toFixed(5)} (${selected.location})`;
    navigator.clipboard.writeText(coordsText).then(() => {
        // UI notification for clipboard copy success
        AudioController.playBeep(900, 0.1);
        const shareBtn = document.getElementById('btn-share');
        const spanText = shareBtn.querySelector('span');
        const prevText = spanText.innerText;
        spanText.innerText = "Coordinates Copied!";
        shareBtn.classList.add('btn-primary');
        
        setTimeout(() => {
            spanText.innerText = prevText;
            shareBtn.classList.remove('btn-primary');
        }, 2000);
    }).catch(err => {
        console.error("Unable to copy to clipboard", err);
    });
}

// ==========================================================================
// SIMULATOR CONTROLLERS
// ==========================================================================

// Trigger a simulated incoming live news event
function triggerSimulatedEvent() {
    // Pick a random event from simulator pool
    const template = simulationPool[Math.floor(Math.random() * simulationPool.length)];
    
    // Add variations or randomized ID & time
    const simulatedEvent = {
        ...template,
        id: `sim-${Date.now()}`,
        timestamp: Date.now(),
        // Keep it realistic by providing varying sub-links
        sourceLink: template.sourceLink + `?ref=global-insights-${Date.now()}`
    };

    // Prepend new event to the state database
    state.events.unshift(simulatedEvent);
    
    // Filter and update views
    filterNewsData();
    updateHeaderStats();

    // Trigger visual notification toast HUD
    showToastNotification(simulatedEvent);

    // Play deep sonar warning sound
    AudioController.playSonarAlert();

    // Automatically zoom/fly camera to coordinate on globe to capture user interest
    if (globeInstance) {
        globeInstance.pointOfView({
            lat: simulatedEvent.lat,
            lng: simulatedEvent.lng,
            altitude: getResponsiveAltitude(1.4)
        }, 1800);
        
        // Also select it
        state.selectedEventId = simulatedEvent.id;
        populateDetailsPanel(simulatedEvent);
        updateGlobePoints();
    }
}

// Show overlay alert toast
function showToastNotification(evt) {
    const toast = document.getElementById('live-alert-notification');
    const toastTitle = document.getElementById('toast-title');
    const toastDesc = document.getElementById('toast-desc');
    const toastIndicator = toast.querySelector('.toast-indicator');
    
    toastTitle.innerText = evt.title;
    toastDesc.innerText = `${evt.location} — ${evt.summary.substring(0, 100)}...`;
    
    // Style toast according to category
    const catColor = getCategoryColor(evt.category);
    toast.style.borderColor = catColor;
    toastIndicator.style.backgroundColor = catColor;
    toastIndicator.style.boxShadow = `0 0 10px ${catColor}`;

    toast.classList.remove('hidden');

    // Auto close toast after 8 seconds
    const autoCloseTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 8000);
    
    // Bind click to manually dismiss toast
    document.getElementById('btn-close-toast').onclick = () => {
        clearTimeout(autoCloseTimeout);
        toast.classList.add('hidden');
        AudioController.playBeep(400, 0.08);
    };
}

// Toggle Live simulation loop on/off
function toggleSimulation() {
    const btn = document.getElementById('btn-simulation');
    const icon = btn.querySelector('.btn-icon');
    const textSpan = btn.querySelector('span');

    state.isSimulating = !state.isSimulating;

    if (state.isSimulating) {
        btn.classList.add('sim-active');
        icon.setAttribute('data-lucide', 'square');
        textSpan.innerText = 'SIMULATOR ON';
        
        // Trigger first simulation immediately
        triggerSimulatedEvent();
        
        // Setup loop: trigger every 14 seconds
        state.simulationIntervalId = setInterval(triggerSimulatedEvent, 14000);
        AudioController.playBeep(850, 0.25, 'triangle');
    } else {
        btn.classList.remove('sim-active');
        icon.setAttribute('data-lucide', 'play');
        textSpan.innerText = 'SIMULATOR OFF';
        
        // Clear interval loop
        if (state.simulationIntervalId) {
            clearInterval(state.simulationIntervalId);
            state.simulationIntervalId = null;
        }
        AudioController.playBeep(400, 0.15);
    }
    
    // Re-bind Lucide icons
    lucide.createIcons();
}

// Toggle Sound FX system on/off
function toggleAudioSetting() {
    state.audioEnabled = !state.audioEnabled;
    const btn = document.getElementById('btn-audio');
    const icon = document.getElementById('audio-icon');

    if (state.audioEnabled) {
        icon.setAttribute('data-lucide', 'volume-2');
        btn.style.color = '';
        btn.style.borderColor = '';
        AudioController.playBeep(800, 0.1);
    } else {
        icon.setAttribute('data-lucide', 'volume-x');
        btn.style.color = 'var(--text-muted)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.05)';
    }
    
    // Recreate audio button icon
    lucide.createIcons();
}

// Toggle Globe Auto rotation controls
function toggleGlobeRotation() {
    state.isRotating = !state.isRotating;
    const btn = document.getElementById('btn-toggle-rotation');

    if (state.isRotating) {
        btn.classList.add('active');
        if (globeInstance) globeInstance.controls().autoRotate = true;
        AudioController.playBeep(700, 0.08);
    } else {
        btn.classList.remove('active');
        if (globeInstance) globeInstance.controls().autoRotate = false;
        AudioController.playBeep(400, 0.08);
    }
}

// Change Globe texture skin styles
function changeGlobeStyle(event) {
    const selectedStyle = event.target.value;
    state.globeStyle = selectedStyle;
    
    if (globeInstance) {
        const config = globeStyleMaps[selectedStyle];
        globeInstance
            .globeImageUrl(config.globeImageUrl)
            .bumpImageUrl(config.bumpImageUrl);
            
        // Transition scene container background
        document.getElementById('globe-container').style.background = `radial-gradient(circle at center, ${config.backgroundColor}b3 0%, #030406 100%)`;
        AudioController.playBeep(600, 0.12);
    }
}

// Toggle News API Key input group in settings modal
function toggleApiKeyGroup(source) {
    const keyGroup = document.getElementById('gnews-api-key-group');
    if (source === 'gnews') {
        keyGroup.classList.remove('hidden');
    } else {
        keyGroup.classList.add('hidden');
    }
}

// Load news according to active configuration source
function loadInitialEvents() {
    if (state.newsSource === 'gnews' && state.gnewsApiKey) {
        fetchLiveGNews(state.gnewsApiKey);
    } else {
        // Fallback to static mock database
        state.events = [...initialNewsDatabase];
        state.filteredEvents = [...state.events];
        renderNewsList();
        updateHeaderStats();
        if (globeInstance) {
            updateGlobePoints();
            resetCameraView();
        }
    }
}

// Fetch live global news headlines from GNews API
function fetchLiveGNews(apiKey) {
    const url = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&apikey=${apiKey}`;
    
    // Show loading indicator or update lists
    const listContainer = document.getElementById('news-list');
    listContainer.innerHTML = '<div style="padding:24px; text-align:center; color:var(--text-muted); font-size:13px;"><i data-lucide="loader" class="logo-icon spin-animation" style="margin-bottom:8px;"></i><p>Fetching GNews live feed...</p></div>';
    lucide.createIcons();
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.articles || data.articles.length === 0) {
                throw new Error("No articles returned from API.");
            }
            
            // Map GNews articles to Global Insights formatted events
            state.events = data.articles.map((art, idx) => {
                const text = (art.title + " " + art.description).toLowerCase();
                
                // 1. Geocode article: search text for cities/countries
                let lat = 0;
                let lng = 0;
                let locationName = "";
                
                // Match city
                const matchedCity = cityGeoCoordinates.find(c => text.includes(c.name.toLowerCase()));
                if (matchedCity) {
                    lat = matchedCity.lat;
                    lng = matchedCity.lng;
                    locationName = `${matchedCity.name}, ${matchedCity.country}`;
                } else {
                    // Match country name from text
                    let matchedCountry = null;
                    for (const key in countryGeoCoordinates) {
                        const country = countryGeoCoordinates[key];
                        if (text.includes(country.name.toLowerCase())) {
                            matchedCountry = country;
                            break;
                        }
                    }
                    
                    // Specific overrides for common country aliases, demonyms, or capitals
                    if (!matchedCountry) {
                        if (text.includes("us ") || text.includes("usa") || text.includes("american") || text.includes("washington")) {
                            matchedCountry = countryGeoCoordinates['us'];
                        } else if (text.includes("uk") || text.includes("britain") || text.includes("british") || text.includes("london") || text.includes("england")) {
                            matchedCountry = countryGeoCoordinates['gb'];
                        } else if (text.includes("india") || text.includes("indian") || text.includes("delhi") || text.includes("mumbai")) {
                            matchedCountry = countryGeoCoordinates['in'];
                        } else if (text.includes("japan") || text.includes("japanese") || text.includes("tokyo")) {
                            matchedCountry = countryGeoCoordinates['jp'];
                        } else if (text.includes("canada") || text.includes("canadian") || text.includes("toronto") || text.includes("prairies")) {
                            matchedCountry = countryGeoCoordinates['ca'];
                        } else if (text.includes("france") || text.includes("french") || text.includes("paris")) {
                            matchedCountry = countryGeoCoordinates['fr'];
                        } else if (text.includes("germany") || text.includes("german") || text.includes("berlin")) {
                            matchedCountry = countryGeoCoordinates['de'];
                        } else if (text.includes("spain") || text.includes("spanish") || text.includes("barcelona") || text.includes("madrid")) {
                            matchedCountry = countryGeoCoordinates['es'];
                        } else if (text.includes("russia") || text.includes("russian") || text.includes("moscow")) {
                            matchedCountry = countryGeoCoordinates['ru'];
                        } else if (text.includes("china") || text.includes("chinese") || text.includes("beijing")) {
                            matchedCountry = countryGeoCoordinates['cn'];
                        } else if (text.includes("israel") || text.includes("israeli") || text.includes("hezbollah")) {
                            matchedCountry = countryGeoCoordinates['il'];
                        } else if (text.includes("lebanon") || text.includes("lebanese") || text.includes("beirut")) {
                            matchedCountry = countryGeoCoordinates['lb'];
                        } else if (text.includes("iran") || text.includes("iranian") || text.includes("tehran")) {
                            matchedCountry = countryGeoCoordinates['ir'];
                        }
                    }
                    
                    if (matchedCountry) {
                        lat = matchedCountry.lat + (Math.random() - 0.5) * 4; // Add slight noise to avoid overlaps
                        lng = matchedCountry.lng + (Math.random() - 0.5) * 4;
                        locationName = matchedCountry.name;
                    } else {
                        // Fully distribute if nothing matches using title hash
                        const hash = art.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        lat = (hash % 120) - 60; // -60 to 60 lat
                        lng = (hash % 240) - 120; // -120 to 120 lng
                        locationName = "International Waters";
                    }
                }
                
                // 2. Assign dynamic category based on content keywords
                let category = "breaking";
                if (text.includes("earthquake") || text.includes("flood") || text.includes("storm") || text.includes("hurricane") || text.includes("wildfire") || text.includes("disaster") || text.includes("cyclone") || text.includes("typhoon")) {
                    category = "disaster";
                } else if (text.includes("clash") || text.includes("military") || text.includes("cyber") || text.includes("attack") || text.includes("security") || text.includes("border") || text.includes("war") || text.includes("conflict")) {
                    category = "conflict";
                } else if (text.includes("quantum") || text.includes("space") || text.includes("science") || text.includes("tech") || text.includes("ai") || text.includes("chip") || text.includes("software")) {
                    category = "tech";
                } else if (text.includes("president") || text.includes("minister") || text.includes("election") || text.includes("treaty") || text.includes("summit") || text.includes("policy") || text.includes("politics")) {
                    category = "politics";
                }
                
                return {
                    id: `gnews-${idx}-${Date.now()}`,
                    title: art.title,
                    summary: art.description || art.content || "No summary provided by source.",
                    category: category,
                    location: locationName || art.source.name,
                    lat: lat,
                    lng: lng,
                    time: formatTimeElapsed(Date.parse(art.publishedAt)),
                    timestamp: Date.parse(art.publishedAt) || (Date.now() - idx * 1800000),
                    sources: [
                        { name: art.source.name, link: art.source.url, reliability: "Live Coverage", highReliability: true }
                    ],
                    sourceLink: art.url
                };
            });
            
            state.filteredEvents = [...state.events];
            renderNewsList();
            updateHeaderStats();
            if (globeInstance) {
                updateGlobePoints();
                // Fly to first live article
                if (state.events.length > 0) {
                    setTimeout(() => selectEvent(state.events[0]), 800);
                }
            }
        })
        .catch(err => {
            console.error("GNews fetch failed, reverting to local data", err);
            listContainer.innerHTML = `<div style="padding:24px; text-align:center; color:var(--danger); font-size:13px;"><i data-lucide="alert-triangle" style="margin-bottom:8px; width:24px; height:24px;"></i><p>Failed to load live news: ${err.message}</p><p style="font-size:11px; margin-top:6px; color:var(--text-muted);">Please check your API key and internet connection. Reverting to local database in 3s...</p></div>`;
            lucide.createIcons();
            
            setTimeout(() => {
                state.newsSource = 'local';
                loadInitialEvents();
            }, 4000);
        });
}

// Initialize system clock timer
function initSystemClock() {
    const clock = document.getElementById('current-time');
    function updateClock() {
        const date = new Date();
        const timeString = date.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        clock.innerText = timeString;
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// ==========================================================================
// GLOBE INITIALIZATION & BINDINGS
// ==========================================================================
function initGlobe() {
    const container = document.getElementById('globe-container');
    
    // Get actual container dimensions
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    
    // Initialize Globe.gl with explicit width and height
    globeInstance = Globe()(container)
        .width(width)
        .height(height)
        .globeImageUrl(globeStyleMaps[state.globeStyle].globeImageUrl)
        .bumpImageUrl(globeStyleMaps[state.globeStyle].bumpImageUrl)
        .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
        .showAtmosphere(true)
        .atmosphereColor('#00f0ff')
        
        // Point style configurations
        .pointLat('lat')
        .pointLng('lng')
        .pointColor(d => getCategoryColor(d.category))
        .pointRadius(1.2) // Set radius for flat circles
        .pointAltitude(0.002) // Flat circles on the surface (no vertical pillars!)
        .pointsMerge(false)
        .pointLabel(d => `
            <div class="globe-tooltip">
                <span class="badge badge-${d.category}">${d.category}</span>
                <strong style="display:block; margin: 6px 0 2px 0; font-family: Outfit, sans-serif; font-size: 13px;">${d.title}</strong>
                <span style="color: var(--text-muted); font-size:10px;">📍 ${d.location}</span>
            </div>
        `)
        
        // Ring style configurations
        .ringLat('lat')
        .ringLng('lng')
        .ringColor(d => getCategoryColor(d.category))
        .ringMaxRadius(5)
        .ringPropagationSpeed(2.2)
        .ringRepeatPeriod(1000)
        
        // Pointer interactions
        .onPointClick(selectEvent)
        
        // Arc style configurations for Flight Radar
        .arcStartLat(d => d.startLat)
        .arcStartLng(d => d.startLng)
        .arcEndLat(d => d.endLat)
        .arcEndLng(d => d.endLng)
        .arcColor(d => [
            d.id === state.selectedEventId ? '#ffffff' : 'rgba(0, 240, 255, 0.45)',
            d.id === state.selectedEventId ? '#00f0ff' : 'rgba(191, 90, 242, 0.45)'
        ])
        .arcAltitude(0) // Direct lines flat on the surface!
        .arcStroke(d => d.id === state.selectedEventId ? 2.2 : 1.2)
        .arcDashLength(0.25)
        .arcDashGap(2.0)
        .arcDashAnimateTime(d => d.id === state.selectedEventId ? 1600 : 3600)
        .arcLabel(d => `
            <div class="globe-tooltip">
                <span class="badge badge-flights">FLIGHT RADAR</span>
                <strong style="display:block; margin: 6px 0 2px 0; font-family: Outfit, sans-serif; font-size: 13px;">
                    ✈ ${d.airline} ${d.flightNumber}
                </strong>
                <span style="color: var(--text-main); font-size: 11px;">${d.origin} ➔ ${d.destination}</span><br>
                <span style="color: var(--text-muted); font-size: 10px; font-family: monospace;">Alt: ${d.altitudeFt} | Spd: ${d.speed}</span>
            </div>
        `)
        .onArcClick(selectEvent)
        
        // Path configurations for satellite orbits
        .pathsData([]) // Will be populated dynamically in updateGlobePoints()
        .pathPoints(d => d.points)
        .pathColor(d => d.id === state.selectedEventId ? '#ffffff' : 'rgba(191, 90, 242, 0.45)')
        .pathStroke(d => d.id === state.selectedEventId ? 2.5 : 1.2)
        .pathLabel(d => `
            <div class="globe-tooltip">
                <span class="badge badge-satellites">ORBIT TRAJECTORY</span>
                <strong style="display:block; margin: 6px 0 2px 0; font-family: Outfit, sans-serif; font-size: 13px;">
                    ${d.name} Orbit
                </strong>
                <span style="color: var(--text-main); font-size: 11px;">Altitude: ${d.altitudeFt} | Inclination: ${d.inclination}°</span>
            </div>
        `)
        
        // HTML markers for airplanes and satellites
        .htmlElement(d => {
            const el = document.createElement('div');
            el.style.pointerEvents = 'auto';
            el.style.cursor = 'pointer';
            
            if (d.category === 'satellites') {
                el.className = 'satellite-element';
                el.innerHTML = `
                    <div style="transform: rotate(${d.heading}deg); display: flex; align-items: center; justify-content: center;">
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="#bf5af2" stroke="none">
                            <rect x="2" y="9" width="5" height="6" rx="1"/>
                            <line x1="7" y1="12" x2="9" y2="12" stroke="#bf5af2" stroke-width="1.5"/>
                            <rect x="17" y="9" width="5" height="6" rx="1"/>
                            <line x1="15" y1="12" x2="17" y2="12" stroke="#bf5af2" stroke-width="1.5"/>
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M12 9V6M10 6h4" stroke="#bf5af2" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </div>
                `;
                el.onclick = (e) => {
                    e.stopPropagation();
                    const originalSat = satellitesDatabase.find(s => s.id === d.id);
                    if (originalSat) selectEvent(originalSat);
                };
            } else {
                el.className = 'airplane-element';
                el.innerHTML = `
                    <div style="transform: rotate(${d.heading}deg); display: flex; align-items: center; justify-content: center;">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="#00f0ff" stroke="none">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l8 2.5z"/>
                        </svg>
                    </div>
                `;
                el.onclick = (e) => {
                    e.stopPropagation();
                    const originalFlight = flightsDatabase.find(f => f.id === d.id);
                    if (originalFlight) selectEvent(originalFlight);
                };
            }
            return el;
        });

    // Configure Three.js orbit controls for smooth momentum rotation
    const controls = globeInstance.controls();
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 600;
    controls.minDistance = 150;
    controls.autoRotate = state.isRotating;
    controls.autoRotateSpeed = 0.45;

    // Reset camera position to default centered view
    globeInstance.pointOfView({ lat: 15.0, lng: 15.0, altitude: getResponsiveAltitude(2.4) });
    
    // Use ResizeObserver for robust layout-shift & resize responsiveness
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0) {
                requestAnimationFrame(() => {
                    if (globeInstance) {
                        globeInstance.width(width);
                        globeInstance.height(height);
                    }
                });
            }
        }
    });
    resizeObserver.observe(container);

    // Track mouse coordinate movement over the globe surface using toGeoCoords
    container.addEventListener('mousemove', event => {
        if (!globeInstance) return;
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const coords = globeInstance.toGeoCoords({ x, y });
        const coordsDisplay = document.getElementById('hud-coords');
        if (coords && !isNaN(coords.lat) && !isNaN(coords.lng)) {
            const latStr = `${Math.abs(coords.lat).toFixed(3)}° ${coords.lat >= 0 ? 'N' : 'S'}`;
            const lngStr = `${Math.abs(coords.lng).toFixed(3)}° ${coords.lng >= 0 ? 'E' : 'W'}`;
            coordsDisplay.innerText = `${latStr}, ${lngStr}`;
        } else {
        coordsDisplay.innerText = '---';
        }
    });

    // Start loop for animating flying airplanes
    startFlightProgressLoop();
}

// Loop for animating flight and satellite coordinates and rendering HTML markers
function startFlightProgressLoop() {
    if (flightProgressTimer) clearInterval(flightProgressTimer);
    
    // Initialize flight progress values randomly to spread out planes
    flightsDatabase.forEach(flt => {
        if (flt.progress === undefined) {
            flt.progress = Math.random(); // Start at a random position on route
        }
    });
    
    flightProgressTimer = setInterval(() => {
        // If category is not flights, satellites, or all, clear html elements
        if (state.selectedCategory !== 'flights' && state.selectedCategory !== 'satellites' && state.selectedCategory !== 'all') {
            if (globeInstance) {
                globeInstance.htmlElementsData([]);
            }
            return;
        }
        
        let activeElements = [];
        
        // 1. Calculate and update flights
        if (state.selectedCategory === 'flights' || state.selectedCategory === 'all') {
            const activeAirplanes = flightsDatabase.map(flt => {
                // Update progress
                flt.progress += 0.0018; // Slow down speed slightly for realistic pacing
                if (flt.progress > 1) {
                    flt.progress = 0; // Loop flight route
                }
                
                // Interpolate position along the path (with shortest-path wrap-around support)
                const lat = flt.startLat + flt.progress * (flt.endLat - flt.startLat);
                
                let startLng = flt.startLng;
                let endLng = flt.endLng;
                let dLng = endLng - startLng;
                if (Math.abs(dLng) > 180) {
                    if (dLng > 0) {
                        startLng += 360;
                    } else {
                        endLng += 360;
                    }
                }
                
                let lng = startLng + flt.progress * (endLng - startLng);
                if (lng > 180) lng -= 360;
                if (lng < -180) lng += 360;
                
                // Flat cruising altitude directly following the surface route
                const altitude = 0.015;
                
                // Calculate heading angle
                const dy = flt.endLat - flt.startLat;
                const dx = endLng - startLng;
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                const heading = 90 - angle; // Adjust for SVG vertical alignment
                
                return {
                    id: flt.id,
                    title: `${flt.airline} ${flt.flightNumber}`,
                    category: 'flights',
                    lat,
                    lng,
                    altitude,
                    heading
                };
            });
            activeElements = activeElements.concat(activeAirplanes);
        }
        
        // 2. Calculate and update satellites
        let activeSatellites = [];
        if (state.selectedCategory === 'satellites' || state.selectedCategory === 'all') {
            activeSatellites = satellitesDatabase.map(sat => {
                // Increment orbit angle theta (radians)
                sat.progress += sat.speedFactor;
                if (sat.progress > 2 * Math.PI) {
                    sat.progress -= 2 * Math.PI;
                }
                
                const theta = sat.progress;
                
                // Calculate 3D position vector and convert to spherical lat/lng
                const x = Math.cos(theta);
                const y = Math.sin(theta) * Math.cos(sat.inclinationRad);
                const z = Math.sin(theta) * Math.sin(sat.inclinationRad);
                
                const lat = Math.asin(z) * 180 / Math.PI;
                const lng = Math.atan2(y, x) * 180 / Math.PI;
                
                // Calculate orbital heading angle (tangent to orbit circular path)
                const dx = -Math.sin(theta);
                const dy = Math.cos(theta) * Math.cos(sat.inclinationRad);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                const heading = 90 - angle;
                
                return {
                    id: sat.id,
                    name: sat.name,
                    category: 'satellites',
                    lat,
                    lng,
                    altitude: sat.altitude,
                    heading
                };
            });
            activeElements = activeElements.concat(activeSatellites);
        }
        
        if (globeInstance) {
            // Render HTML elements (airplanes and satellites)
            globeInstance.htmlElementsData(activeElements);
        }
        
        // 3. Dynamic Camera Tracking and coordinates readout for Satellites
        if (state.selectedEventId && state.selectedEventId.startsWith('sat-')) {
            const selectedSat = activeSatellites.find(s => s.id === state.selectedEventId);
            if (selectedSat) {
                if (globeInstance) {
                    globeInstance.pointOfView({
                        lat: selectedSat.lat,
                        lng: selectedSat.lng,
                        altitude: getResponsiveAltitude(2.0)
                    }, 0); // Lock lookAt coordinates instantly
                }
                
                // Update dynamic values in sidebar details panel live!
                const detailLat = document.getElementById('detail-lat');
                const detailLng = document.getElementById('detail-lng');
                if (detailLat && detailLng) {
                    detailLat.innerText = `${Math.abs(selectedSat.lat).toFixed(4)}° ${selectedSat.lat >= 0 ? 'N' : 'S'}`;
                    detailLng.innerText = `${Math.abs(selectedSat.lng).toFixed(4)}° ${selectedSat.lng >= 0 ? 'E' : 'W'}`;
                }
            }
        }
    }, 35);
}

// Bind standard application event listeners
function bindAppEvents() {
    // Search Box Listener
    document.getElementById('search-input').addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        filterNewsData();
    });

    // Category Tabs Buttons Listeners
    document.querySelectorAll('.category-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active classes
            document.querySelectorAll('.category-tabs .tab-btn').forEach(b => b.classList.remove('active'));
            
            // Set current active selection
            const category = e.currentTarget.getAttribute('data-category');
            e.currentTarget.classList.add('active');
            
            state.selectedCategory = category;
            filterNewsData();
            
            AudioController.playBeep(600, 0.08);
        });
    });

    // Audio & Simulation buttons bindings
    document.getElementById('btn-audio').addEventListener('click', toggleAudioSetting);
    document.getElementById('btn-simulation').addEventListener('click', toggleSimulation);
    document.getElementById('btn-toggle-rotation').addEventListener('click', toggleGlobeRotation);
    document.getElementById('select-globe-style').addEventListener('change', changeGlobeStyle);
    
    // Reset camera view button
    document.getElementById('btn-reset-camera').addEventListener('click', resetCameraView);

    // Close details panel buttons
    document.getElementById('btn-close-detail').addEventListener('click', closeDetailPanel);
    document.getElementById('btn-share').addEventListener('click', copyCoordinatesToClipboard);

    // Settings Modal Toggle Bindings
    const settingsModal = document.getElementById('settings-modal');
    const selectNewsSource = document.getElementById('select-news-source');
    
    document.getElementById('btn-settings').addEventListener('click', () => {
        // Hydrate settings fields from state
        selectNewsSource.value = state.newsSource;
        document.getElementById('input-gnews-key').value = state.gnewsApiKey;
        toggleApiKeyGroup(state.newsSource);
        
        settingsModal.classList.remove('hidden');
        AudioController.playBeep(700, 0.1);
    });

    document.getElementById('btn-close-settings').addEventListener('click', () => {
        settingsModal.classList.add('hidden');
        AudioController.playBeep(450, 0.1);
    });

    selectNewsSource.addEventListener('change', (e) => {
        toggleApiKeyGroup(e.target.value);
        AudioController.playBeep(600, 0.08);
    });

    document.getElementById('btn-save-settings').addEventListener('click', () => {
        const sourceVal = selectNewsSource.value;
        const keyVal = document.getElementById('input-gnews-key').value.trim();

        if (sourceVal === 'gnews' && !keyVal) {
            alert("Please enter a valid GNews API key or select Local Simulator.");
            AudioController.playBeep(300, 0.25, 'triangle');
            return;
        }

        // Save config in state and storage
        state.newsSource = sourceVal;
        state.gnewsApiKey = keyVal;
        localStorage.setItem('gnews_api_source', sourceVal);
        localStorage.setItem('gnews_api_key', keyVal);

        settingsModal.classList.add('hidden');
        AudioController.playBeep(900, 0.15);

        // Reload feed
        loadInitialEvents();
    });
}

// ==========================================================================
// SYSTEM BOOTSTRAP INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Load configuration settings from localStorage on startup
    let savedSource = localStorage.getItem('gnews_api_source');
    let savedKey = localStorage.getItem('gnews_api_key');
    
    // Proactively pre-fill the API key provided by the user
    if (!savedKey) {
        savedKey = 'eb7f1865b5fc351f9e8b0695b48cbad1';
        savedSource = 'gnews';
        localStorage.setItem('gnews_api_key', savedKey);
        localStorage.setItem('gnews_api_source', savedSource);
    }
    
    state.newsSource = savedSource || 'gnews';
    state.gnewsApiKey = savedKey || 'eb7f1865b5fc351f9e8b0695b48cbad1';
    
    // Hydrate form values on boot
    document.getElementById('select-news-source').value = state.newsSource;
    document.getElementById('input-gnews-key').value = state.gnewsApiKey;
    toggleApiKeyGroup(state.newsSource);

    // 1. Initialize news feed from configured source
    loadInitialEvents();
    
    // 2. Initialize UI elements clocks and lists
    initSystemClock();
    bindAppEvents();
    renderNewsList();
    updateHeaderStats();
    
    // 3. Render 3D Earth Globe
    initGlobe();
    updateGlobePoints();
    
    // 4. Run lucide graphics generator
    lucide.createIcons();
    
    // 5. Initial greeting audio beep
    setTimeout(() => {
        AudioController.playBeep(880, 0.3, 'sine');
    }, 1000);
});
