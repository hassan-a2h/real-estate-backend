import mongoose from 'mongoose';

// Define regex patterns for validating URLs
const twitterRegex = /^https:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]{1,15}$/;
const facebookRegex = /^https:\/\/(www\.)?facebook\.com\/[A-Za-z0-9.]{5,}$/;
const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]{1,30}$/;

const socialMediaSchema = new mongoose.Schema({
  twitterUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return twitterRegex.test(v);
      },
      message: props => `${props.value} is not a valid Twitter URL!`
    },
    minlength: [5, 'Twitter URL must be at least 5 characters long'],
    maxlength: [100, 'Twitter URL cannot exceed 100 characters']
  },

  facebookUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return facebookRegex.test(v);
      },
      message: props => `${props.value} is not a valid Facebook URL!`
    },
    minlength: [5, 'Facebook URL must be at least 5 characters long'],
    maxlength: [100, 'Facebook URL cannot exceed 100 characters']
  },

  instagramUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return instagramRegex.test(v);
      },
      message: props => `${props.value} is not a valid Instagram URL!`
    },
    minlength: [5, 'Instagram URL must be at least 5 characters long'],
    maxlength: [100, 'Instagram URL cannot exceed 100 characters']
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const SocialMedia = mongoose.model('SocialMedia', socialMediaSchema);

export default SocialMedia;
