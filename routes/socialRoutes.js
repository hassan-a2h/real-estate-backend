import express from 'express';
const router = express.Router();
import {
  getSocialsLinks,
  getOneSocialLink,
  updateSocialLinks,
  getUserSocial
} from '../controllers/socialsController.js';

router.get('/', getSocialsLinks);
router.get('/:userId', getUserSocial);
router.get('/:id', getOneSocialLink);
router.post('/', updateSocialLinks);

export default router;