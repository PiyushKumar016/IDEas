import mongoose from "mongoose";

const FileTreeNodeSchema = new mongoose.Schema();

FileTreeNodeSchema.add({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['file', 'folder'],
    required: true,
  },
  theme: {
    type: String,
    default: '#7c3aed',
  },
  language: {
    type: String,
  },
  content: {
    type: String,
    default: '',
  },
  children: [FileTreeNodeSchema],
});
const ProjectSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      ref: 'User',
      required: true,
    },
    rootNode: {
      type: FileTreeNodeSchema,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

export const Project = mongoose.model('Project', ProjectSchema);
