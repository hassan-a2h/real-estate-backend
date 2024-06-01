import express from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing
} from '../controllers/listingsController.js';

const router = express.Router();

//  All CRUD routes
router.get('/', getListings);

router.get('/:id', getListingById);

router.post('/', createListing);

router.put('/:id', updateListing);

router.delete('/:id', deleteListing);

export default router;
