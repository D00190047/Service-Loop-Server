const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  std_name: {
    type: String,
    required: true
  },
  std_email: {
    type: String,
    required: true
  },
  std_avatar: {
    type: String,
    required: true
  },
  post_title: {
    type: String,
    required: true
  },
  post_posted_on:
  {
    type: Date,
    required: true
  },
  post_desc:
  {
    type: String,
    required: true
  },
  post_desc_trunc:
  {
    type: String,
    required: true
  },
  post_status:
  {
    type: String,
    required: true
  },
  post_modules:
  {
    type: Array,
    required: true
  },
  post_tutor_email:
  {
    type: String
  },
  post_tutor_name: {
    type: String
  },
  post_agreement_offered: 
  {
    type: Boolean,
    default: false
  },
  post_agreement_signed: 
  {
    type: Boolean,
    default: false
  },
  tutorial_started: 
  {
    type: Boolean,
    default: false
  },
  tutorial_finished: 
  {
    type: Boolean,
    default: false
  },
  tutor_rated: 
  {
    type: Boolean,
    default: false
  },
  comment:
  {
    type: String
  },
  post_agreement_url:
  {
    type: String
  },
  tutor_signature:
  {
    type: String
  },
  tutorial_date: 
  {
    type: String
  },
  tutorial_time:
  {
    type: String
  },
  tutorial_end_time:
  {
    type: String
  },
  tutorial_room:
  {
    type: String
  },
  expire_at: {
    type: Date,
    default: Date.now, expires: 2505600
  }
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;