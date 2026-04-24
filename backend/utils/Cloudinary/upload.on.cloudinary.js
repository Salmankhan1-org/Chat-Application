
const cloudinary = require('../../config/cloudinary.config.js');
const { GetFileCategory } = require('../../middlewares/multer.middleware.js');


/**
 * Uploads a file to Cloudinary in the correct folder based on type.
 *
 * @param {string} filePath - Local path of the file (e.g., req.file.path)
 * @param {string} originalName - Original filename (for metadata)
 * @param {string} mimetype - MIME type of the file
 * @param {Object} options - Extra options (optional)
 *   - options.userId: used in folder path
 *   - options.chatId: used in folder path
 *   - options.customFolder: override folder
 * @returns {Object} Cloudinary result with media metadata
 */
const UploadOnCloudinary = async (filePath, originalName, mimetype, options = {}) => {
    const { userId, chatId, customFolder } = options;

    const category = GetFileCategory(mimetype);

    let folder;
    if (customFolder) {
        folder = customFolder;
    } else if (userId) {
        folder = `chat-app/users/${userId}`;
    } else if (chatId) {
        folder = `chat-app/messages/${chatId}`;
    } else {
        folder = "chat-app/uploads/temp";
    }

    let resourceType;
    if (category === "image") {
        resourceType = "image";
    } else if (category === "video") {
        resourceType = "video";
    } else if (category === "audio") {
        resourceType = "video"; // Cloudinary uses video for audio too
    } else {
        resourceType = "raw"; // for PDF, docs, etc.
    }

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: resourceType,
            public_id: `file_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
            unique_filename: true,
            // optional: set quality / format
            // format: "auto",
            // quality: "auto",
        });

        return {
            success: true,
            media: {
                publicId: result.public_id,
                url: result.secure_url,
                resourceType: result.resource_type,
                originalName: originalName,
                mimetype: mimetype,
                folder, // handy for debugging / cleanup
            },
        };
  } catch (error) {
        console.error("Cloudinary upload error:", error);
        return {
            success: false,
            message: error.message || "Upload to Cloudinary failed",
        };
  }
};

module.exports =  UploadOnCloudinary;