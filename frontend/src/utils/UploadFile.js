import axios from 'axios'

const UploadFile = async (image) => {
    // info:- for using env variables in react we need to add VITE as prefix and have to use import.meta.env while using them
    const cloudName = import.meta.env.VITE_CLOUD_NAME_FOR_IMAGE_UPLOAD

    const data = new FormData();
    
    data.append("file", image)
    data.append("upload_preset", "images_preset")

    try {
       
        console.log(cloudName)
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
        const res = await axios.post(url, data)
        const { secure_url } = res.data;
        return secure_url;
    } catch (error) {
        console.log(error)
    }
}

export default UploadFile;