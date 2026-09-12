import {v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadSingleBufferToCloudinary(
    fileBuffer, // actual image/file data stored temoparily om memory as binary data 
    folder = "wear.it/products"
) {
    return new Promise((resolve,reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    return reject(error );
                }
                if(!result){
                    return reject (new Error("Cloudinary upload failed: no result found") )
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                })
            }
        )
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    })
}

export async function uploadManyyBuffersToCloudinary(
    fileBuffers,
    folder = "wear.it/products"
){
    return Promise.all(
        fileBuffers.map((buffer) => uploadSingleBufferToCloudinary(buffer, folder))
    )
}
export async function deleteFromCloudinary(publicId) {
    return await Cloudinary.uploader.destroy(publicId)
}