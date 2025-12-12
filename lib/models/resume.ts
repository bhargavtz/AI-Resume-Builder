import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Resume title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    userId: {
        type: String,
        required: [true, 'User ID is required'],
        index: true
    },
    userEmail: {
        type: String,
        required: false,
        trim: true,
        lowercase: true
    },
    userName: {
        type: String,
        required: false,
        trim: true
    },
    content: {
        type: Object,
        default: {}
    },
    themeColor: {
        type: String,
        default: '#3b82f6',
        validate: {
            validator: function (v: string) {
                return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
            },
            message: 'Invalid hex color format'
        }
    },
    templateId: {
        type: String,
        default: 'modern',
        enum: ['modern', 'classic', 'minimal', 'creative']
    },
    shareToken: {
        type: String,
        unique: true,
        sparse: true,
        index: true
    },
    shareTokenExpiry: {
        type: Date,
        required: false
    },
    shareTokenMaxViews: {
        type: Number,
        required: false
    },
    shareTokenRevoked: {
        type: Boolean,
        default: false
    },
    shareEnabled: {
        type: Boolean,
        default: false
    },
    analytics: {
        views: { type: Number, default: 0 },
        downloads: { type: Number, default: 0 },
        lastViewed: { type: Date }
    },
    status: {
        type: String,
        default: 'draft',
        enum: ['draft', 'complete', 'archived']
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Indexes for faster queries
resumeSchema.index({ userId: 1, updatedAt: -1 });
resumeSchema.index({ userId: 1, title: 'text' });
resumeSchema.index({ userId: 1, status: 1 });
resumeSchema.index({ userId: 1, isDeleted: 1 });

// Virtual for formatted date
resumeSchema.virtual('formattedDate').get(function () {
    return this.updatedAt?.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
});

// Method to check if resume belongs to user
resumeSchema.methods.belongsToUser = function (userId: string) {
    return this.userId === userId;
};

// Static method to find user resumes
resumeSchema.statics.findByUserId = function (userId: string) {
    return this.find({ userId, isDeleted: false }).sort({ updatedAt: -1 });
};

const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

export default Resume;
