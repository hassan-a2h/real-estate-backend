import SocialMedia from "../models/Social.js";
import User from '../models/User.js';

export const getSocialsLinks = async (req, res) => {
  try {
    const socials = await SocialMedia.find();
    res.status(200).json(socials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching socials', error });
  }
};

export const getOneSocialLink = async (req, res) => {
  try {
    const social = await SocialMedia.findById(req.params.id);
    if (!social) {
      return res.status(404).json({ message: 'Social not found' });
    }
    res.status(200).json(social);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching social', error });
  }
};

export const getUserSocial = async (req, res) => {
  const { userId } = req.params;
  try {
    const social = await SocialMedia.findOne({ user: userId });
    if (!social) {
      return res.status(404).json({ message: 'Social not found' });
    }
    res.status(200).json(social);
  } catch(err) {
    res.status(500).json({ message: 'Error fetching social', err });
  }
}

export const updateSocialLinks = async (req, res) => {
  const { twitterUrl, facebookUrl, instagramUrl, userId } = req.body;
  const user = await User.findOne({ _id: userId });

  console.log('user found:', user);

  if (user?.role !== 'agent') {
    return res.status(401).json({message: 'Only agents can have socials'});
  }

  try {
    const social = await SocialMedia.findOneAndUpdate(
      { user: userId },
      {
        twitterUrl,
        facebookUrl,
        instagramUrl,
        user: userId
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );
    res.status(200).json(social);
  } catch (error) {
    res.status(500).json({ message: 'Error updating social', error });
  }
};