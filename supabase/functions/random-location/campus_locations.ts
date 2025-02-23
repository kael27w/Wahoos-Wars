// import { getMapOfCoordinates } from './coordinates';

// export async function getCampusLocations() {
//   const locationData = await getMapOfCoordinates();
//   return locationData;
// }

// supabase/functions/random-location/campus_locations.ts
const CAMPUS_LOCATIONS = {
  "Library": {
    "locations": {  // Changed from "Locations" to match the format
      "Shannon": {  // Simplified name
        "coordinates": {
          "latitude": 38.0361361,
          "longitude": -78.505741
        },
        "radius": 15  // Changed from 0.007 to a more practical radius
      }
    }
  },
  "Gym": {
    "locations": {
      "Memorial": {
        "coordinates": {
          "latitude": 38.03740715,
          "longitude": -78.50718629317271
        },
        "radius": 30
      }
    }
  },
  "Athletic": {
    "locations": {
      "JPJ": {
        "coordinates": {
          "latitude": 38.04533959375,
          "longitude": -78.507128328125
        },
        "radius": 25
      },
      "Lambeth": {
        "coordinates": {
          "latitude": 38.04172135530057,
          "longitude": -78.50174004131011
        },
        "radius": 30
      }
    }
  },
  "Academic": {
    "locations": {
      "Rotunda": {
        "coordinates": {
          "latitude": 38.03563715,
          "longitude": -78.50339046615258
        },
        "radius": 20
      },
      "Rice": {
        "coordinates": {
          "latitude": 38.0317528,
          "longitude": -78.5108897
        },
        "radius": 15
      }
    }
  },
  "Dining": {
    "locations": {
      "Observatory": {
        "coordinates": {
          "latitude": 38.03709824462747,
          "longitude": -78.51466553124696
        },
        "radius": 25
      }
    }
  }
};

export function getCampusLocations() {
  return CAMPUS_LOCATIONS;
}