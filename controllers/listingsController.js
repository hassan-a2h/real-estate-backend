import Listing from '../models/Listing.js';

// Get all listings
export const getListings = async (req, res) => {
  const { agentId, category } = req.query;

  try {
    if (agentId) {
      const listings = await Listing.find({ postedBy: agentId });
      return res.status(200).json(listings);
    } else if (category) {
      const listings = await Listing.find({ category: category });
      return res.status(200).json(listings);
    }
  } catch(error) {
    return res.status(500).json({ message: 'Error fetching listings', error });
  }

  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error });
  }
};

// Get a single listing by ID
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('property id:', id);
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: 'No Listings created by user' });
    }
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error });
  }
};

// Create a new listing
export const createListing = async (req, res) => {
  const { title, description, price, location, images, status, postedBy, category } = req.body;

  try {
    const newListing = new Listing({
      title,
      description,
      price,
      location,
      images,
      status,
      postedBy,
      category,
    });

    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (error) {
      if (error.name === 'ValidationError') {
        const errors = Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {});
        return res.status(400).json({ errors });
      }
      res.status(500).json({ message: 'Error creating listing', error });
  }
};

// Update a listing
export const updateListing = async (req, res) => {
  const { title, description, price, location, images, status } = req.body;

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { title, description, price, location, images, status, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(updatedListing);
  } catch (error) {
    res.status(500).json({ message: 'Error updating listing', error });
  }
};

// Delete a listing
export const deleteListing = async (req, res) => {
  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);

    if (!deletedListing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing', error });
  }
};
