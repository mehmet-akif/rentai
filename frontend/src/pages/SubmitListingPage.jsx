import { useState } from "react";
import { createListing } from "../api/listingsApi";

function SubmitListingPage() {
  const [form, setForm] = useState({
    title: "",
    price: "",
    neighbourhood: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    propertyType: "Condo",
    amenities: "",
    transitMinutes: "",
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: ""
  });

  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const listingData = {
      ...form,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      sqft: Number(form.sqft),
      transitMinutes: Number(form.transitMinutes),
      amenities: form.amenities.split(",").map((item) => item.trim()),
      imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      imageUrls: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
      ],
      latitude: 43.6532,
      longitude: -79.3832,
      source: "user_demo"
    };

    await createListing(listingData);
    setSuccess("Demo listing submitted successfully!");
  };

  return (
    <div className="submit-page">
      <section className="submit-hero">
        <p className="eyebrow">For landlords</p>
        <h1>Submit a demo rental listing.</h1>
        <p>
          This form demonstrates RentAI’s create-listing workflow for portfolio
          and product testing purposes.
        </p>
      </section>

      {success && <div className="success-box">{success}</div>}

      <form className="submit-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Listing title" onChange={handleChange} required />
        <input name="price" placeholder="Monthly rent" onChange={handleChange} required />
        <input name="neighbourhood" placeholder="Neighbourhood" onChange={handleChange} required />
        <input name="address" placeholder="Address" onChange={handleChange} required />

        <select name="propertyType" onChange={handleChange}>
          <option>Condo</option>
          <option>Apartment</option>
          <option>Basement</option>
          <option>Townhouse</option>
          <option>Studio</option>
        </select>

        <input name="bedrooms" placeholder="Bedrooms" onChange={handleChange} required />
        <input name="bathrooms" placeholder="Bathrooms" onChange={handleChange} required />
        <input name="sqft" placeholder="Square feet" onChange={handleChange} required />
        <input name="transitMinutes" placeholder="Transit minutes" onChange={handleChange} required />

        <input
          name="amenities"
          placeholder="Amenities, comma separated: gym, parking, laundry"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          rows={5}
          onChange={handleChange}
          required
        />

        <input name="contactName" placeholder="Contact name" onChange={handleChange} required />
        <input name="contactEmail" placeholder="Contact email" onChange={handleChange} required />
        <input name="contactPhone" placeholder="Contact phone" onChange={handleChange} required />

        <button type="submit">Submit Demo Listing</button>
      </form>
    </div>
  );
}

export default SubmitListingPage;