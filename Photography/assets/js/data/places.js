/* ARC-NATURE PHOTOGRAPHY — places for the travel map.
 * Each place lists the exact `location` strings from photos.js that belong to it.
 * precision: 'place' = a specific spot; 'area' = a broad region (drawn as a dashed marker).
 * Adding a photo with a NEW location? Add its string to an existing place's `match`,
 * or add a new place. Unmatched locations are simply not shown on the map. */
'use strict';

const PLACES = [
    // ---------- Ontario ----------
    { name: 'Ontario (various locations)', lat: 44.3, lng: -79.4, precision: 'area', region: 'Ontario', country: 'Canada', match: ['Ontario, Canada', 'Great Lakes, Ontario, Canada', 'Eagle’s Nest Lookout, Ontario, Canada'] },
    { name: 'Niagara Falls', lat: 43.0828, lng: -79.0742, region: 'Ontario', country: 'Canada', match: ['Niagara Falls, Ontario, Canada'] },
    { name: 'Niagara River & Gorge', lat: 43.1194, lng: -79.0645, region: 'Ontario', country: 'Canada', match: ['Niagara River, Ontario, Canada'] },
    { name: 'Toronto', lat: 43.6532, lng: -79.3832, region: 'Ontario', country: 'Canada', match: ['Toronto, Ontario, Canada', 'Toronto Pearson International Airport, Toronto, ON, Canada'] },
    { name: 'Mississauga', lat: 43.589, lng: -79.6441, region: 'Ontario', country: 'Canada', match: ['Mississauga, Ontario, Canada'] },
    { name: 'Burlington', lat: 43.3255, lng: -79.799, region: 'Ontario', country: 'Canada', match: ['Burlington, Ontario, Canada'] },
    { name: 'Hamilton', lat: 43.2557, lng: -79.8711, region: 'Ontario', country: 'Canada', match: ['Hamilton, Ontario, Canada'] },
    { name: 'Lake Ontario shoreline', lat: 43.62, lng: -78.3, precision: 'area', region: 'Ontario', country: 'Canada', match: ['Lake Ontario, Ontario, Canada'] },
    { name: 'Cambridge', lat: 43.3616, lng: -80.3144, region: 'Ontario', country: 'Canada', match: ['Cambridge, Ontario, Canada'] },
    { name: 'Kitchener', lat: 43.4516, lng: -80.4925, region: 'Ontario', country: 'Canada', match: ['Kitchener, Ontario, Canada'] },
    { name: 'Guelph', lat: 43.5448, lng: -80.2482, region: 'Ontario', country: 'Canada', match: ['Guelph, Ontario, Canada'] },
    { name: 'Elora', lat: 43.6846, lng: -80.4307, region: 'Ontario', country: 'Canada', match: ['Elora, Ontario, Canada'] },
    { name: 'Long Point', lat: 42.5826, lng: -80.3966, region: 'Ontario', country: 'Canada', match: ['Long Point, Ontario, Canada'] },
    { name: 'Windsor', lat: 42.3149, lng: -83.0364, region: 'Ontario', country: 'Canada', match: ['Windsor, Ontario, Canada'] },
    { name: 'Sarnia', lat: 42.9745, lng: -82.4066, region: 'Ontario', country: 'Canada', match: ['Sarnia, Ontario, Canada'] },
    { name: 'Lake Huron shore', lat: 44.3, lng: -81.75, precision: 'area', region: 'Ontario', country: 'Canada', match: ['Lake Huron, Ontario, Canada'] },
    { name: 'Sauble Falls', lat: 44.6777, lng: -81.2589, region: 'Ontario', country: 'Canada', match: ['Sauble Falls, Ontario, Canada'] },
    { name: 'Owen Sound', lat: 44.5672, lng: -80.9435, region: 'Ontario', country: 'Canada', match: ['Owen Sound, Ontario, Canada'] },
    { name: 'Bruce Peninsula', lat: 45.0, lng: -81.33, region: 'Ontario', country: 'Canada', match: ['Bruce Peninsula, Ontario, Canada'] },
    { name: 'Tobermory', lat: 45.2534, lng: -81.6645, region: 'Ontario', country: 'Canada', match: ['Tobermory, Ontario, Canada'] },
    { name: 'Georgian Bay', lat: 45.35, lng: -80.65, precision: 'area', region: 'Ontario', country: 'Canada', match: ['Georgian Bay, Ontario, Canada'] },
    { name: 'Manitoulin Island', lat: 45.78, lng: -82.2, region: 'Ontario', country: 'Canada', match: ['Manitoulin Island, Ontario, Canada'] },
    { name: 'Sandbanks', lat: 43.9067, lng: -77.2596, region: 'Ontario', country: 'Canada', match: ['Sandbanks, Ontario, Canada'] },
    { name: 'Kingston', lat: 44.2312, lng: -76.486, region: 'Ontario', country: 'Canada', match: ['Kingston, Ontario, Canada'] },
    { name: 'Thousand Islands', lat: 44.33, lng: -76.02, region: 'Ontario', country: 'Canada', match: ['Thousand Islands, Ontario, Canada'] },
    { name: 'St. Lawrence River', lat: 44.62, lng: -75.62, precision: 'area', region: 'Ontario', country: 'Canada', match: ['St. Lawrence River, Ontario, Canada'] },
    { name: 'Perth', lat: 44.8995, lng: -76.2487, region: 'Ontario', country: 'Canada', match: ['Perth, Ontario, Canada'] },
    { name: 'Ottawa', lat: 45.4215, lng: -75.6972, region: 'Ontario', country: 'Canada', match: ['Ottawa, Ontario, Canada'] },
    { name: 'North Bay', lat: 46.3091, lng: -79.4608, region: 'Ontario', country: 'Canada', match: ['North Bay, Ontario, Canada'] },
    { name: 'Sudbury', lat: 46.4917, lng: -80.993, region: 'Ontario', country: 'Canada', match: ['Sudbury, Ontario, Canada'] },
    { name: 'Sault Ste. Marie', lat: 46.5219, lng: -84.3461, region: 'Ontario', country: 'Canada', match: ['Sault Ste. Marie, Ontario, Canada'] },
    { name: 'Wawa', lat: 47.9925, lng: -84.7738, region: 'Ontario', country: 'Canada', match: ['Wawa, Ontario, Canada'] },
    { name: 'Lake Superior north shore', lat: 48.25, lng: -86.6, precision: 'area', region: 'Ontario', country: 'Canada', match: ['Lake Superior, Ontario, Canada'] },
    { name: 'Nipigon', lat: 49.0128, lng: -88.2685, region: 'Ontario', country: 'Canada', match: ['Nipigon, Ontario, Canada'] },
    { name: 'Ouimet Canyon', lat: 48.7894, lng: -88.6747, region: 'Ontario', country: 'Canada', match: ['Ouimet Canyon, Ontario, Canada'] },
    { name: 'Sleeping Giant', lat: 48.405, lng: -88.775, region: 'Ontario', country: 'Canada', match: ['Sleeping Giant, Ontario, Canada', 'Sleeping Giant, Thunder Bay, Ontario, Canada'] },
    { name: 'Thunder Bay', lat: 48.3809, lng: -89.2477, region: 'Ontario', country: 'Canada', match: ['Thunder Bay, Ontario, Canada'] },
    { name: 'Mount McKay', lat: 48.343, lng: -89.305, region: 'Ontario', country: 'Canada', match: ['Mount McKay, Ontario, Canada'] },
    { name: 'Kakabeka Falls', lat: 48.4036, lng: -89.6233, region: 'Ontario', country: 'Canada', match: ['Kakabeka Falls, Ontario, Canada'] },

    // ---------- Québec ----------
    { name: 'Montréal', lat: 45.5019, lng: -73.5674, region: 'Québec', country: 'Canada', match: ['Montreal, Quebec, Canada', 'Mount Royal, Montreal, Quebec, Canada'] },
    { name: 'Québec City', lat: 46.8139, lng: -71.208, region: 'Québec', country: 'Canada', match: ['Quebec City, Quebec, Canada', 'Québec City, Québec, Canada'] },
    { name: 'Québec (other)', lat: 47.4, lng: -71.9, precision: 'area', region: 'Québec', country: 'Canada', match: ['Quebec, Canada'] },

    // ---------- Atlantic Canada ----------
    { name: 'Prince Edward Island', lat: 46.3, lng: -63.2, precision: 'area', region: 'Prince Edward Island', country: 'Canada', match: ['Prince Edward Island, Canada'] },
    { name: 'Thunder Cove Beach', lat: 46.5585, lng: -63.5645, region: 'Prince Edward Island', country: 'Canada', match: ['Thunder Cove Beach, Prince Edward Island, Canada'] },
    { name: 'West Point', lat: 46.6194, lng: -64.4136, region: 'Prince Edward Island', country: 'Canada', match: ['West Point, Prince Edward Island, Canada'] },
    { name: 'Nova Scotia (various)', lat: 45.1, lng: -63.3, precision: 'area', region: 'Nova Scotia', country: 'Canada', match: ['Nova Scotia, Canada'] },
    { name: 'Halifax', lat: 44.6488, lng: -63.5752, region: 'Nova Scotia', country: 'Canada', match: ['Halifax, Nova Scotia, Canada'] },
    { name: "Peggy's Cove", lat: 44.4925, lng: -63.9167, region: 'Nova Scotia', country: 'Canada', match: ["Peggy's Cove, Nova Scotia, Canada", 'Peggy’s Cove, Nova Scotia, Canada', "Peggy's Cove (Peggy’s Point Lighthouse), Nova Scotia, Canada"] },
    { name: 'Annapolis Royal', lat: 44.7417, lng: -65.5167, region: 'Nova Scotia', country: 'Canada', match: ['Annapolis Royal, Nova Scotia, Canada'] },
    { name: 'Cape Breton Highlands', lat: 46.75, lng: -60.65, region: 'Nova Scotia', country: 'Canada', match: ['Cape Breton Highlands, Nova Scotia, Canada'] },
    { name: 'Cape Breton Island', lat: 46.2, lng: -60.75, precision: 'area', region: 'Nova Scotia', country: 'Canada', match: ['Cape Breton, Nova Scotia, Canada'] },

    // ---------- Prairies ----------
    { name: 'Winnipeg', lat: 49.8951, lng: -97.1384, region: 'Manitoba', country: 'Canada', match: ['Winnipeg, Manitoba, Canada'] },
    { name: 'Manitoba (various)', lat: 50.6, lng: -97.0, precision: 'area', region: 'Manitoba', country: 'Canada', match: ['Manitoba, Canada'] },
    { name: 'Edmonton', lat: 53.5461, lng: -113.4938, region: 'Alberta', country: 'Canada', match: ['Edmonton, Alberta, Canada'] },
    { name: 'Calgary', lat: 51.0447, lng: -114.0719, region: 'Alberta', country: 'Canada', match: ['Calgary, Alberta, Canada'] },
    { name: 'Banff', lat: 51.1784, lng: -115.5708, region: 'Alberta', country: 'Canada', match: ['Banff, Alberta, Canada', 'Banff National Park, Alberta, Canada'] },
    { name: 'Lake Louise', lat: 51.4254, lng: -116.1773, region: 'Alberta', country: 'Canada', match: ['Lake Louise, Alberta, Canada'] },
    { name: 'Athabasca Glacier', lat: 52.1933, lng: -117.2447, region: 'Alberta', country: 'Canada', match: ['Athabasca Glacier, Alberta, Canada'] },
    { name: 'Jasper National Park', lat: 52.8737, lng: -118.0814, region: 'Alberta', country: 'Canada', match: ['Jasper National Park, Alberta, Canada'] },
    { name: 'Canadian Rockies (Alberta)', lat: 51.85, lng: -116.6, precision: 'area', region: 'Alberta', country: 'Canada', match: ['Canadian Rockies, Alberta, Canada', 'Alberta, Canada'] },

    // ---------- British Columbia ----------
    { name: 'Vancouver', lat: 49.2827, lng: -123.1207, region: 'British Columbia', country: 'Canada', match: ['Vancouver, British Columbia, Canada'] },
    { name: 'White Rock', lat: 49.0253, lng: -122.8029, region: 'British Columbia', country: 'Canada', match: ['White Rock, British Columbia, Canada'] },
    { name: 'Whistler', lat: 50.0636, lng: -122.9548, region: 'British Columbia', country: 'Canada', match: ['Whistler Mountain, British Columbia, Canada', 'Peak 2 Peak Gondola Area, Whistler, British Columbia, Canada'] },
    { name: 'BC Rockies', lat: 50.9, lng: -117.4, precision: 'area', region: 'British Columbia', country: 'Canada', match: ['British Columbia Rockies, BC, Canada'] },
    { name: 'British Columbia (various)', lat: 49.75, lng: -121.6, precision: 'area', region: 'British Columbia', country: 'Canada', match: ['British Columbia, Canada'] },
    { name: 'Victoria', lat: 48.4284, lng: -123.3656, region: 'British Columbia', country: 'Canada', match: ['Victoria, British Columbia, Canada'] },
    { name: 'The Butchart Gardens', lat: 48.5636, lng: -123.4705, region: 'British Columbia', country: 'Canada', match: ['The Butchart Gardens, Brentwood Bay, BC, Canada'] },
    { name: 'Hatley Park, Colwood', lat: 48.4334, lng: -123.4747, region: 'British Columbia', country: 'Canada', match: ['Colwood, British Columbia, Canada', 'Hatley Park National Historic Site, Colwood, BC, Canada'] },
    { name: 'Malahat SkyWalk', lat: 48.5598, lng: -123.5683, region: 'British Columbia', country: 'Canada', match: ['Malahat, British Columbia, Canada'] },
    { name: 'Shawnigan Lake (Kinsol Trestle)', lat: 48.6713, lng: -123.6928, region: 'British Columbia', country: 'Canada', match: ['Shawnigan Lake, British Columbia, Canada'] },
    { name: 'Botanical Beach, Port Renfrew', lat: 48.5294, lng: -124.4486, region: 'British Columbia', country: 'Canada', match: ['Botanical Beach, Port Renfrew, Vancouver Island, BC, Canada'] },
    { name: 'Vancouver Island (various)', lat: 49.3, lng: -124.6, precision: 'area', region: 'British Columbia', country: 'Canada', match: ['Vancouver Island, BC, Canada', 'Vancouver Island, British Columbia, Canada'] },
    { name: 'Gulf Islands', lat: 48.85, lng: -123.4, precision: 'area', region: 'British Columbia', country: 'Canada', match: ['Gulf Islands, British Columbia, Canada'] },

    // ---------- United States ----------
    { name: 'Detroit', lat: 42.3314, lng: -83.0458, region: 'Michigan', country: 'United States', match: ['Detroit, Michigan, USA'] },
    { name: 'Lewiston', lat: 43.1726, lng: -79.0359, region: 'New York', country: 'United States', match: ['Lewiston, New York, USA'] },

    // ---------- Europe & Middle East ----------
    { name: 'Rome', lat: 41.9028, lng: 12.4964, region: 'Lazio', country: 'Italy', match: ['Rome, Italy'] },
    { name: 'Vatican City', lat: 41.9029, lng: 12.4534, region: 'Vatican City', country: 'Vatican City', match: ['Vatican City'] },
    { name: 'Venice', lat: 45.4408, lng: 12.3155, region: 'Veneto', country: 'Italy', match: ['Venice, Italy'] },
    { name: 'Trento', lat: 46.0748, lng: 11.1217, region: 'Trentino', country: 'Italy', match: ['Trento, Trentino, Italy'] },
    { name: 'Dubai', lat: 25.1972, lng: 55.2744, region: 'Dubai', country: 'United Arab Emirates', match: ['Dubai, United Arab Emirates'] }
];
