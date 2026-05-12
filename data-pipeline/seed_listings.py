import os
import random
from datetime import datetime, UTC
from dotenv import load_dotenv
from pymongo import MongoClient
from faker import Faker

load_dotenv()
fake = Faker()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["rentai"]
listings_collection = db["listings"]

neighbourhoods = [
    "Downtown Toronto", "North York", "Scarborough", "Etobicoke",
    "The Annex", "Liberty Village", "Yonge and Eglinton",
    "Kensington Market", "Queen West", "Leslieville",
    "High Park", "Yorkville", "Danforth", "Roncesvalles"
]

neighbourhood_coordinates = {
    "Downtown Toronto": (43.6532, -79.3832),
    "North York": (43.7615, -79.4111),
    "Scarborough": (43.7764, -79.2318),
    "Etobicoke": (43.6205, -79.5132),
    "The Annex": (43.6709, -79.4077),
    "Liberty Village": (43.6370, -79.4190),
    "Yonge and Eglinton": (43.7064, -79.3986),
    "Kensington Market": (43.6548, -79.4002),
    "Queen West": (43.6465, -79.4080),
    "Leslieville": (43.6620, -79.3357),
    "High Park": (43.6465, -79.4637),
    "Yorkville": (43.6709, -79.3933),
    "Danforth": (43.6796, -79.3400),
    "Roncesvalles": (43.6489, -79.4502)
}

property_types = ["Condo", "Apartment", "Basement", "Townhouse", "Studio"]

amenities_pool = [
    "gym", "parking", "laundry", "balcony", "pet-friendly",
    "pool", "concierge", "air conditioning", "storage locker",
    "bike storage", "dishwasher"
]

stations = [
    "Union", "Bloor-Yonge", "St George", "Finch", "Eglinton",
    "Kipling", "Kennedy", "Spadina", "Osgoode", "Queen"
]

image_urls = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
    "https://images.unsplash.com/photo-1560184897-ae75f418493e",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
]


def generate_price(bedrooms, neighbourhood):
    base = {
        0: 1800,
        1: 2300,
        2: 3100,
        3: 3900
    }.get(bedrooms, 2300)

    premium_areas = [
        "Downtown Toronto",
        "Yorkville",
        "Queen West",
        "Liberty Village"
    ]

    if neighbourhood in premium_areas:
        base += random.randint(200, 700)

    return base + random.randint(-300, 500)


def generate_coordinates(neighbourhood):
    base_lat, base_lng = neighbourhood_coordinates[neighbourhood]

    latitude = base_lat + random.uniform(-0.012, 0.012)
    longitude = base_lng + random.uniform(-0.012, 0.012)

    return round(latitude, 6), round(longitude, 6)


def generate_description(bedrooms, property_type, neighbourhood, amenities, transit_minutes):
    bedroom_text = "studio" if bedrooms == 0 else f"{bedrooms}-bedroom"
    amenity_text = ", ".join(amenities[:3])

    return (
        f"This {bedroom_text} {property_type.lower()} in {neighbourhood} offers a practical layout, "
        f"{amenity_text}, and convenient access to nearby services. "
        f"With an estimated transit time of {transit_minutes} minutes, it may be a strong option for renters "
        f"looking for comfort, location, and everyday convenience in Toronto."
    )


def generate_listing():
    bedrooms = random.choice([0, 1, 1, 2, 2, 3])
    bathrooms = 1 if bedrooms <= 1 else random.choice([1, 2])
    neighbourhood = random.choice(neighbourhoods)
    property_type = random.choice(property_types)

    latitude, longitude = generate_coordinates(neighbourhood)

    sqft = random.randint(400, 1200)

    if bedrooms == 0:
        sqft = random.randint(300, 500)

    amenities = random.sample(amenities_pool, random.randint(2, 5))
    transit_minutes = random.randint(3, 25)

    description = generate_description(
        bedrooms,
        property_type,
        neighbourhood,
        amenities,
        transit_minutes
    )

    contact_name = fake.name()
    selected_images = random.sample(image_urls, 3)

    return {
        "title": f"{bedrooms if bedrooms > 0 else 'Studio'} Bedroom {property_type} in {neighbourhood}",
        "price": generate_price(bedrooms, neighbourhood),
        "neighbourhood": neighbourhood,
        "address": fake.street_address() + ", Toronto, ON",
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "sqft": sqft,
        "propertyType": property_type,
        "amenities": amenities,
        "nearestStation": random.choice(stations),
        "transitMinutes": transit_minutes,
        "description": description,

        "imageUrl": selected_images[0],
        "imageUrls": selected_images,

        "contactName": contact_name,
        "contactEmail": fake.email(),
        "contactPhone": fake.phone_number(),

        "latitude": latitude,
        "longitude": longitude,

        "source": "synthetic_seed",
        "createdAt": datetime.now(UTC),
        "updatedAt": datetime.now(UTC)
    }


def seed_data(count=150):
    listings_collection.delete_many({"source": "synthetic_seed"})

    listings = [generate_listing() for _ in range(count)]
    listings_collection.insert_many(listings)

    print(
        f"Inserted {count} Toronto rental listings with improved descriptions, neighbourhood-based coordinates, image galleries, and contact info into MongoDB Atlas."
    )


if __name__ == "__main__":
    seed_data()